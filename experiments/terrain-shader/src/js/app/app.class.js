var APP = {};
APP.UI = {};

(function(window)
{
    'use strict';

    APP.App = Abstract.extend(
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

            this.ui           = new APP.Ui();
            this.browser      = new APP.Browser();

            this.init_gui();
            this.init_events();
        },

        /**
         * INIT GUI
         */
        init_gui: function()
        {
            var that = this;

            this.gui          = {};
            this.gui.instance = new dat.GUI();
            this.gui.values   = {};

            this.gui.values.valley_elevation = this.gui.instance.add(this.ui.world.terrain.options,'valley_elevation',-4,4).step(0.01);
            this.gui.values.noise_elevation  = this.gui.instance.add(this.ui.world.terrain.options,'noise_elevation',-4,4).step(0.01);
            this.gui.values.speed            = this.gui.instance.add(this.ui.world.terrain.options,'speed',-1,1).step(0.01);
            this.gui.values.segments         = this.gui.instance.add(this.ui.world.terrain.options,'segments',10,400).step(1);
            this.gui.values.stroke_color     = this.gui.instance.addColor(this.ui.world.terrain.options,'stroke_color');
            this.gui.values.background_color = this.gui.instance.addColor(this.ui.world.renderer.options,'background_color');
            this.gui.values.antialiasing     = this.gui.instance.add(this.ui.world.renderer.options,'antialiasing');

            this.gui.values.valley_elevation.onChange(function(value)
            {
                that.ui.world.terrain.uniforms.valley_elevation.value = value;
            });

            this.gui.values.noise_elevation.onChange(function(value)
            {
                that.ui.world.terrain.uniforms.noise_elevation.value = value;
            });

            this.gui.values.speed.onChange(function(value)
            {
                that.ui.world.terrain.uniforms.speed.value = value;
            });

            this.gui.values.segments.onFinishChange(function(value)
            {
                that.ui.world.terrain.build_plane();
            });

            this.gui.values.stroke_color.onChange(function(value)
            {
                that.ui.world.terrain.uniforms.line_color.value = new THREE.Color(value);
            });

            this.gui.values.background_color.onChange(function(value)
            {
                that.ui.world.renderer.instance.setClearColor(value);
            });
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            this.browser.on('resize',function()
            {
                that.ui.resize(that.browser);
            });
        },

        /**
         * START
         */
        start: function()
        {
            this.browser.start();
            this.ui.start();
        }
    });
})(window);

