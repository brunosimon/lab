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
        },

        /**
         * STARt
         */
        start: function()
        {
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
            this.gui.folders  = {};

            // Geometry
            this.gui.folders.geometries_folder = this.gui.instance.addFolder('Geometries');
            this.gui.folders.geometries_folder.open();

            this.gui.values.geometry = this.gui.folders.geometries_folder.add(app.world.particles,'target_index',{cloud:0,dot:1,sphere:2,car:3}).name('geometry');

            // Particles
            this.gui.folders.particles_folder = this.gui.instance.addFolder('Particles');

            this.gui.values.perlin_intensity       = this.gui.folders.particles_folder.add(app.world.particles.uniforms.perlin_intensity,'value',0,100).name('perlin intensity');
            this.gui.values.perlin_frequency       = this.gui.folders.particles_folder.add(app.world.particles.uniforms.perlin_frequency,'value',0.01,0.09).step(0.001).name('perlin frequency');
            this.gui.values.perlin_time_multiplier = this.gui.folders.particles_folder.add(app.world.particles.options,'time_multiplier',0,0.001).step(0.00001).name('time multiplier');
            this.gui.values.particles_count        = this.gui.folders.particles_folder.add(app.world.particles.options,'particles_count',1000,app.world.particles.options.particles_count_max).step(1).name('particles count');
            this.gui.values.particles_size         = this.gui.folders.particles_folder.add(app.world.particles.uniforms.particles_size,'value',1,100).step(1).name('particles size');
            this.gui.values.particles_color        = this.gui.folders.particles_folder.addColor(app.world.particles.options,'particles_color').name('particles color');

            this.gui.values.particles_count.onChange(function(value)
            {
                app.world.particles.create_particles(value);
            });

            this.gui.values.particles_color.onChange(function(value)
            {
                app.world.particles.uniforms.particles_color.value = new THREE.Color(value);
            });

            this.gui.values.geometry.onChange(function(value)
            {
                app.world.particles.go_to_geometry(value);
            });

            // Bad TV
            this.gui.folders.bad_tv = this.gui.instance.addFolder('Bad TV');

            this.gui.values.active               = this.gui.folders.bad_tv.add(app.world.renderer.options.bad_tv,'active');
            this.gui.values.min_iterations       = this.gui.folders.bad_tv.add(app.world.renderer.options.bad_tv,'min_iterations',0,10).step(1).name('min iterations');
            this.gui.values.max_iterations       = this.gui.folders.bad_tv.add(app.world.renderer.options.bad_tv,'max_iterations',0,10).step(1).name('max iterations');
            this.gui.values.min_duration         = this.gui.folders.bad_tv.add(app.world.renderer.options.bad_tv,'min_duration',0,1000).step(1).name('min duration');
            this.gui.values.max_duration         = this.gui.folders.bad_tv.add(app.world.renderer.options.bad_tv,'max_duration',0,1000).step(1).name('max duration');
            this.gui.values.min_between_duration = this.gui.folders.bad_tv.add(app.world.renderer.options.bad_tv,'min_between_duration',0,10000).step(1).name('min between');
            this.gui.values.max_between_duration = this.gui.folders.bad_tv.add(app.world.renderer.options.bad_tv,'max_between_duration',0,10000).step(1).name('max between');
            this.gui.values.rgb_offset           = this.gui.folders.bad_tv.add(app.world.renderer.options.bad_tv,'rgb_offset',0,0.1).name('RGB offset');

            this.gui.values.active.onChange(function(value)
            {
                // Relaunch
                if(value)
                    app.world.renderer.launch_bad_tv_effet();
            });

            this.gui.values.rgb_offset.onChange(function(value)
            {
                app.world.renderer.RGBShiftPass.uniforms.amount.value = value;
            });
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

            // GUI
            if(this.gui)
            {
                this.gui.values.perlin_intensity.updateDisplay();
            }
        }
    });
})(window);
