(function(window,GAME)
{
    'use strict';

    GAME.Controller = Abstract.extend(
    {
        options:{
            
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.keyboard = new GAME.Keyboard();
            this.mouse    = new GAME.Mouse();

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
})(window,GAME);