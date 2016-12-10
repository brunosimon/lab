(function(window)
{
    'use strict';

    APP.COMPONENTS.WORLD.World = APP.CORE.Event_Emitter.extend(
    {
        options:
        {
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.need_update = false;
            this.offset_y    = 0;

            this.scene     = new THREE.Scene();
            this.camera    = new APP.COMPONENTS.WORLD.Camera({ratio:APP.CONF.canvas.width/APP.CONF.canvas.height});
            this.renderer  = new APP.COMPONENTS.WORLD.Renderer({camera:this.camera.instance,scene:this.scene});
            this.particles = new APP.COMPONENTS.WORLD.Particles({scene:this.scene});
            this.lens      = new APP.COMPONENTS.WORLD.Lens({scene:this.scene});
            this.debug     = new APP.TOOLS.Debug();
            this.browser   = new APP.TOOLS.Browser();

            // // Light
            // var ambient = new THREE.AmbientLight(0xffffff);
            // this.scene.add(ambient);

            this.init_events();
        },

        /**
         * START
         */
        start: function()
        {
            this.camera.start();
            this.particles.start();
            this.lens.start();
            this.renderer.start();
            this.debug.start();

            this.renderer.launch_bad_tv_effet();
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;


        },

        /**
         * FRAME
         */
        frame: function()
        {
            this.particles.frame();
            this.lens.frame();
            this.camera.frame();
            this.renderer.frame();
        }
    });
})(window);

