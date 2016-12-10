(function()
{
    'use strict';

    APP.COMPONENTS.UI = APP.CORE.Event_Emitter.extend(
    {
        options :
        {

        },

        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.COMPONENTS.UI.prototype.instance === null )
                return null;
            else
                return APP.COMPONENTS.UI.prototype.instance;
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.browser = new APP.TOOLS.Browser();
            this.ticker  = new APP.TOOLS.Ticker();

            APP.COMPONENTS.UI.prototype.instance = this;
        }
    });
})();




