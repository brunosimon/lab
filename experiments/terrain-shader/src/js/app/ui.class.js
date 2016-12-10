(function(window)
{
    'use strict';

    APP.Ui = Abstract.extend(
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

            this.world = new APP.UI.World();
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            this.world.start();

            // Start loop
            var loop = function ()
            {
                window.requestAnimationFrame(loop);
                that.update();
            };
            loop();
        },

        /**
         * UPDATE
         */
        update: function()
        {
            APP.conf.rS('raf').tick();
            APP.conf.rS('fps').frame();
            
            this.world.update();
            APP.conf.rS().update();
        },

        /**
         * RESIZE
         */
        resize: function(browser)
        {
            this.world.resize(browser);
        }
    });
})(window);

