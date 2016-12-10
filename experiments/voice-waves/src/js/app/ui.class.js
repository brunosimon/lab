H.UI = B.Core.Event_Emitter.extend(
{
    options : {},

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.ticker     = new B.Tools.Ticker();
        this.registry   = new B.Tools.Registry();
        this.microphone = this.registry.get( 'microphone' );

        this.$.container = document.querySelector( '.ui' );

        // Init
        this.init_controls();
    },

    /**
     * INIT CONTROLS
     */
    init_controls : function()
    {
        var that = this;

        // Set up
        this.controls             = {};
        this.controls.$           = {};
        this.controls.$.container = this.$.container.querySelector( '.controls' );

        this.microphone.on( 'start_recording stop_recording', function()
        {
            if( that.microphone.mode === 'recording' )
                that.controls.$.container.classList.add( 'recording' );
            else
                that.controls.$.container.classList.remove( 'recording' );
        } );

        // Click event
        this.controls.$.container.onclick = function( e )
        {
            that.microphone.toggle_recording();

            e.preventDefault();
        };
    }
} );
