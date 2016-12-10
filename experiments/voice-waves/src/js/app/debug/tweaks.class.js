H.Debug.Tweaks = B.Core.Abstract.extend(
{
    options :
    {
        visible : true
    },

    construct : function( options )
    {
        this._super( options );

        var that = this;

        // Set up
        this.keyboard = new B.Tools.Keyboard();
        this.registry = new B.Tools.Registry();
        this.instance = new dat.GUI();
        this.visible  = this.options.visible;

        // Update width
        window.setTimeout( function()
        {
            that.instance.domElement.style.width = '320px';
        }, 100 );

        if( !this.options.visible )
        {
            dat.GUI.toggleHide();
            this.instance.domElement.style.display = 'none';
        }

        this.init_events();

        this.registry.set( 'dat-gui', this.instance );
    },

    /**
     * INIT EVENTS
     */
    init_events : function()
    {
        var that = this;

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
            this.instance.domElement.style.display = 'none';

        // Show
        else
            this.instance.domElement.style.display = 'block';

        // Toggle property
        this.visible = !this.visible;
    }
} );
