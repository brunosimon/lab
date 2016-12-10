(function(window,GAME)
{
    'use strict';

    GAME.Camera = Abstract.extend(
    {
        options:{
            fov   : 55,
            ratio : window.innerWidth/window.innerHeight,
            near  : 0.1,
            far   : 100000
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.three = new THREE.PerspectiveCamera(this.options.fov,this.options.ratio,this.options.near,this.options.far);

            this.three.rotation.order = 'YXZ';
        },

        /**
         * UPDATE
         */
        update: function(player)
        {
            this.three.rotation.y = player.rotation.y;
            this.three.rotation.x = player.rotation.x;

            this.three.position.x = player.position.x;
            this.three.position.y = player.position.y + player.size.head_height;
            this.three.position.z = player.position.z;
        }
    });
})(window,GAME);