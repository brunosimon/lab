(function(window,APP)
{
    'use strict';

    APP.UI.Camera = Abstract.extend(
    {
        options :
        {
            fov   : 60,
            ratio : APP.conf.canvas.width/APP.conf.canvas.height,
            near  : 0.1,
            far   : 100000
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.instance = new THREE.PerspectiveCamera(this.options.fov,this.options.ratio,this.options.near,this.options.far);

            this.instance.position.z = 6;
            this.instance.position.y = 0;

            this.instance.lookAt(new THREE.Vector3());

            this.instance.rotation.order = 'YXZ';
        },

        /**
         * UPDATE
         */
        update: function()
        {
            
        },

        /**
         * RESIZE
         */
        resize: function(ratio)
        {
            this.instance.aspect = ratio;
            this.instance.updateProjectionMatrix();
        }
    });
})(window,APP);