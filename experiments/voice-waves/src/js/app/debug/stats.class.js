H.Debug.Stats = B.Core.Abstract.extend(
{
    options :
    {
        visible : true
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.registry = new B.Tools.Registry();
        this.ticker   = new B.Tools.Ticker();
        this.keyboard = new B.Tools.Keyboard();
        this.instance = new rStats({
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

        this.visible = this.options.visible;
        this.dom     = document.querySelector( '.rs-base' );

        // Init
        this.init_infos();
        this.init_events();

        if( !this.visible )
        {
            this.dom.style.display               = 'none';
            this.infos.$.container.style.display = 'none';
        }

        // Register
        this.registry.set( 'stats', this );
    },

    /**
     * INIT INFOS
     */
    init_infos : function()
    {
        var that = this;

        // Set up
        this.infos             = {};
        this.infos.$           = {};
        this.infos.$.container = document.createElement( 'div' );
        this.infos.elements    = {};

        // CSS
        this.infos.$.container.style.position   = 'absolute';
        this.infos.$.container.style.top        = '46px';
        this.infos.$.container.style.background = 'rgba(0,0,0,0.65)';
        this.infos.$.container.style.padding    = '20px';
        this.infos.$.container.style.width      = '400px';
        this.infos.$.container.style.color      = '#fff';
        this.infos.$.container.style.fontSize   = '10px';
        this.infos.$.container.style.fontFamily = 'Helvetica,Arial';

        // Add to DOM
        document.body.appendChild( this.infos.$.container );
    },

    /**
     * UPDATE INFO
     */
    update_info : function( key, value )
    {
        // Don't update if hidden
        if( !this.visible )
            return false;

        // Params
        if( typeof key === 'undefined' )
            return false;
        if( typeof value === 'undefined' )
            value = '';

        // Numeric
        if( typeof value === 'number' )
        {
            value = Math.round( value * 1000 ) / 1000;
        }

        // Doesn't exist yet
        if( typeof this.infos.elements[ key ] === 'undefined' )
        {
            // Create element
            var element = document.createElement( 'div' );

            // Add text
            element.innerHTML = [ key, ' : ', value ].join( '' );

            // Save and add to DOM
            this.infos.elements[ key ] = element;
            this.infos.$.container.appendChild( element );
        }

        // Already exist
        else
        {
            // Update text
            this.infos.elements[ key ].innerHTML = [ key, ' : ', value ].join( '' );
        }
    },

    /**
     * INIT EVENTS
     */
    init_events : function()
    {
        var that = this;

        // Ticker tick event
        this.ticker.on( 'tick', function()
        {
            that.instance('raf').tick();
            that.instance('fps').frame();
            that.instance().update();
        });

        // Keyboard down event
        this.keyboard.on( 'down', function( key_code, character )
        {
            if( character === 'h' )
                that.toggle_visibility();
        } );
    },

    /**
     * TOGGLE VISIBILITY
     */
    toggle_visibility : function()
    {
        // Hide
        if( this.visible )
        {
            this.dom.style.display               = 'none';
            this.infos.$.container.style.display = 'none';
        }

        // Show
        else
        {
            this.dom.style.display               = 'block';
            this.infos.$.container.style.display = 'block';
        }

        // Toggle property
        this.visible = !this.visible;
    }
} );
