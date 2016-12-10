(function()
{
    "use strict";

    APP.TOOLS.Keyboard = APP.CORE.Event_Emitter.extend(
    {
        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.TOOLS.Keyboard.prototype.instance === null )
                return null;
            else
                return APP.TOOLS.Keyboard.prototype.instance;
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.ticker        = new APP.TOOLS.Ticker();
            this.browser       = new APP.TOOLS.Browser();
            this.shall_trigger = {};
            this.downs         = [];

            this.init_events();

            APP.TOOLS.Keyboard.prototype.instance = this;
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            // Ticker
            this.ticker.on( 'tick', function()
            {
                that.frame();
            } );

            // Down
            window.onkeydown = function( e )
            {
                var character = String.fromCharCode(e.keyCode).toLowerCase();
                that.shall_trigger.down = character;

                if( that.downs.indexOf( character ) === -1 )
                    that.downs.push( character );
            };

            // Up
            window.onkeyup = function( e )
            {
                var character = String.fromCharCode(e.keyCode).toLowerCase();
                that.shall_trigger.up = character;

                if( that.downs.indexOf( character ) !== -1 )
                    that.downs.splice( that.downs.indexOf( character ), 1 );
            };
        },

        /**
         * FRAME
         */
        frame: function()
        {
            var keys = Object.keys(this.shall_trigger);
            for( var i = 0; i < keys.length; i++ )
                this.trigger( keys[ i ] , [ this.shall_trigger[ keys[ i ]  ] ] );

            if( keys.length )
                this.shall_trigger = {};
        }
    });
})();
