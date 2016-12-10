(function(window,APP)
{
    'use strict';

    APP.World = Abstract.extend(
    {
        options:
        {
        },

        /**
         * INIT
         */
        init: function(options)
        {
            var that = this;

            this._super(options);

            var start = 'default';
            if(this.options.origin === 'lo-moth')
                start = 'entrance';

            this.scene        = new THREE.Scene();
            that.camera       = new APP.Camera({ratio:this.options.canvas.width/this.options.canvas.height});
            this.renderer     = new APP.Renderer({canvas:this.options.canvas,camera:this.camera.object,scene:this.scene});
            this.models       = new APP.Models();
            that.player       = new APP.Player({controller:that.options.controller,collision_canvas:this.options.collision_canvas,floor:this.models.list.floor.mesh,start:start});
            this.skybox       = new APP.SkyBox({scene:this.scene});
            this.lights       = new APP.Lights({scene:this.scene});
            this.particles    = new APP.Particles({scene:this.scene,x:199,y:-3.5,z:-40});
            this.sound_system = this.options.sound_system;
            this.active       = true;
            this.buffering    = false;

            this.speaker           = {};
            this.speaker.i         = 0;
            this.speaker.increment = 0.01;

            // this.init_snow();
        },

        /**
         * START
         */
        start: function(quality)
        {
            var that     = this,
                textures = [];

            this.models.start(quality);
            this.renderer.start(quality);

            var ready = function()
            {
                that.player.floor.mesh = that.models.list.floor.mesh;
                that.player.start();

                that.init_intersections_detection();

                that.trigger('ready');
            };

            this.models.on('loading_update',function(infos)
            {
                that.trigger('loading_update',[infos]);
            });

            this.models.on('ready',function()
            {
                _.each(that.models.list,function(object,name)
                {
                    if(typeof object.texture !== 'undefined' && object.texture !== null)
                        textures.push(object.texture);

                    // Wireframe
                    if(name !== 'floor')
                    {
                        // var helper = new THREE.WireframeHelper(object.mesh);
                        // helper.material.color.set(0x666666);
                        // that.scene.add(helper);
                    }
                });

                ready();
                // that.init_texture_buffering(textures,ready);
            });

            this.player.on('zone_change',function(zone)
            {
                _.each(that.models.list,function(object,name)
                {
                    // Visible
                    if(object.visible)
                    {
                        // Should hide
                        if(object.zones.indexOf(zone) === -1)
                        {
                            that.scene.remove(object.mesh);
                            object.visible = false;
                        }
                    }

                    // Not visible
                    else
                    {
                        // Should show
                        if(object.zones.indexOf(zone) !== -1)
                        {
                            that.scene.add(object.mesh);
                            object.visible = true;
                        }
                    }

                });

                that.sound_system.update_zone(zone);
            });

            // var axis = new THREE.AxisHelper(75);
            // this.scene.add(axis);

            this.lights.start();
            this.particles.start();
        },

        init_texture_buffering: function(textures,callback)
        {
            var that     = this,
                geometry = new THREE.CubeGeometry(50,50,50),
                material = new THREE.MeshLambertMaterial({color:0xff0000}),
                mesh     = new THREE.Mesh(geometry,material),
                i        = 0,
                len      = textures.length,
                current  = 0;

            this.buffering = true;

            material.side = THREE.BackSide;
            this.scene.add(mesh);

            var change_texture = function()
            {
                material.map         = textures[current];
                material.needsUpdate = true;

                current++;
                if(current === len)
                {
                    that.buffering = false;
                    that.scene.remove(mesh);
                    callback.call();
                }
            };

            for(; i < len; i++)
                window.setTimeout(change_texture,i * 500);

            this.trigger('start_buffering');
        },

        /**
         * INIT INTERSECTIONS DETECTION
         */
        init_intersections_detection: function()
        {
            var that       = this,
                projector  = new THREE.Projector(),
                raycaster  = new THREE.Raycaster(),
                vector     = new THREE.Vector3(),
                intersects = null,
                current    = null,
                mesh       = null;

            // Add listeners
            this.models.add_listener_on_object('mouse_down','logo',function()
            {
                window.location.href = 'http://lo-moth.com/';
            });

            this.models.add_listener_on_object('mouse_move','logo',function()
            {
                // console.log('move logo');
            });

            function ray_cast_for_event(event,coords)
            {
                vector.set((coords.x/window.innerWidth) * 2 - 1, -(coords.y/window.innerHeight) * 2 + 1,0.5);
                projector.unprojectVector(vector,that.camera.object);

                raycaster.set(that.camera.object.position,vector.sub(that.camera.object.position).normalize());
                intersects = raycaster.intersectObjects(that.models.listened_objects.mouse_down);

                if(intersects.length > 0)
                {
                    mesh = intersects[0].object;

                    // Leave
                    if(current !== null && mesh !== current)
                    {
                        
                    }

                    // Enter
                    if(current === null)
                    {
                        mesh.material.transparent = true;
                        mesh.material.blending    = THREE.AdditiveBlending;
                        mesh.material.needsUpdate = true;

                    }

                    if(typeof mesh.action[event] === 'function')
                        mesh.action[event].call();

                    current = mesh;
                }
                else
                {
                    // Leave
                    if(current !== null)
                    {
                        current.material.blending = THREE.NoBlending;
                        current.material.needsUpdate = true;
                        current = null;
                    }
                }
            }

            that.options.controller.mouse.on('mouse_move',function(coords)
            {
                ray_cast_for_event('mouse_move',coords);
            });

            that.options.controller.mouse.on('mouse_down',function(coords)
            {
                ray_cast_for_event('mouse_down',coords);
            });
        },

        /**
         * UPDATE
         */
        update: function(ticker)
        {
            if(this.active)
            {
                // Snow
                // this.snow.time = new Date().getTime();
                // this.snow.delta = this.snow.time - this.snow.oldTime;
                // this.snow.oldTime = this.snow.time;

                // if (isNaN(this.snow.delta) || this.snow.delta > 1000 || this.snow.delta === 0 ) {
                //     this.snow.delta = 1000/60;
                // }

                // this.snow.uniforms.globalTime.value += this.snow.delta * 0.00015;

                // this.snow.targetPosition.x += (this.snow.mouseXpercent*250 - this.snow.targetPosition.x)/20;
                // this.snow.targetPosition.y += (-this.snow.mouseYpercent*300 - this.snow.targetPosition.y)/20;

                // Other
                this.particles.update();
                this.player.update(ticker);
                this.camera.update(this.player);
                this.renderer.render();

                this.speaker.i += this.speaker.increment;
                this.models.list.speaker.mesh.position.y = Math.sin(this.speaker.i) / 1.5 + 0.2;

                this.sound_system.update_position(this.player.position);
            }

            else if(this.buffering)
            {
                this.renderer.render();
            }
        },

        /**
         * RESIZE
         */
        resize: function(width,height)
        {
            this.camera.resize(width/height);
            this.renderer.resize(width,height);
        },

        /**
         * INIT SNOW
         */
        init_snow: function()
        {
            this.snow         = {};
            this.snow.delta   = 0;
            this.snow.time    = 0;
            this.snow.oldTime = 0;

            this.snow.mouseXpercent = 0;
            this.snow.mouseYpercent = 0;

            this.snow.particles = null;
            this.snow.targetPosition = new THREE.Vector3();// particles
            this.snow.map = THREE.ImageUtils.loadTexture( "src/textures/snowflake.png" );

            this.snow.attributes = {

                size:        { type: 'f', value: [] },
                customColor: { type: 'c', value: [] },
                time:        { type: 'f', value: [] },

            };

            this.snow.uniforms = {

                color:      { type: "c", value: new THREE.Color( 0x777777 ) },
                texture:    { type: "t", value: 0, texture: this.snow.map },
                globalTime: { type: "f", value: 0.0 },

            };

            this.snow.shaderMaterial = new THREE.ShaderMaterial( {

                uniforms:       this.snow.uniforms,
                attributes:     this.snow.attributes,
                vertexShader:   document.getElementById( 'vertexshader' ).textContent,
                fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

                blending:       THREE.AdditiveBlending,
                depthTest:      false,
                transparent:    true,
                
            });


            this.snow.geometry = new THREE.Geometry();

            for ( var i = 0; i < 10000; i++ ) {
                this.snow.vector = new THREE.Vector3(Math.random()*3000 - 1500, -2000, Math.random()*1800);

                this.snow.geometry.vertices.push( this.snow.vector );
            }

            this.snow.particles = new THREE.ParticleSystem( this.snow.geometry, this.snow.shaderMaterial );

            this.snow.particles.position.y = 1000;
            this.snow.particles.position.z = -900;

            this.snow.vertices     = this.snow.particles.geometry.vertices;
            this.snow.values_size  = this.snow.attributes.size.value;
            this.snow.values_color = this.snow.attributes.customColor.value;
            this.snow.values_time  = this.snow.attributes.time.value;

            for( var v = 0; v < this.snow.vertices.length; v++ ) {
                
                this.snow.values_size[v]  = 50+Math.random()*80;//baseSize[v];
                this.snow.values_color[v] = new THREE.Color(0xffffff);
                this.snow.values_color[v].setHSL(1.0, 0.0, 0.05 + Math.random()*0.9);
                this.snow.values_time[v] = Math.random();

            }

            this.scene.add(this.snow.particles);
        }
    });
})(window,APP);
