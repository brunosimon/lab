(function(window,APP)
{
    'use strict';

    APP.Lights = Abstract.extend(
    {
        options:{
            
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.scene  = this.options.scene;
        },

        /**
         * START
         */
        start: function()
        {
            var ambient = new THREE.AmbientLight(0xffffff);
            this.scene.add(ambient);
        },

        /**
         * CREATE A LINE OF LIGHTS
         * start_x
         * start_y
         * start_z
         * end_x
         * end_y
         * end_z
         * count
         * type
         * rotation_x
         * rotation_y
         * rotation_z
         * intensity
         * angle
         */
        create_lights_line: function(params)
        {
            for(var i = 0; i < params.count; i++)
            {
                var light  = null,
                    helper = null;

                switch(params.type)
                {
                    case 'point':
                        light  = new THREE.PointLight(params.color,params.intensity,params.distance);
                        helper = new THREE.PointLightHelper(light,0.1);
                        break;
                    case 'spot':
                        light  = new THREE.SpotLight(params.color,params.intensity,params.distance,params.angle);
                        helper = new THREE.SpotLightHelper(light,0.1);
                        //Rotation here
                        break;
                }

                var x = params.start_x + ((params.end_x - params.start_x) / params.count) * i,
                    y = params.start_y + ((params.end_y - params.start_y) / params.count) * i,
                    z = params.start_z + ((params.end_z - params.start_z) / params.count) * i;

                light.position.set(x,y,z);
                this.scene.add(light);
                this.scene.add(helper);
            }
        },

        /**
         * UPDATE
         */
        update: function(player)
        {
            
        }
    });
})(window,APP);