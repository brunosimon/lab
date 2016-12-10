(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.Renderer = APP.CORE.Abstract.extend(
    {
        options :
        {
            shaders : true,
            passes  :
            {
                bloom : false,
                fxaa  : false
            },
            canvas        : null,
            blur_strength : 1.6,
            blur_amount   : 0.0008
        },

        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.COMPONENTS.WORLD.Renderer.prototype.instance === null )
                return null;
            else
                return APP.COMPONENTS.WORLD.Renderer.prototype.instance;
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.ticker  = new APP.TOOLS.Ticker();
            this.browser = new APP.TOOLS.Browser();

            this.init_events();

            APP.COMPONENTS.WORLD.Renderer.prototype.instance = this;
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;

            /* RESIZE */
            this.browser.on( 'resize', function()
            {
                that.resize();
            } );
        },

        /**
         * RESIZE
         */
        resize: function()
        {
            // Pass
            this.fxaa_pass.uniforms.resolution.value.set( (1 / this.browser.width) / this.wtf_ratio, (1 / this.browser.height) / this.wtf_ratio );

            // Renderer / Composers
            this.instance.setSize( this.browser.width, this.browser.height );
            this.composer_final.setSize( this.browser.width * this.wtf_ratio, this.browser.height * this.wtf_ratio );
        },

        /**
         * START
         */
        start: function(scene,camera)
        {
            var that = this;

            this.scene      = scene;
            this.camera     = camera;
            this.instance   = new THREE.WebGLRenderer( { canvas : this.options.canvas, alpha : true } );
            this.start_time = + ( new Date() );

            this.instance.setClearColor( 0x000000, 0 );
            this.instance.setSize( this.browser.width, this.browser.height );

            // WTF ratio (completely change the quality)
            this.wtf_ratio = this.browser.pixel_ratio;
            this.wtf_ratio = 2;

            // Shaders
            this.bloom_pass  = new THREE.BloomPass( this.options.blur_strength, 25, 4, 512 );
            this.fxaa_pass   = new THREE.ShaderPass( THREE.FXAAShader );
            this.copy_pass   = new THREE.ShaderPass( THREE.CopyShader );
            this.render_pass = new THREE.RenderPass( this.scene, this.camera );
            this.blend_pass  = new THREE.ShaderPass( THREE.AdditiveBlendShader, 'tDiffuse1' );

            this.fxaa_pass.uniforms.resolution.value.set( ( 1 / this.browser.width ) / this.wtf_ratio, ( 1 / this.browser.height ) / this.wtf_ratio );

            // Set passes
            this.set_passes();

            // Init Debug
            this.init_debug();

            // Ticker
            this.ticker.on( 'tick' , function()
            {
                that.frame();
            } );
        },

        /**
         * SET PASSES
         */
        set_passes: function()
        {
            // Render target
            var render_target_parameters = { minFilter : THREE.LinearFilter, magFilter : THREE.LinearFilter, format : THREE.RGBFormat, stencilBuffer : false };
            this.render_target = new THREE.WebGLRenderTarget( this.browser.width * this.wtf_ratio, this.browser.height * this.wtf_ratio, render_target_parameters );

            // Bloom composer
            this.composer_bloom = new THREE.EffectComposer( this.instance, this.render_target );

            // Normal composer
            this.composer_final = new THREE.EffectComposer( this.instance, this.render_target );

            this.blend_pass.uniforms.tDiffuse2.value = this.composer_bloom.renderTarget2;

            this.composer_final.addPass( this.render_pass );

            // Add passes
            if(this.options.passes.bloom)
            {
                this.composer_bloom.addPass( this.render_pass );
                this.composer_bloom.addPass( this.bloom_pass );
                this.composer_bloom.addPass( this.copy_pass );
            }

            if(this.options.passes.fxaa)
            {
                this.composer_final.addPass( this.fxaa_pass );
                this.composer_final.addPass( this.copy_pass );
            }

            if(this.options.passes.bloom)
            {
                this.composer_final.addPass( this.blend_pass );
                this.blend_pass.renderToScreen = true;
            }
            else
            {
                this.copy_pass.renderToScreen = true;
            }

            this.resize();
        },

        /**
         * INIT DEBUG
         */
        init_debug: function()
        {
            var that = this;

            this.debug          = {};
            this.debug.instance = new APP.COMPONENTS.Debug();
            this.debug.folder   = this.debug.instance.gui.instance.addFolder( 'Render' );

            this.debug.shaders        = this.debug.folder.add( this.options,'shaders').name( 'shaders' );
            this.debug.fxaa_shader    = this.debug.folder.add( this.options.passes, 'fxaa' ).name( 'FXAA shader' );
            this.debug.bloom_shader   = this.debug.folder.add( this.options.passes, 'bloom' ).name( 'bloom shader' );
            this.debug.bloom_strength = this.debug.folder.add( this.bloom_pass.copyUniforms.opacity, 'value', 0, 2 ).step( 0.01 ).name( 'bloom strength' );
            this.debug.bloom_amount   = this.debug.folder.add( this.options, 'blur_amount', 0, 0.01 ).step( 0.0001 ).name( 'bloom amount' );

            var change_shaders = function()
            {
                that.set_passes();
            };

            this.debug.fxaa_shader.onChange( change_shaders );
            this.debug.bloom_shader.onChange( change_shaders );

            this.debug.bloom_amount.onChange( function( value )
            {
                THREE.BloomPass.blurX.x = value;
                THREE.BloomPass.blurY.y = value;
            } );
        },

        /**
         * FRAME
         */
        frame: function()
        {
            if( !this.options.shaders || ( !this.options.passes.bloom && !this.options.passes.fxaa ) )
            {
                this.instance.render( this.scene, this.camera );
            }
            else
            {
                if(this.options.passes.bloom)
                    this.composer_bloom.render();

                this.composer_final.render();
            }
        }
    });
})();




