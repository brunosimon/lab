(function(window)
{
    'use strict';

    APP.CORE.App = APP.CORE.Abstract.extend(
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

            this.browser = new APP.TOOLS.Browser();
            this.debug   = new APP.TOOLS.Debug();
            this.world   = new APP.COMPONENTS.WORLD.World();
        },

        /**
         * START
         */
        start: function()
        {
            this.browser.start();
            this.world.start();
        },

        /**
         * FRAME
         */
        frame: function()
        {
            this.browser.frame();
            this.debug.frame();
            this.world.frame();
        }
    });
})(window);
