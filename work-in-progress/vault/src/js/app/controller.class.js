(function(window,APP)
{
    'use strict';

    APP.Controller = Abstract.extend(
    {
        options:{
            
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.keyboard = new APP.Keyboard();
            this.mouse    = new APP.Mouse();

            this.start();
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            // Keyboard
            this.keyboard.start_listening();

            // Mouse
            this.mouse.start_listening();
        },

        /**
         * UPDATE
         */
        update: function()
        {
            
        }
    });
})(window,APP);