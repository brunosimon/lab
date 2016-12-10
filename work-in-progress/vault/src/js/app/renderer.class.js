(function(window,APP)
{
    "use strict";

    APP.Renderer = Abstract.extend(
    {
        options :
        {
            shaders : true
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.canvas   = this.options.canvas;
            this.camera   = this.options.camera;
            this.scene    = this.options.scene;
            this.instance = new THREE.WebGLRenderer({canvas:this.options.canvas});

            this.retina = false;

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
            this.fxaa_pass.uniforms.resolution.value = new THREE.Vector2((this.retina ? 0.5 : 1) / window.innerWidth,(this.retina ? 0.5 : 1) / window.innerHeight);
            this.fxaa_pass.renderToScreen = true;
            this.composer.addPass(this.fxaa_pass);
        },

        /**
         * START
         */
        start: function(quality)
        {
            this.options.shaders = quality === 'low';
        },

        /**
         * RENDER
         */
        render: function()
        {
            if(this.options.shaders)
                this.composer.render();
            else
                this.instance.render(this.scene,this.camera);
        },

        /**
         * RESIZE
         */
        resize: function(width,height)
        {
            this.canvas.width  = width;
            this.canvas.height = height;

            this.fxaa_pass.uniforms.resolution.value = new THREE.Vector2(1 / (width * window.devicePixelRatio),1 / (height * window.devicePixelRatio));

            this.instance.setSize(width,height);
        }
    });
}(window,APP));
