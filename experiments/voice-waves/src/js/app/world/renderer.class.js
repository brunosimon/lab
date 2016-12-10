H.World.Renderer = B.Core.Event_Emitter.extend(
{
    options :
    {
        shaders :
        {
            fxaa  :
            {
                active : false
            },
            bloom :
            {
                active   : true,
                strength : 1.4
            }
        }
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.browser  = new B.Tools.Browser();
        this.ticker   = new B.Tools.Ticker();
        this.registry = new B.Tools.Registry();
        this.camera   = this.registry.get( 'camera' );
        this.scene    = this.registry.get( 'scene' );
        this.instance = new THREE.WebGLRenderer( {
            canvas                : document.getElementById( 'canvas' ),
            alpha                 : false,
            preserveDrawingBuffer : true
        } );
        this.framed_rendered    = 0;
        this.screenshot_pending = false;
        this.locked_sizes       = false;

        this.browser.pixel_ratio = 2;
        this.instance.setPixelRatio( this.browser.pixel_ratio );

        // Set up passes
        this.passes         = {};
        this.passes.render  = new THREE.RenderPass( this.scene.object, this.camera.object );
        this.passes.fxaa    = new THREE.ShaderPass( THREE.FXAAShader );
        this.passes.bloom   = new THREE.BloomPass( this.options.shaders.bloom.strength, 25, 4, 128 );
        this.passes.copy    = new THREE.ShaderPass( THREE.CopyShader );
        this.passes.blend   = new THREE.ShaderPass( THREE.AdditiveBlendShader, 'tDiffuse1' );

        // Set up composer
        this.composers = {};

        // Update passes
        this.update_passes();

        // Add to registry
        this.registry.set( 'renderer', this );

        // Init
        this.init_events();
        this.init_debug();
    },

    /**
     * UPDATE PASSES
     */
    update_passes: function()
    {
        // Composers
        this.composers.render_target = new THREE.WebGLRenderTarget( this.browser.viewport.width * this.browser.pixel_ratio, this.browser.viewport.height * this.browser.pixel_ratio, { minFilter : THREE.LinearFilter, magFilter : THREE.LinearFilter, format : THREE.RGBFormat, stencilBuffer : false } );
        this.composers.bloom         = new THREE.EffectComposer( this.instance, this.composers.render_target );
        this.composers.main          = new THREE.EffectComposer( this.instance, this.composers.render_target );

        this.passes.blend.uniforms.tDiffuse2.value = this.composers.bloom.renderTarget2;

        // Bloom passes
        this.composers.bloom.addPass( this.passes.render );
        this.composers.bloom.addPass( this.passes.bloom );
        this.composers.bloom.addPass( this.passes.copy );

        // Main passes
        this.composers.main.addPass( this.passes.render );

        if( this.options.shaders.fxaa.active )
        {
            this.composers.main.addPass( this.passes.fxaa );
            this.composers.main.addPass( this.passes.copy );
        }

        this.composers.main.addPass( this.passes.blend );

        if( this.options.shaders.bloom.active )
            this.passes.blend.renderToScreen = true;
        else
            this.passes.copy.renderToScreen = true;
    },

    /**
     * INIT EVENTS
     */
    init_events : function(params)
    {
        var that = this;

        // Ticker tick event
        this.ticker.on( 'tick', function( infos )
        {
            that.frame( infos );
        });

        // Browser resize event
        that.browser.on( 'resize', function( viewport )
        {
            // Passes
            that.passes.fxaa.uniforms.resolution.value.set( 1 / (viewport.width * that.browser.pixel_ratio ), 1 / ( viewport.height * that.browser.pixel_ratio ) );

            // Renderer / Composers
            if( !that.locked_sizes )
            {
                that.instance.setSize( viewport.width, viewport.height );
                that.composers.main.setSize( viewport.width * that.browser.pixel_ratio, viewport.height * that.browser.pixel_ratio );
            }
        } );
    },

    /**
     * INIT DEBUG
     */
    init_debug : function()
    {
        // Set up
        var that = this,
            ui   = this.registry.get( 'dat-gui' );

        // Folder
        var folder = ui.addFolder( 'Renderer' );
        folder.open();

        var screenshot = folder.add( this, 'open_screenshot' );

        // FXAA param
        var fxaa = folder.add( this.options.shaders.fxaa, 'active' );
        fxaa.name( 'fxaa' );
        fxaa.onChange( function()
        {
            that.update_passes();
        } );

        // Bloom param
        var bloom = folder.add( this.options.shaders.bloom, 'active' ).listen();
        bloom.name( 'bloom' );
        bloom.onChange( function()
        {
            that.update_passes();
        } );

        // Bloom strength param
        var bloom_strength = folder.add( this.passes.bloom.copyUniforms.opacity, 'value', 0.1, 5 );
        bloom_strength.name( 'bloom strength' );
    },

    /**
     * FRAME
     */
    frame : function( infos )
    {
        var that = this;

        this.scene.floor.mirror.render();

        // No shader
        if( !this.options.shaders.bloom.active && !this.options.shaders.fxaa.active )
        {
            this.instance.render( this.scene.object, this.camera.object );
        }

        // Shaders
        else
        {
            if( this.options.shaders.bloom.active )
                this.composers.bloom.render();

            this.composers.main.render();
        }

        this.framed_rendered++;
        if( this.framed_rendered === 2 )
        {
            this.ticker.do_next( function()
            {

                that.trigger( 'ready' );
            } );
        }
    },

    /**
     * OPEN SCREENSHOT
     */
    open_screenshot: function()
    {
        var data = this.take_screenshot(),
            win  = window.open( data, '_blank' );

        win.focus();
    },

    /**
     * TAKE SCREENSHOT
     */
    take_screenshot : function( type, quality )
    {
        // Parameters
        if( typeof type === 'undefined' )
            type = 'image/png';

        if( typeof quality === 'undefined' )
            quality = 1;

        // Return dataURL
        return this.instance.domElement.toDataURL( type, quality );
    }
} );
