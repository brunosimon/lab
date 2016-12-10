(function(window,APP)
{
    "use strict";

    APP.UI.Renderer = Abstract.extend(
    {
        options :
        {
            antialiasing     : true,
            background_color : '#201b1b'
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.canvas   = APP.conf.canvas;
            this.camera   = this.options.camera;
            this.scene    = this.options.scene;
            this.instance = new THREE.WebGLRenderer({canvas:this.canvas});
            this.retina   = false;

            this.instance.setClearColor(this.options.background_color);
            this.instance.setSize(window.innerWidth,window.innerHeight);

            this.init_shaders();
        },

        /**
         * INIT SHADERS
         */
        init_shaders: function()
        {
            this.composer = new THREE.EffectComposer(this.instance);

            this.render_pass = new THREE.RenderPass(this.scene,this.camera);
            this.composer.addPass(this.render_pass);

            this.fxaa_pass = new THREE.ShaderPass(THREE.FXAAShader);
            this.fxaa_pass.uniforms.resolution.value = new THREE.Vector2((1 / APP.conf.pixel_ratio) / window.innerWidth,(1 / APP.conf.pixel_ratio) / window.innerHeight);
            this.fxaa_pass.renderToScreen = true;
            this.composer.addPass(this.fxaa_pass);

            // this.lines_pass = new THREE.ShaderPass(THREE.LinesShader);
            // this.lines_pass.uniforms.lineColor.value    = new THREE.Color(0x000000);
            // this.lines_pass.uniforms.lineDistance.value = 100;
            // this.lines_pass.uniforms.lineAlpha.value    = 0.05;
            // // this.lines_pass.uniforms.lineAlpha.value    = 1;
            // this.composer.addPass(this.lines_pass);

            // this.dots_pass = new THREE.ShaderPass(THREE.DotsShader);
            // this.dots_pass.uniforms.dotColor.value    = new THREE.Color(0x000000);
            // this.dots_pass.uniforms.dotDistance.value = 100;
            // this.dots_pass.renderToScreen = true;
            // this.composer.addPass(this.dots_pass);
        },

        /**
         * RENDER
         */
        render: function()
        {
            APP.conf.rS('render').start();
            if(this.options.antialiasing)
                this.composer.render();
            else
                this.instance.render(this.scene,this.camera);
            APP.conf.rS('render').end();
        },

        /**
         * RESIZE
         */
        resize: function(width,height)
        {
            this.canvas.width  = width;
            this.canvas.height = height;

            this.fxaa_pass.uniforms.resolution.value = new THREE.Vector2(1 / (width * APP.conf.pixel_ratio),1 / (height * APP.conf.pixel_ratio));
            this.composer.setSize(width * APP.conf.pixel_ratio, height * APP.conf.pixel_ratio);

            this.instance.setSize(width,height);
        }
    });
}(window,APP));
