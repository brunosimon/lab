(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.Renderer = APP.CORE.Abstract.extend(
    {
        options :
        {
            shaders : false,
            passes  :
            {
                bloom               : false,
                fxaa                : true,
                tilt_shift          : false,
                color               : false,
                brightness_contrast : false
            },
            canvas              : null,
            brightness          : 0.1,
            contrast            : 0.1,
            blur_strength       : 0.4,
            blur_amount         : 0.001,
            tilt_shift_position : 0.55,
            tilt_shift_strength : 1,
            color               : { r : 1.1, g : 1, b : 0.9 }
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
            this.horizontal_tilt_pass.uniforms.h.value = ( 1 / ( this.browser.width / this.wtf_ratio ) ) * this.options.tilt_shift_strength;
            this.vertical_tilt_pass.uniforms.v.value   = ( 1 / ( this.browser.height / this.wtf_ratio ) ) * this.options.tilt_shift_strength;

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

            this.instance.gammaInput  = true;
            this.instance.gammaOutput = true;
            this.instance.setClearColor( 0x000000, 0 );
            this.instance.setSize( this.browser.width, this.browser.height );

            // WTF ratio (completely change the quality)
            this.wtf_ratio = this.browser.pixel_ratio;
            this.wtf_ratio = 2;

            // Shaders
            this.bloom_pass               = new THREE.BloomPass( this.options.blur_strength, 25, 4, 512 );
            this.brightness_contrast_pass = new THREE.ShaderPass( THREE.BrightnessContrastShader );
            this.fxaa_pass                = new THREE.ShaderPass( THREE.FXAAShader );
            this.color_corection_pass     = new THREE.ShaderPass( THREE.ColorCorrectionShader );
            this.copy_pass                = new THREE.ShaderPass( THREE.CopyShader );
            this.render_pass              = new THREE.RenderPass( this.scene, this.camera );
            this.blend_pass               = new THREE.ShaderPass( THREE.AdditiveBlendShader, 'tDiffuse1' );
            this.horizontal_tilt_pass     = new THREE.ShaderPass( THREE.HorizontalTiltShiftShader );
            this.vertical_tilt_pass       = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );

            this.brightness_contrast_pass.uniforms.brightness.value = -0.06;
            this.brightness_contrast_pass.uniforms.contrast.value   = 0;

            this.fxaa_pass.uniforms.resolution.value.set( (1 / this.browser.width) / this.wtf_ratio, (1 / this.browser.height) / this.wtf_ratio );

            this.color_corection_pass.uniforms.powRGB.value = new THREE.Vector3( 1, 1, 1 );
            this.color_corection_pass.uniforms.mulRGB.value = new THREE.Vector3( this.options.color.r, this.options.color.g, this.options.color.b );

            this.horizontal_tilt_pass.uniforms.h.value = ( 1 / ( this.browser.width / this.wtf_ratio ) ) * this.options.tilt_shift_strength;
            this.vertical_tilt_pass.uniforms.v.value   = ( 1 / ( this.browser.height / this.wtf_ratio ) ) * this.options.tilt_shift_strength;

            this.horizontal_tilt_pass.uniforms.r.value = this.options.tilt_shift_position;
            this.vertical_tilt_pass.uniforms.r.value   = this.options.tilt_shift_position;

            // Set passes
            this.set_passes();

            // Init Debug
            this.init_debug();

            // // Ticker
            // this.ticker.on( 'tick' , function()
            // {
            //     that.frame();
            // } );
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

            if(this.options.passes.brightness_contrast)
            {
                this.composer_final.addPass( this.brightness_contrast_pass );
            }

            if(this.options.passes.fxaa)
            {
                this.composer_final.addPass( this.fxaa_pass );
            }

            if(this.options.passes.color)
            {
                this.composer_final.addPass( this.color_corection_pass );
            }

            if(this.options.passes.tilt_shift)
            {
                this.composer_final.addPass( this.horizontal_tilt_pass );
                this.composer_final.addPass( this.vertical_tilt_pass );
            }

            this.composer_final.addPass( this.copy_pass );

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

            this.debug = {};
            this.debug.instance = new APP.COMPONENTS.Debug();
            this.debug.instance.gui.render = this.debug.instance.gui.instance.addFolder( 'Render' );

            this.debug.shaders                    = this.debug.instance.gui.render.add( this.options,'shaders').name( 'shaders' );
            this.debug.brightness_contrast_shader = this.debug.instance.gui.render.add( this.options.passes, 'brightness_contrast' ).name( 'brightness / contrast' );
            this.debug.brightness                 = this.debug.instance.gui.render.add( this.brightness_contrast_pass.uniforms.brightness, 'value', -1, 1 ).step( 0.01 ).name( 'brightness' );
            this.debug.contrast                   = this.debug.instance.gui.render.add( this.brightness_contrast_pass.uniforms.contrast, 'value' ,-1 ,1 ).step( 0.01 ).name( 'contrast' );
            this.debug.fxaa_shader                = this.debug.instance.gui.render.add( this.options.passes, 'fxaa' ).name( 'FXAA shader' );
            this.debug.bloom_shader               = this.debug.instance.gui.render.add( this.options.passes, 'bloom' ).name( 'bloom shader' );
            this.debug.bloom_strength             = this.debug.instance.gui.render.add( this.bloom_pass.copyUniforms.opacity, 'value', 0, 2 ).step( 0.01 ).name( 'bloom strength' );
            this.debug.bloom_amount               = this.debug.instance.gui.render.add( this.options, 'blur_amount', 0, 0.01 ).step( 0.0001 ).name( 'bloom amount' );
            this.debug.tilt_shift_shader          = this.debug.instance.gui.render.add( this.options.passes, 'tilt_shift' ).name( 'tilt shift shader' );
            this.debug.tilt_shift_position        = this.debug.instance.gui.render.add( this.options, 'tilt_shift_position', 0, 1 ).step( 0.01 ).name( 'tilt position' );
            this.debug.tilt_shift_strength        = this.debug.instance.gui.render.add( this.options, 'tilt_shift_strength', 0, 10 ).step( 0.1 ).name( 'tilt strength' );
            this.debug.color_shader               = this.debug.instance.gui.render.add( this.options.passes, 'color' ).name( 'color shader' );
            this.debug.color_r                    = this.debug.instance.gui.render.add( this.color_corection_pass.uniforms.mulRGB.value, 'x', 0, 2 ).step( 0.1 ).name( 'color R' );
            this.debug.color_g                    = this.debug.instance.gui.render.add( this.color_corection_pass.uniforms.mulRGB.value, 'y', 0, 2 ).step( 0.1 ).name( 'color G' );
            this.debug.color_b                    = this.debug.instance.gui.render.add( this.color_corection_pass.uniforms.mulRGB.value, 'z', 0, 2 ).step( 0.1 ).name( 'color B' );

            var change_shaders = function()
            {
                that.set_passes();
            };

            this.debug.brightness_contrast_shader.onChange( change_shaders );
            this.debug.fxaa_shader.onChange( change_shaders );
            this.debug.bloom_shader.onChange( change_shaders );
            this.debug.tilt_shift_shader.onChange( change_shaders );
            this.debug.color_shader.onChange( change_shaders );

            this.debug.bloom_amount.onChange( function( value )
            {
                THREE.BloomPass.blurX.x = value;
                THREE.BloomPass.blurY.y = value;
            } );

            this.debug.tilt_shift_position.onChange( function( value )
            {
                that.horizontal_tilt_pass.uniforms.r.value = value;
                that.vertical_tilt_pass.uniforms.r.value   = value;
            } );

            this.debug.tilt_shift_strength.onChange( function( value )
            {
                that.horizontal_tilt_pass.uniforms.h.value = 4 / ( that.browser.width ) * value;
                that.vertical_tilt_pass.uniforms.v.value   = 4 / ( that.browser.height ) * value;
            } );
        },

        /**
         * FRAME
         */
        frame: function()
        {
            // console.log('render');
            if( !this.options.shaders )
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




