var GAME = {};

(function(window,GAME)
{
    'use strict';

    GAME.App = Abstract.extend(
    {
        options:{},

        /**
         * INIT
         */
        init: function(options)
        {
            var that = this;

            this._super(options);

            this.controller = new GAME.Controller();
            this.hud        = new GAME.HUD({canvas:this.options.canvas_hud});
            this.debug      = new GAME.Debug({});
            this.world      = new GAME.World({canvas:this.options.canvas_game,controller:this.controller});
            this.ticker     = new GAME.Ticker();

            this.world.start();

            this.ticker.on('tic',this.update.bind(this));
            this.world.on('ready',this.start.bind(this));
        },

        /**
         * START
         */
        start: function()
        {
            this.ticker.start();
            this.hud.start();
        },

        /**
         * UPDATE
         */
        update: function()
        {
            this.debug.update();
            this.world.update(this.ticker);
        }
    });
})(window,GAME);