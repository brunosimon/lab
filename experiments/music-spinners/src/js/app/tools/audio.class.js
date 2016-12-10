B.Tools.Audio = B.Core.Event_Emitter.extend(
{
    static  : 'audio',
    options : {},

    construct : function( options )
    {
        var that = this;

        this._super( options );

        // Set up
        this.debug          = false;
        this.volume         = 0;
        this.context        = new AudioContext();
        this.analyser       = this.context.createAnalyser();
        this.element        = document.querySelector( 'audio' );
        this.source_node    = this.context.createMediaElementSource( this.element );
        this.gain_node      = this.context.createGain();
        this.frequency_data = new Uint8Array( this.analyser.frequencyBinCount  );

        // Connect nodes
        this.source_node.connect( this.gain_node );
        this.gain_node.connect( this.analyser );
        this.analyser.connect( this.context.destination );

        this.element.loop     = true;
        this.analyser.fftSize = 512;

        // Load
        this.element.addEventListener( 'canplaythrough', function()
        {
            // Init
            that.init_tweaks();
            that.init_ticker();

            // Play
            that.element.play();

            // Trigger
            that.trigger( 'load' );
        } );
        this.element.load();
    },

    /**
     * INIT TICKER
     */
    init_ticker : function()
    {
        var that = this;

        // Set up
        this.ticker = new B.Tools.Ticker();

        // Ticker tick event
        this.ticker.on( 'tick', function()
        {
            // Set up
            var volume = 0;

            that.analyser.getByteFrequencyData( that.frequency_data );

            for( var i = 0, len = that.frequency_data.length; i < len; i++ )
                volume += that.frequency_data[ i ];

            volume /= len;
            that.volume = volume;

            // Draw debug
            if( that.debug )
                that.draw_debug();

            // Tweaks
            that.tweaker.gui.__folders.Audio.__controllers[ 3 ].updateDisplay();
        } );
    },

    /**
     * INIT TWEAKS
     */
    init_tweaks : function()
    {
        var that = this;

        // Set up
        this.tweaker = new B.Tools.Tweaker();

        // Canvas
        this.canvas                = document.createElement( 'canvas' );
        this.canvas.width          = 500;
        this.canvas.height         = 150;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left     = '173px';
        this.canvas.style.bottom   = 0;
        this.canvas.style.zIndex   = 10;
        this.canvas.style.display  = this.debug ? 'block' : 'none';

        this.context = this.canvas.getContext( '2d' );

        document.body.appendChild( this.canvas );

        // Create folder
        var folder = this.tweaker.gui.addFolder( 'Audio' );
        folder.open();

        // Functions
        var callbacks = {
            play : function()
            {
                that.element.play();
            },
            pause : function()
            {
                that.element.pause();
            },
            debug : function( value )
            {
                that.canvas.style.display = value ? 'block' : 'none';
            }
        };

        // Add tweaks
        folder.add( this.gain_node.gain, 'value' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'volume' );
        folder.add( this.element, 'currentTime' ).min( 0 ).max( this.element.duration ).step( 1 ).name( 'progress' );
        folder.add( this, 'debug' ).name( 'debug' ).onChange( callbacks.debug );
        folder.add( callbacks, 'play' ).name( 'play' );
        folder.add( callbacks, 'pause' ).name( 'pause' );
    },

    /**
     * DRAW DEBUG
     */
    draw_debug : function()
    {
        // Reset frequency canvas
        this.context.clearRect( 0, 0, 500, 150 );
        this.context.lineCap = 'round';

        // Draw frequency lines
        for( i = 0, len = this.frequency_data.length; i < len; i++ )
        {
            var magnitude = this.frequency_data[ i ];

            this.context.fillStyle = i % 10 === 0 ? '#fff' : '#00f6ff';

            this.context.fillRect( i * 2, 150, 1, - magnitude * 0.5 );
        }
    }
} );
