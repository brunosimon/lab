(function(window)
{
    'use strict';

    APP.COMPONENTS.WORLD.Lens = APP.CORE.Event_Emitter.extend(
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

            this.textures = [];

            this.browser = new APP.TOOLS.Browser();
            this.scene   = options.scene;
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            this.textures = [
                THREE.ImageUtils.loadTexture('src/img/lens-1.png'),
                THREE.ImageUtils.loadTexture('src/img/lens-2.png'),
                THREE.ImageUtils.loadTexture('src/img/lens-3.png'),
                THREE.ImageUtils.loadTexture('src/img/lens-4.png')
            ];

            var lensFlare = new THREE.LensFlare(this.textures[3], 700, 0.0, THREE.AdditiveBlending, new THREE.Color(0xffffff));

            lensFlare.add(this.textures[1], 512, 0.0, THREE.AdditiveBlending);
            lensFlare.add(this.textures[1], 512, 0.0, THREE.AdditiveBlending);
            lensFlare.add(this.textures[1], 512, 0.0, THREE.AdditiveBlending);

            lensFlare.add(this.textures[2], 60,  0.2, THREE.AdditiveBlending);
            lensFlare.add(this.textures[2], 70,  0.3, THREE.AdditiveBlending);
            lensFlare.add(this.textures[2], 120, 0.9, THREE.AdditiveBlending);
            lensFlare.add(this.textures[2], 70,  1.0, THREE.AdditiveBlending);

            lensFlare.customUpdateCallback = this.custom_update_callback;
            lensFlare.position.set(2000,0,-10000);

            this.scene.add(lensFlare);
        },

        /**
         * CUSTOM UPDATE CALLBACK
         */
        custom_update_callback: function(object)
        {
            var flare,
                vecX = -object.positionScreen.x * 2,
                vecY = -object.positionScreen.y * 2;


            for(var i = 0, len = object.lensFlares.length; i < len; i++)
            {
               flare = object.lensFlares[i];

               flare.x = object.positionScreen.x + vecX * flare.distance;
               flare.y = object.positionScreen.y + vecY * flare.distance;

               flare.rotation = 0;
            }

            // Custom part
            object.lensFlares[2].y += 0.025;
            object.lensFlares[3].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad(45);
        },

        /**
         * FRAME
         */
        frame: function()
        {

        }
    });
})(window);

