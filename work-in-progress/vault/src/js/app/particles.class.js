(function(window,APP)
{
    'use strict';

    APP.Particles = Abstract.extend(
    {
        options:{
            speed            : 0.03,
            fadeout_distance : 4,
            count            : 300,
            color            : new THREE.Color().setHSL(0.4,1,0.8),
            x                : 0,
            y                : 0,
            z                : 0
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.scene = this.options.scene;
        },

        /**
         * START
         */
        start: function()
        {
            this.geometry = new THREE.Geometry();
            this.material = new THREE.ParticleSystemMaterial({
                color           : 0xffffff,
                size            : 1,
                sizeAttenuation : false,
                vertexColors    : true
            });
            this.system = new THREE.ParticleSystem(this.geometry,this.material);
            var particule   = null;

            for(var i = 0; i < this.options.count; i++)
            {
                particule         = new THREE.Vector3(this.options.x,this.options.y,this.options.z);
                particule.speed   = {};
                particule.speed.x = Math.random() * this.options.speed - this.options.speed / 2;
                particule.speed.y = Math.random() * this.options.speed - this.options.speed / 2;
                particule.speed.z = Math.random() * this.options.speed - this.options.speed / 2;

                this.geometry.vertices.push(particule);
                this.geometry.colors.push(this.options.color);
            }

            this.scene.add(this.system);
        },

        /**
         * UPDATE
         */
        update: function()
        {
            for(var i = 0, len = this.geometry.vertices.length; i < len; i++)
            {
                var vertice  = this.geometry.vertices[i];

                if(Math.sqrt(Math.pow(vertice.x - this.options.x,2) + Math.pow(vertice.y - this.options.y,2) + Math.pow(vertice.z - this.options.z,2)) > this.options.fadeout_distance)
                {
                    vertice.x = this.options.x;
                    vertice.y = this.options.y;
                    vertice.z = this.options.z;
                }
                else
                {
                    vertice.x   += vertice.speed.x;
                    vertice.y   += vertice.speed.y;
                    vertice.z   += vertice.speed.z;
                }

            }
            this.geometry.verticesNeedUpdate = true;
        }
    });
})(window,APP);