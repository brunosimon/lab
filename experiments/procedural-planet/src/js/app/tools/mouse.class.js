(function()
{
    "use strict";

    APP.TOOLS.Mouse = APP.CORE.Event_Emitter.extend(
    {
        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.TOOLS.Mouse.prototype.instance === null )
                return null;
            else
                return APP.TOOLS.Mouse.prototype.instance;
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
            this.down          = false;
            this.x             = 0;
            this.y             = 0;
            this.ratio         = {};
            this.ratio.x       = 0;
            this.ratio.y       = 0;
            this.wheel         = {};
            this.wheel.delta   = 0;

            this.init_events();

            APP.TOOLS.Mouse.prototype.instance = this;
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
            window.onmousedown = function( e )
            {
                e.preventDefault();
                that.down = true;

                that.shall_trigger.down = e.target;
            };

            // Up
            window.onmouseup = function( e )
            {
                e.preventDefault();
                that.down = false;

                that.shall_trigger.up = e.target;
            };

            // Move
            window.onmousemove = function( e )
            {
                e.preventDefault();
                that.x = e.clientX;
                that.y = e.clientY;

                that.ratio.x = that.x / that.browser.width;
                that.ratio.y = that.y / that.browser.height;

                that.shall_trigger.move = e.target;
            };

            // Wheel
            var mouse_wheel_handler = function( e )
            {
                e.preventDefault();

                that.wheel.delta = e.wheelDeltaY || e.wheelDelta || - e.detail;

                that.shall_trigger.wheel = that.wheel.delta;

                return false;
            };
            document.addEventListener( 'mousewheel' , mouse_wheel_handler, false );
            document.addEventListener( 'DOMMouseScroll' , mouse_wheel_handler, false );
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
