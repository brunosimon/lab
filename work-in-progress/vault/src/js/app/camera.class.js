(function(window,APP)
{
    'use strict';

    APP.Camera = Abstract.extend(
    {
        options:{
            fov   : 60,
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

            this.object = new THREE.PerspectiveCamera(this.options.fov,this.options.ratio,this.options.near,this.options.far);

            this.object.rotation.order = 'YXZ';
        },

        /**
         * UPDATE
         */
        update: function(player)
        {
            this.object.rotation.y = player.rotation.y;
            this.object.rotation.x = player.rotation.x;

            this.object.position.x = player.position.x;
            this.object.position.y = player.position.y + player.size.eyes_height;
            this.object.position.z = player.position.z;
        },

        /**
         * RESIZE
         */
        resize: function(ratio)
        {
            this.object.aspect = ratio;
            this.object.updateProjectionMatrix();
        }
    });
})(window,APP);