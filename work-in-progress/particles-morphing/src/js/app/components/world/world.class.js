(function(window)
{
    'use strict';

    APP.COMPONENTS.WORLD.World = APP.CORE.Event_Emitter.extend(
    {
        options:
        {
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.need_update = false;
            this.offset_y    = 0;

            this.scene    = new THREE.Scene();
            this.camera   = new APP.COMPONENTS.WORLD.Camera({ratio:APP.CONF.canvas.width/APP.CONF.canvas.height});
            this.renderer = new APP.COMPONENTS.WORLD.Renderer({camera:this.camera.instance,scene:this.scene});
            this.browser  = new APP.TOOLS.Browser();

            // Light
            var ambient = new THREE.AmbientLight(0xffffff);
            this.scene.add(ambient);

            this.init_events();
            this.demo();
        },

        /**
         * DEMO
         */
        demo: function()
        {
            var that = this;

            // Material
            var red_material = new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true});

            // Particles
            this.particles_geometry = new THREE.Geometry();
            this.particles_material = new THREE.PointCloudMaterial({
                    color           : 0xffffff,
                    size            : 0.02,
                    sizeAttenuation : true,
                    vertexColors    : false
                });
            this.particles_system = new THREE.PointCloud(this.particles_geometry,this.particles_material);

            this.scene.add(this.particles_system);

            // Loading manager
            var manager = new THREE.LoadingManager();
            manager.onProgress = function (item,loaded,total)
            {

            };

            // Load
            var loader = new THREE.OBJLoader(manager);

            loader.load( 'src/models/suzanne.obj',function(object)
            {
                object.traverse(function(child)
                {
                    if(child instanceof THREE.Mesh)
                    {
                        child.material        = red_material;
                        that.suzanne_vertices = child.geometry.vertices;

                        console.log(that.suzanne_vertices.length);
                    }
                });

                that.scene.add(object);
            });

            for(var i = 0; i < 600; i++)
            {
                this.particles_geometry.vertices.push(
                    new THREE.Vector3(
                        Math.random() * 20 - 10,
                        Math.random() * 20 - 10,
                        Math.random() * 20 - 10
                    )
                );
                this.particles_geometry.colors.push(
                    new THREE.Color().setHSL(Math.random(),0.5,0.5)
                );
            }
        },

        /**
         * START
         */
        start: function()
        {
            this.camera.start();
            this.renderer.start();
        },

        /**
         * START
         */
        init_events: function()
        {
            var that = this;

            // this.browser.on('mousemove',function()
            // {
            //     that.need_update = true;
            // });

            // this.browser.on('scroll',function()
            // {
            //     that.offset_y    = that.browser.top / 500;

            //     if(that.offset_y < 0)
            //         that.offset_y = 0;

            //     that.need_update = true;
            // });
        },

        /**
         * FRAME
         */
        frame: function()
        {
            // if(this.need_update)
            // {
            //     var x   = (this.browser.mouse.ratio.x - 0.8) * 6,
            //         y   = - (this.browser.mouse.ratio.y - 1) * 4 - this.offset_y,
            //         yaw = (this.browser.mouse.ratio.x - 0.3);

            //     if(y < 0.4)
            //         y = 0.4;

            //     TweenLite.to(this.camera.instance.position,0.15,{x:x,y:y,ease:'Quad.easeOut'});
            //     TweenLite.to(this.camera.instance.rotation,0.15,{y:yaw,ease:'Quad.easeOut'});
            // }

            // Update particles
            if(this.suzanne_vertices.length)
            {
                for(var i = 0, len = this.particles_geometry.vertices.length; i < len; i++)
                {
                    var particle_vertice    = this.particles_geometry.vertices[i],
                        destination_vertice = this.suzanne_vertices[i];

                    if(typeof destination_vertice !== 'undefined')
                    {
                        particle_vertice.x += (destination_vertice.x - particle_vertice.x) / 40;
                        particle_vertice.y += (destination_vertice.y - particle_vertice.y) / 40;
                        particle_vertice.z += (destination_vertice.z - particle_vertice.z) / 40;

                    }

                }
                this.particles_geometry.verticesNeedUpdate = true;
            }

            this.camera.frame();
            this.renderer.frame();
        }
    });
})(window);

