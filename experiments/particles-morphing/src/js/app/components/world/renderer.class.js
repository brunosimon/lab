(function(window)
{
    "use strict";

    APP.COMPONENTS.WORLD.Renderer = APP.CORE.Event_Emitter.extend(
    {
        options :
        {
            shaders : true,
            camera  : null,
            scene   : null,
            bad_tv :
            {
                active               : false,
                min_iterations       : 1,
                max_iterations       : 3,
                min_duration         : 100,
                max_duration         : 600,
                min_between_duration : 4000,
                max_between_duration : 4000,
                rgb_offset           : 0.01
            }
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.canvas       = APP.CONF.canvas;
            this.camera       = options.camera;
            this.scene        = options.scene;
            this.instance     = new THREE.WebGLRenderer({canvas:this.canvas,alpha:true});
            this.retina       = false;
            this.browser      = new APP.TOOLS.Browser();
            this.start_time   = +new Date();
            this.elapsed_time = +new Date();

            this.instance.setClearColor(0x020f15);
            this.instance.setSize(this.browser.width,this.browser.height);

            this.init_shaders();
            this.init_events();
        },

        /**
         * INIT SHADERS
         */
        init_shaders: function()
        {
            this.composer     = new THREE.EffectComposer(this.instance,new THREE.WebGLRenderTarget(this.browser.width,this.browser.height,{ minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false }));
            this.render_pass  = new THREE.RenderPass(this.scene,this.camera);
            this.copyPass     = new THREE.ShaderPass(THREE.CopyShader);
            this.RGBShiftPass = new THREE.ShaderPass(THREE.RGBShiftShader);
            this.badTVPass    = new THREE.ShaderPass(THREE.BadTVShader);

            this.badTVPass.uniforms.distortion.value  = 5;
            this.badTVPass.uniforms.distortion2.value = 8;
            this.badTVPass.uniforms.speed.value       = 0.001;
            this.badTVPass.uniforms.rollSpeed.value   = 0.0005;

            this.RGBShiftPass.uniforms.amount.value = this.options.bad_tv.rgb_offset;

            this.copyPass.renderToScreen = true;

            this.composer.addPass(this.render_pass);
            this.composer.addPass(this.copyPass);
            this.composer.addPass(this.RGBShiftPass);
            this.composer.addPass(this.badTVPass);
        },

        /**
         * LAUNCH BAD TV EFFECT
         */
        launch_bad_tv_effet: function()
        {
            var that = this;

            if(this.options.bad_tv.active)
            {
                window.setTimeout(function()
                {
                    // Pair count
                    var count = (that.options.bad_tv.min_iterations + Math.floor(Math.random() * that.options.bad_tv.max_iterations)) * 2,
                        time  = 0;

                    for(var i = 0; i < count; i++)
                    {
                        time += that.options.bad_tv.min_duration + Math.floor(Math.random() * that.options.bad_tv.max_duration);
                        window.setTimeout(function()
                        {
                            that.switch_bad_tv_effect();
                        },time);
                    }

                    that.launch_bad_tv_effet();

                },this.options.bad_tv.min_between_duration + Math.random() * this.options.bad_tv.max_between_duration);
            }
        },

        /**
         * SWITCH BAD TV EFFECT
         */
        switch_bad_tv_effect: function()
        {
            if(this.options.shaders)
            {
                if(this.copyPass.renderToScreen)
                {
                    this.copyPass.renderToScreen  = false;
                    this.badTVPass.renderToScreen = true;
                }
                else
                {
                    this.copyPass.renderToScreen  = true;
                    this.badTVPass.renderToScreen = false;
                }
            }
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            this.browser.on('resize',function()
            {
                that.canvas.width  = that.browser.width;
                that.canvas.height = that.browser.height;

                // this.fxaa_pass.uniforms.resolution.value = new THREE.Vector2(1 / (width * APP.CONF.pixel_ratio),1 / (height * APP.CONF.pixel_ratio));
                that.composer.setSize(that.browser.width * that.browser.pixel_ratio, that.browser.height * that.browser.pixel_ratio);

                that.instance.setSize(that.browser.width,that.browser.height);
            });
        },

        /**
         * FRAME
         */
        frame: function()
        {
            this.elapsed_time = +new Date() - this.start_time;

            if(this.options.shaders)
            {
                this.badTVPass.uniforms.time.value = this.elapsed_time;
                this.composer.render();
            }
            else
            {
                this.instance.render(this.scene,this.camera);
            }
        }
    });
}(window));
