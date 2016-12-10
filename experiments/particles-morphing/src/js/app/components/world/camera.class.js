(function(window)
{
    'use strict';

    APP.COMPONENTS.WORLD.Camera = APP.CORE.Event_Emitter.extend(
    {
        options :
        {
            fov    : 60,
            ratio  : 16/9,
            near   : 0.1,
            far    : 100000,
            origin :
            {
                x : 0,
                y : 60,
                z : 100
            },
            target :
            {
                x : 0,
                y : 60,
                z : -20
            }
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.instance = new THREE.PerspectiveCamera(this.options.fov,this.options.ratio,this.options.near,this.options.far);
            this.browser  = new APP.TOOLS.Browser();

            this.target = new THREE.Vector3(this.options.target.x,this.options.target.y,this.options.target.z);

            this.instance.position.z = this.options.origin.z;
            this.instance.position.y = this.options.origin.y;
            this.instance.rotation.order = 'YXZ';

            this.init_events();
        },

        /**
         * UPDATE
         */
        frame: function()
        {
            var x = (this.browser.mouse.ratio.x * 200 - 100 - this.instance.position.x),
                y = - (this.browser.mouse.ratio.y * 200 - 100) / (this.browser.width / this.browser.height);
            this.instance.position.x += (x + this.options.origin.x) / 30;
            this.instance.position.y += (y - this.instance.position.y + this.options.origin.y) / 30;
            this.instance.lookAt(this.target);
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
