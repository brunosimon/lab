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

            this.browser  = new APP.TOOLS.Browser();
            this.mouse    = new APP.TOOLS.Mouse();
            this.keyboard = new APP.TOOLS.Keyboard();
            this.css      = new APP.TOOLS.Css();
            this.ticker   = new APP.TOOLS.Ticker();
            this.debug    = new APP.COMPONENTS.Debug();
            this.world    = new APP.COMPONENTS.WORLD.World();
            this.sounds   = new APP.COMPONENTS.Sounds();
            this.ui       = new APP.COMPONENTS.UI();
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
            this.sounds.start();
            this.ui.start();

            this.ticker.run();
        }
    });
})();
