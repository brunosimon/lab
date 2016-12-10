(function(window,GAME)
{
    'use strict';

    GAME.Global_Lights = Abstract.extend(
    {
        options :
        {
            ambient :
            {
                night :
                {
                    r : 57,
                    g : 66,
                    b : 91
                },
                day :
                {
                    r : 211,
                    g : 207,
                    b : 182
                }
            }
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
            var geometry = null,
                material = null,
                mesh     = null,
                light    = null;

            // Ambient light
            this.ambient       = {};
            this.ambient.color = 'rgb('+this.options.ambient.night.r+','+this.options.ambient.night.g+','+this.options.ambient.night.b+')';
            this.ambient.light = new THREE.AmbientLight(this.ambient.color);
            this.scene.add(this.ambient.light);

            // Directionnal light
            this.directional          = {};
            this.directional.strength = 0.7;
            this.directional.color    = 0xffffff;
            this.directional.light    = new THREE.DirectionalLight(this.directional.color,this.directional.strength);
            this.scene.add(this.directional.light);
        },

        /**
         * UPDATE
         */
        update: function(period)
        {
            // Ambient
            var color       = {};

            color.r   = Math.floor(this.options.ambient.night.r * period.night.intensity + this.options.ambient.day.r * period.day.intensity) / 255;
            color.g   = Math.floor(this.options.ambient.night.g * period.night.intensity + this.options.ambient.day.g * period.day.intensity) / 255;
            color.b   = Math.floor(this.options.ambient.night.b * period.night.intensity + this.options.ambient.day.b * period.day.intensity) / 255;

            this.ambient.light.color.setRGB(color.r,color.g,color.b);

            // Directional
            this.directional.light.intensity = period.day.intensity * this.directional.strength;
            this.directional.light.position.set(-0.5,Math.cos(-((period.progress + 0.5) % 1) * Math.PI * 2),Math.sin(-((period.progress + 0.5) % 1) * Math.PI * 2));
        }
    });
})(window,GAME);
