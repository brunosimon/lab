(function(window,GAME)
{
    'use strict';

    GAME.HUD = Abstract.extend(
    {
        options:{
            cursor_size : 2
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.canvas  = this.options.canvas;
            this.context = this.canvas.getContext('2d');
        },

        start: function()
        {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.context.fillStyle = '#fff';
            this.context.fillRect(Math.round(this.canvas.width / 2 - this.options.cursor_size / 2),Math.round(this.canvas.height / 2 - this.options.cursor_size / 2),this.options.cursor_size,this.options.cursor_size);
        },

        /**
         * UPDATE
         */
        update: function()
        {
            // this.context.fillRect(0,0,10,10);
        }
    });
})(window,GAME);