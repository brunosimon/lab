(function(window)
{
    "use strict";

    APP.TOOLS.Debug = APP.CORE.Abstract.extend(
    {
        options:
        {
            gui   : true,
            stats : true
        },

        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if(APP.TOOLS.Debug.instance === null)
                return null;
            else
                return APP.TOOLS.Debug.instance;
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            APP.TOOLS.Debug.instance = this;

            this.gui   = null;
            this.stats = null;

            if(this.options.gui)
                this.start_gui();

            if(this.options.stats)
                this.start_stats();
        },

        /**
         * START GUI
         */
        start_gui: function()
        {
            this.gui          = {};
            this.gui.instance = new dat.GUI();
            this.gui.values   = {};

            // this.gui.values.valley_elevation = this.gui.instance.add(this.ui.world.terrain.options,'valley_elevation',-4,4).step(0.01);
        },

        /**
         * START STATS
         */
        start_stats: function()
        {
            this.stats = new rStats({
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
        },

        /**
         * FRAME
         */
        frame: function()
        {
            // Stats
            if(this.stats)
            {
                this.stats('raf').tick();
                this.stats('fps').frame();
                this.stats().update();
            }
        }
    });
})(window);
