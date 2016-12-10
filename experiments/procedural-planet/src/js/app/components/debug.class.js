(function()
{
    'use strict';

    APP.COMPONENTS.Debug = APP.CORE.Abstract.extend(
    {
        options :
        {

        },

        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.COMPONENTS.Debug.prototype.instance === null )
                return null;
            else
                return APP.COMPONENTS.Debug.prototype.instance;
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.started  = false;
            this.hidden   = false;
            this.browser  = new APP.TOOLS.Browser();
            this.ticker   = new APP.TOOLS.Ticker();
            this.keyboard = new APP.TOOLS.Keyboard();

            this.init_gui();
            this.init_stats();
            this.init_events();

            APP.COMPONENTS.Debug.prototype.instance = this;
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

            // Keyboard
            this.keyboard.on( 'down', function( character )
            {
                if( character === 't' )
                    that.toggle();
            } );
        },

        /**
         * START
         */
        start: function()
        {
            this.started = true;

            // Start hidden
            if( this.hidden )
                this.hide();
        },

        /**
         * TOGGLE
         */
        toggle: function()
        {
            if( this.hidden )
                this.show();
            else
                this.hide();
        },

        /**
         * SHOW
         */
        show: function()
        {
            this.hidden = false;
            this.gui.instance.domElement.style.display   = 'block';
            this.stats.instance.domElement.style.display = 'block';
        },

        /**
         * HIDE
         */
        hide: function()
        {
            this.hidden = true;
            this.gui.instance.domElement.style.display   = 'none';
            this.stats.instance.domElement.style.display = 'none';
        },

        /**
         * INIT GUI
         */
        init_gui: function()
        {
            var that = this;

            this.gui             = {};
            this.gui.instance    = new dat.GUI();
            this.gui.controllers = {};

            this.gui.instance.width = 300;
        },

        /**
         * INIT STATS
         */
        init_stats: function()
        {
            this.stats          = {};
            this.stats.instance = new rStats({
                CSSPath : 'src/css/',
                values  :
                {
                    raf :
                    {
                        caption : 'RAF (ms)',
                        over    : 25,
                        average : true
                    },
                    fps :
                    {
                        caption : 'Framerate (FPS)',
                        below   : 50,
                        average : true
                    }
                }
            });

            this.stats.instance.domElement = document.querySelector('.rs-base');
        },

        /**
         * FRAME
         */
        frame: function()
        {
            if(this.started)
            {
                // Stats
                this.stats.instance( 'raf' ).tick();
                this.stats.instance( 'fps' ).frame();
                this.stats.instance().update();
            }
        }
    });
})();




