(function(window,APP)
{
    'use strict';

    APP.UI.Terrain = Abstract.extend(
    {
        options :
        {
            valley_elevation : 1,
            noise_elevation  : 1,
            speed            : 0.4,
            segments         : 200,
            stroke_color     : '#de4343'
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.scene = this.options.scene;
            this.start = Date.now();

            this.uniforms = {
                time :
                {
                    type  : 'f',
                    value : 0.0
                },
                speed :
                {
                    type  : 'f',
                    value : this.options.speed
                },
                valley_elevation :
                {
                    type  : 'f',
                    value : this.options.valley_elevation
                },
                noise_elevation :
                {
                    type  : 'f',
                    value : this.options.noise_elevation
                },
                offset :
                {
                    type  : 'f',
                    value : this.options.valley_elevation
                },
                line_color :
                {
                    type  : 'c',
                    value : new THREE.Color(this.options.stroke_color)
                }
            };

            this.build_plane();

            this.mouse   = {};
            this.mouse.x = 0;
            this.mouse.y = 0;
            var that     = this;
            window.onmousemove = function(e)
            {
                that.mouse.x = e.clientX / window.innerWidth;
                that.mouse.y = e.clientY / window.innerHeight;
            };
        },

        /**
         * BUILD PLANE
         */
        build_plane: function()
        {
            if(this.plane_mesh)
                this.scene.remove(this.plane_mesh);

            this.plane_geometry = new THREE.PlaneGeometry(10,10,this.options.segments,this.options.segments);
            this.plane_material = new THREE.ShaderMaterial({
                vertexShader       : document.getElementById('shader-vertex-terrain').textContent,
                fragmentShader     : document.getElementById('shader-fragment-terrain').textContent,
                wireframe          : true,
                wireframeLinewidth : 2,
                transparent        : true,
                uniforms           : this.uniforms
            });
            this.plane_mesh = new THREE.Mesh(this.plane_geometry,this.plane_material);
            this.plane_mesh.rotation.x = - Math.PI / 2;
            this.plane_mesh.position.y = -0.5;
            this.scene.add(this.plane_mesh);
        },

        /**
         * UPDATE
         */
        update: function()
        {
            this.plane_material.uniforms['time'].value = APP.conf.clock.getElapsedTime();
        }
    });
})(window,APP);
