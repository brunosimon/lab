(function(window)
{
    'use strict';

    APP.COMPONENTS.WORLD.Camera = APP.CORE.Event_Emitter.extend(
    {
        options :
        {
            fov   : 60,
            ratio : 16/9,
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
            this.browser  = new APP.TOOLS.Browser();

            this.instance.position.z = 6;
            this.instance.position.y = 0;
            this.instance.lookAt(new THREE.Vector3());
            this.instance.rotation.order = 'YXZ';

            this.init_events();
        },

        /**
         * UPDATE
         */
        frame: function()
        {

        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            this.browser.on('resize',function()
            {
                that.instance.aspect = that.browser.width / that.browser.height;
                that.instance.updateProjectionMatrix();
            });
        }
    });
})(window);
