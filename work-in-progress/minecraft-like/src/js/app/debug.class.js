(function(window,GAME)
{
    'use strict';

    GAME.Debug = Abstract.extend(
    {
        options:{
            stats : true,
            gui   : true
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            if(this.options.stats)
                this.init_stats();

            if(this.options.gui)
                this.init_gui();
        },

        /**
         * INIT STATS
         */
        init_stats: function()
        {
            this.stats = new Stats();
            this.stats.setMode(0);
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.right    = '15px';
            this.stats.domElement.style.bottom   = '0px';
            document.body.appendChild(this.stats.domElement);
        },

        /**
         * UPDATE STATS
         */
        update_stats: function()
        {
            if(!this.stats)
                return;

            this.stats.end();
            this.stats.begin();
        },

        /**
         * INIT GUI
         */
        init_gui: function()
        {
            this.gui = new dat.GUI();
        },

        /**
         * UPDATE
         */
        update: function()
        {
            this.update_stats();
        }
    });
})(window,GAME);