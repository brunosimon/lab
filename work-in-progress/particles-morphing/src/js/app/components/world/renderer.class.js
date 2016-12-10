(function(window)
{
    "use strict";

    APP.COMPONENTS.WORLD.Renderer = APP.CORE.Event_Emitter.extend(
    {
        options :
        {
            shaders : false,
            camera  : null,
            scene   : null
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.canvas   = APP.CONF.canvas;
            this.camera   = options.camera;
            this.scene    = options.scene;
            this.instance = new THREE.WebGLRenderer({canvas:this.canvas});
            this.retina   = false;
            this.browser  = new APP.TOOLS.Browser();

            this.instance.setClearColor(0x000000);
            this.instance.setSize(window.innerWidth,window.innerHeight);

            this.init_shaders();
            this.init_events();
        },

        /**
         * INIT SHADERS
         */
        init_shaders: function()
        {
            // this.composer = new THREE.EffectComposer(this.instance);

            // this.render_pass = new THREE.RenderPass(this.scene,this.camera);
            // // this.render_pass.renderToScreen = true;
            // this.composer.addPass(this.render_pass);

            // this.fxaa_pass = new THREE.ShaderPass(THREE.FXAAShader);
            // this.fxaa_pass.uniforms.resolution.value = new THREE.Vector2((1 / APP.CONF.pixel_ratio) / window.innerWidth,(1 / APP.CONF.pixel_ratio) / window.innerHeight);
            // this.fxaa_pass.renderToScreen = true;
            // this.composer.addPass(this.fxaa_pass);
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
                // this.composer.setSize(width * APP.CONF.pixel_ratio, height * APP.CONF.pixel_ratio);

                that.instance.setSize(that.browser.width,that.browser.height);
            });
        },

        /**
         * FRAME
         */
        frame: function()
        {
            if(this.options.shaders)
                this.composer.render();
            else
                this.instance.render(this.scene,this.camera);
        }
    });
}(window));
