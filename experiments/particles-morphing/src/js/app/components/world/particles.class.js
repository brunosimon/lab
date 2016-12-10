(function(window)
{
    'use strict';

    APP.COMPONENTS.WORLD.Particles = APP.CORE.Event_Emitter.extend(
    {
        options:
        {
            start_distance      : 200,
            attenuation         : 40,
            time_multiplier     : 0.00003,
            transition_duration : 6000,
            easing              : 'quintInOut',
            particles_count     : 60000,
            particles_count_max : 200000,
            particles_color     : '#eb4927', // dc4828 // eb4927
            models              :
            [
                {
                    type     : 'cloud',
                    position : {x : 0, y : 0, z : 0}
                },
                {
                    type     : 'dot',
                    position : {x : 0, y : 0, z : 0}
                },
                {
                    type     : 'sphere',
                    position : {x : 0, y : 0, z : 0}
                },
                {
                    type     : 'obj',
                    show     : false,
                    url      : 'src/models/audi_tt.obj',
                    position : {x : 0, y : 0, z : 0},
                    scale    : 6
                }
            ]
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.uniforms           = null;
            this.attributes         = null;
            this.texture            = null;
            this.particles_geometry = null;
            this.particles_material = null;
            this.invert             = false;
            this.target_index       = 0;
            this.origins            = [];
            this.speed              = 20;
            this.loaded             = false;
            this.start_time         = + new Date();
            this.time               = + new Date();
            this.models             = [];

            this.browser = new APP.TOOLS.Browser();
            this.scene   = options.scene;
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            // Material
            this.texture = THREE.ImageUtils.loadTexture('src/img/spark-9.png');

            // Uniform
            this.uniforms =
            {
                texture          : { type : 't', value: this.texture },
                pixel_ratio      : { type : 'f', value: this.browser.pixel_ratio },
                perlin_intensity : { type : 'f', value: 60 },
                perlin_frequency : { type : 'f', value: 0.014 },
                time             : { type : 'f', value: 0 },
                particles_size   : { type : 'f', value: 3 },
                particles_color  : { type : 'c', value: new THREE.Color( this.options.particles_color ) },
            };

            // Attributes
            this.attributes =
            {
                // customColor : { type: 'c', value: [] },
                alpha : { type: 'f', value: [] },
            };

            // Materials
            this.particles_material = new THREE.ShaderMaterial(
            {
                attributes     : this.attributes,
                uniforms       : this.uniforms,
                vertexShader   : document.getElementById('vertexshader').textContent,
                fragmentShader : document.getElementById('fragmentshader').textContent,
                transparent    : true,
                blending       : THREE.AdditiveBlending,
                depthTest      : false,
                // alphaTest      : 0.5,
                // vertexColors    : true
            });
            // this.particles_material = new THREE.PointCloudMaterial({
            //     color           : 0xffffff,
            //     size            : 0.5,
            //     sizeAttenuation : true,
            //     vertexColors    : false
            // });

            // Loading manager
            var manager = new THREE.LoadingManager(),
                loader  = new THREE.OBJLoader(manager);
            manager.onProgress = function (item,loaded,total)
            {
                if(loaded === total)
                {
                    that.loaded = true;
                    that.go_to_geometry(0,false);
                }
            };

            // Models
            var model  = null,
                origin = null,
                i      = null;

            for(var k = 0; k < this.options.models.length; k++)
            {
                model = this.options.models[k];

                // Cloud
                if(model.type === 'cloud')
                {
                    // Cloud
                    var cloud_vertices = [];

                    for(i = 0; i < this.options.particles_count_max; i++)
                    {
                        origin = this.get_random_vector_3(0,0,0,that.options.start_distance,false);
                        origin.y /= 3;

                        cloud_vertices.push(origin);
                    }

                    // Add to models
                    this.models.push({
                        position :
                        {
                            x : 0,
                            y : 0,
                            z : 0
                        },
                        geometry : cloud_vertices
                    });
                }

                // Dot
                else if(model.type === 'dot')
                {
                    // Cloud
                    var dot_vertices = [];

                    dot_vertices.push(new THREE.Vector3(0,0,0));

                    // Add to models
                    this.models.push({
                        position :
                        {
                            x : 0,
                            y : 0,
                            z : 0
                        },
                        geometry : dot_vertices
                    });
                }

                // Sphere
                else if(model.type === 'sphere')
                {
                    // Cloud
                    var sphere_vertices = [];

                    for(i = 0; i < this.options.particles_count_max; i++)
                    {
                        origin = this.get_random_vector_3(0,0,0,that.options.start_distance / 4,true);

                        sphere_vertices.push(origin);
                    }

                    // Add to models
                    this.models.push({
                        position :
                        {
                            x : 0,
                            y : 0,
                            z : 0
                        },
                        geometry : sphere_vertices
                    });
                }

                // OBJ
                else if(model.type === 'obj')
                {
                    (function(index,model)
                    {
                        loader.load(model.url,function(object)
                        {
                            object.traverse(function(child)
                            {
                                if(child instanceof THREE.Mesh)
                                {
                                    // Debug red material
                                    child.material = new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true});

                                    if(model.scale !== 1)
                                    {
                                        for(var j = 0, lenj = child.geometry.vertices.length; j < lenj; j++)
                                        {
                                            child.geometry.vertices[j].x *= model.scale;
                                            child.geometry.vertices[j].y *= model.scale;
                                            child.geometry.vertices[j].z *= model.scale;
                                        }
                                    }

                                    // Add to models
                                    that.models[index] =
                                    {
                                        position : model.position,
                                        geometry : child.geometry.vertices
                                    };

                                }
                            });

                            object.position.set(model.position.x,model.position.y,model.position.z);

                            // Show debug
                            if(model.show)
                                that.scene.add(object);
                        });
                    })(k,model);
                }
            };

            // Create particle system
            this.create_particles(this.options.particles_count_max);

            // Ugly fix
            window.requestAnimationFrame(function()
            {
                this.create_particles(this.options.particles_count);
            }.bind(this));
        },

        /**
         * CREATE PARTICLES
         */
        create_particles: function(count)
        {
            // Reset
            if(this.particles_system)
            {
                this.scene.remove(this.particles_system);
                this.origins = [];
                this.attributes.alpha.value = [];
            }

            this.particles_geometry = new THREE.Geometry();
            for(var i = 0; i < count; i++)
            {
                this.origins.push(this.models[0].geometry[i].clone());
                this.particles_geometry.vertices.push(this.models[0].geometry[i].clone());
                this.attributes.alpha.value[i] = Math.random() * 0.9;
            }
            this.particles_system = new THREE.PointCloud(this.particles_geometry,this.particles_material);

            this.particles_system.position.set(0, 50, 0);
            this.particles_system.dynamic = true;
            // this.particles_system.sortParticles = true;

            this.scene.add(this.particles_system);
        },

        /**
         * GET RANDOM VECTOR 3
         */
        get_random_vector_3: function(x,y,z,distance,stick_to_surface)
        {
            // Defaults
            x                = x || 0;
            y                = y || false;
            z                = z || false;
            distance         = distance || false;
            stick_to_surface = stick_to_surface || false;

            // Cordinates
            var u1    = Math.random() * 2 - 1,
                u2    = Math.random(),
                r     = Math.sqrt(1 - u1 * u1),
                theta = 2 * Math.PI * u2;

            // Stick to surface or disperce inside sphere
            if(!stick_to_surface)
                distance = Math.random() * distance;

            // Return
            return new THREE.Vector3(
                r * Math.cos(theta) * distance + x,
                r * Math.sin(theta) * distance + y,
                u1 * distance + z
            );
        },

        /**
         * FRAME
         */
        frame: function()
        {
            // Update particles
            if(this.models.length && this.loaded)
            {
                var elapsed_time        = (+ new Date()) - this.time,
                    origins_length      = this.origins.length,
                    model               = this.models[this.target_index],
                    destinations_length = this.models[this.target_index].geometry.length;

                if(elapsed_time < this.options.transition_duration)
                {
                    var progress = elapsed_time / this.options.transition_duration;

                    // console.log(progress);

                    // Each vertice
                    // (Make sure of having always more particles that the destinations models)
                    for(var i = 0, len = this.particles_geometry.vertices.length; i < len; i++)
                    {
                        var particle_vertice = this.particles_geometry.vertices[i],
                            alpha_attribute  = this.attributes.alpha.value[i],
                            origin           = this.origins[i],
                            destination      = model.geometry[i % (destinations_length)],
                            vector           = null;

                        // Position
                        vector = new THREE.Vector3(
                            model.position.x + destination.x - origin.x,
                            model.position.y + destination.y - origin.y,
                            model.position.z + destination.z - origin.z
                        );

                        // particle_vertice.x = Easie[this.options.easing](progress,origin.x,vector.x,1);
                        // particle_vertice.y = Easie[this.options.easing](progress,origin.y,vector.y,1);
                        // particle_vertice.z = Easie[this.options.easing](progress,origin.z,vector.z,1);
                        particle_vertice.x = origin.x + Easie[this.options.easing](progress,0,vector.x,1);
                        particle_vertice.y = origin.y + Easie[this.options.easing](progress,0,vector.y,1);
                        particle_vertice.z = origin.z + Easie[this.options.easing](progress,0,vector.z,1);

                        // Alpha attributes
                        if(i < destinations_length)
                        {
                            if(this.attributes.alpha.value[i] < 1)
                                this.attributes.alpha.value[i] += 0.01;
                        }
                        else
                        {
                            if(this.attributes.alpha.value[i] > 0)
                                this.attributes.alpha.value[i] -= 0.01;
                        }
                    }
                }

                // Update
                this.particles_geometry.verticesNeedUpdate = true;
                this.attributes.alpha.needsUpdate          = true;
            }

            this.uniforms.time.value = ((+new Date()) - this.start_time) * this.options.time_multiplier;
        },

        /**
         * GO TO GEOMETRY
         */
        go_to_geometry: function(index,tween)
        {
            if(typeof tween === 'undefined')
                tween = true;

            var that = this;

            this.target_index = index;
            this.time         = + new Date();
            this.origins      = this.particles_geometry.vertices.slice();

            var missing_count = this.origins.length - this.models[this.target_index].geometry.length;

            if(missing_count > 0)
            {
                while(missing_count)
                {
                    this.origins.push(this.get_random_vector_3(0,0,0,this.options.start_distance,false))
                    missing_count--;
                }
            }

            if(tween)
            {
                if(index == 0)
                    TweenLite.to(this.uniforms.perlin_intensity,3,{value:60,ease:Power2.easeInOut});
                else
                    TweenLite.to(this.uniforms.perlin_intensity,3,{value:0,ease:Power2.easeInOut});
            }
        }
    });
})(window);

