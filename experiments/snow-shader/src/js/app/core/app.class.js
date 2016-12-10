(function()
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
        init: function( options )
        {
            this._super( options );

            this.browser = new APP.TOOLS.Browser();
            this.mouse   = new APP.TOOLS.Mouse();
            this.ticker  = new APP.TOOLS.Ticker();
            this.debug   = new APP.COMPONENTS.Debug();
            this.world   = new APP.COMPONENTS.WORLD.World();
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            this.browser.start();
            this.world.start();
            this.debug.start();

            this.ticker.run();
        },
    });
})();
