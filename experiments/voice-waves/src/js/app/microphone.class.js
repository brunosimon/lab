H.Microphone = B.Core.Event_Emitter.extend(
{
    options :
    {
        active : true,
        debug  :
        {
            active : false
        },
        recording :
        {
            frame_per_second : 25,
            duration         : 6000
        }
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.ticker    = new B.Tools.Ticker();
        this.registry  = new B.Tools.Registry();
        this.stats     = this.registry.get( 'stats' );
        this.started   = false;
        this.save      = [];
        this.mode      = 'free';
        this.time      = 0;

        this.recording            = {};
        this.recording.timeout    = null;
        this.recording.progress   = 0;
        this.recording.duration   = this.options.recording.duration;
        this.recording.time_start = null;

        this.values                  = {};
        this.values.volume           = {};
        this.values.volume.values    = [];
        this.values.volume.value     = 0;
        this.values.volume.smoothed  = 0;
        this.values.volume.maxed     = 0;
        this.values.volume.max       = 0;
        this.values.volume.ease      = 12;
        this.values.volume.softening = 0.99;
        this.values.volume.average   = 0;

        this.values.time_domain           = {};
        this.values.time_domain.value     = 0;
        this.values.time_domain.values    = [];
        this.values.time_domain.smoothed  = 0;
        this.values.time_domain.maxed     = 0;
        this.values.time_domain.max       = 0;
        this.values.time_domain.ease      = 40;
        this.values.time_domain.softening = 0.99;
        this.values.time_domain.average   = 0;

        this.values.frequency           = {};
        this.values.frequency.values    = [];
        this.values.frequency.value     = 0;
        this.values.frequency.smoothed  = 0;
        this.values.frequency.maxed     = 0;
        this.values.frequency.max       = 0;
        this.values.frequency.ease      = 40;
        this.values.frequency.softening = 0.99;
        this.values.frequency.average   = 0;

        this.values.frequencies = [];
        for( var i = 0; i < 4; i++ )
        {
            this.values.frequencies.push( {
                values    : [],
                value     : 0,
                smoothed  : 0,
                maxed     : 0,
                ease      : 40,
                softening : 0.99,
                average   : 0,
            } );
        }

        // Add to registry
        this.registry.set( 'microphone', this );

        // Init
        this.init_audio_stream();
        this.init_debug();
        this.init_events();
    },

    /**
     * SAVE FRAME
     */
    save_frame : function()
    {
        // Set up
        var frame = {};

        // Time
        frame.time = this.ticker.time.elapsed;

        // Volume
        frame.volume               = {};
        frame.volume.smoothed      = this.values.volume.smoothed;
        frame.volume.value         = this.values.volume.value;
        frame.time_domain          = {};
        frame.time_domain.smoothed = this.values.time_domain.smoothed;
        frame.frequency            = {};
        frame.frequency.average    = this.values.frequency.average;
        frame.frequencies          = [
            { smoothed : this.values.frequencies[ 0 ].smoothed },
            { smoothed : this.values.frequencies[ 1 ].smoothed },
            { smoothed : this.values.frequencies[ 2 ].smoothed },
            { smoothed : this.values.frequencies[ 3 ].smoothed },
        ];

        // Add to save array
        this.save.push( frame );
    },

    /**
     * RASTERIZE SAVE
     */
    rasterize_save : function()
    {
        // Set up
        var total_duration   = this.recording.duration,
            frame_per_second = this.options.recording.frame_per_second,
            frame_count      = this.options.recording.frame_per_second * total_duration / 1000,
            frame_duration   = 1000 / frame_per_second,
            time             = null,
            new_save         = [];

        // Each theorical frame
        for( var i = 0; i < frame_count; i++ )
        {
            var new_frame = {};

            new_frame.time        = i * frame_duration;
            new_frame.volume      = {};
            new_frame.time_domain = {};
            new_frame.frequency   = {};
            new_frame.frequencies = [ {}, {}, {}, {} ];

            // Each saved frame
            for( var j = 0; j < this.save.length; j++ )
            {
                var frame = this.save[ j ];

                if( frame.time > new_frame.time )
                {
                    var previous_frame = null,
                        ratio          = null;

                    // First frame
                    if( j === 0 )
                    {
                        previous_frame = this.save[ 0 ];
                        ratio          = 0;
                    }

                    // Other frames
                    else
                    {
                        previous_frame = this.save[ j - 1 ];
                        ratio          = ( new_frame.time -  previous_frame.time ) / ( frame.time - previous_frame.time );
                    }

                    // Set interpolated values
                    new_frame.volume.smoothed           = previous_frame.volume.smoothed           + ( frame.volume.smoothed           - previous_frame.volume.smoothed )           * ratio;
                    new_frame.volume.value              = previous_frame.volume.value              + ( frame.volume.value              - previous_frame.volume.value )              * ratio;
                    new_frame.time_domain.smoothed      = previous_frame.time_domain.smoothed      + ( frame.time_domain.smoothed      - previous_frame.time_domain.smoothed )      * ratio;
                    new_frame.frequency.average         = previous_frame.frequency.average         + ( frame.frequency.average         - previous_frame.frequency.average )         * ratio;
                    new_frame.frequencies[ 0 ].smoothed = previous_frame.frequencies[ 0 ].smoothed + ( frame.frequencies[ 0 ].smoothed - previous_frame.frequencies[ 0 ].smoothed ) * ratio;
                    new_frame.frequencies[ 1 ].smoothed = previous_frame.frequencies[ 1 ].smoothed + ( frame.frequencies[ 1 ].smoothed - previous_frame.frequencies[ 1 ].smoothed ) * ratio;
                    new_frame.frequencies[ 2 ].smoothed = previous_frame.frequencies[ 2 ].smoothed + ( frame.frequencies[ 2 ].smoothed - previous_frame.frequencies[ 2 ].smoothed ) * ratio;
                    new_frame.frequencies[ 3 ].smoothed = previous_frame.frequencies[ 3 ].smoothed + ( frame.frequencies[ 3 ].smoothed - previous_frame.frequencies[ 3 ].smoothed ) * ratio;

                    break;
                }
            }

            new_save.push( new_frame );
        }

        this.save = new_save;
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
            that.frame();
        } );
    },

    /**
     * INIT DEBUG
     */
    init_debug: function()
    {
        var that = this,
            ui   = this.registry.get( 'dat-gui' );

        this.bars_count = Math.round( 500 / 3 );

        // Canvas
        this.canvas = {};
        this.canvas.frequency   = document.createElement( 'canvas' );
        this.canvas.time_domain = document.createElement( 'canvas' );
        this.canvas.frequency.width  = 500;
        this.canvas.frequency.height = 150;
        this.canvas.time_domain.width  = 500;
        this.canvas.time_domain.height = 150;
        this.canvas.frequency.style.position = 'absolute';
        this.canvas.frequency.style.left     = 0;
        this.canvas.frequency.style.bottom   = 0;
        this.canvas.frequency.style.zIndex   = 10;
        this.canvas.time_domain.style.position = 'absolute';
        this.canvas.time_domain.style.left     = '500px';
        this.canvas.time_domain.style.bottom   = 0;
        this.canvas.time_domain.style.zIndex   = 10;

        if( !this.options.debug.active )
        {
            this.canvas.frequency.style.display   = 'none';
            this.canvas.time_domain.style.display = 'none';
        }

        document.body.appendChild( this.canvas.frequency );
        document.body.appendChild( this.canvas.time_domain );

        // Contexts
        this.contexts = {};
        this.contexts.frequency   = this.canvas.frequency.getContext( '2d' );
        this.contexts.time_domain = this.canvas.time_domain.getContext( '2d' );

        // Folder
        var folder = ui.addFolder( 'Microphone' );
        // folder.open();

        // Active
        var active = folder.add( this.options, 'active' );
        active.name( 'active' );
        active.onChange( function( value )
        {
            that.values.volume.value    = 0;
            that.values.volume.smoothed = 0;
        } );

        // Debug
        var debug = folder.add( this.options.debug, 'active' );
        debug.name( 'debug' );
        debug.onChange( function( value )
        {
            that.canvas.frequency.style.display   = that.options.debug.active ? 'block' : 'none';
            that.canvas.time_domain.style.display = that.options.debug.active ? 'block' : 'none';
        } );
    },

    /**
     * FRAME
     */
    frame : function()
    {
        // Recording
        if( this.mode === 'recording' )
        {
            this.recording.progress = ( ( + new Date() ) - this.recording.time_start ) / this.recording.duration;

            this.stats.update_info( 'volume', this.values.volume.smoothed );
            this.stats.update_info( 'volume average', this.values.volume.average );
            this.stats.update_info( 'volume max', this.values.volume.max );

            this.stats.update_info( 'frequency', this.values.frequency.smoothed );
            this.stats.update_info( 'frequency average', this.values.frequency.average );
            this.stats.update_info( 'frequency max', this.values.frequency.max );

            this.stats.update_info( 'time domain', this.values.time_domain.smoothed );
            this.stats.update_info( 'time domain average', this.values.time_domain.average );
            this.stats.update_info( 'time domain max', this.values.time_domain.max );

            this.time = this.ticker.time.elapsed;
        }
        else if( this.mode === 'free' )
        {
            if( this.recording.progress > 0 )
                this.recording.progress -= 0.005;
            else
                this.recording.progress = 0;

            this.time = this.ticker.time.elapsed;
        }

        if( this.started && this.mode !== 'playing' )
        {
            /**
             * SET UP
             */
            var i         = null,
                j         = null,
                len       = null,
                magnitude = null,
                freq_byte_data        = new Uint8Array( this.analyser.frequencyBinCount ),
                time_domain_byte_data = new Uint8Array( this.analyser.fftSize ),
                reduce_function       = function( a, b ) { return a + b; };

            this.analyser.getByteFrequencyData( freq_byte_data );
            this.analyser.getByteTimeDomainData( time_domain_byte_data );

            /**
             * CALCULATE
             */

            // Calculate frequency
            var frequency = 0;

            for( i = 0, len = freq_byte_data.length; i < len; i++ )
            {
                magnitude = freq_byte_data[ i ];
                frequency += magnitude;
            }

            frequency /= len;

            this.values.frequency.value     = frequency;
            this.values.frequency.smoothed += ( this.values.frequency.value - this.values.frequency.smoothed ) / this.values.frequency.ease;

            if( this.values.frequency.smoothed > this.values.frequency.maxed )
                this.values.frequency.maxed = this.values.frequency.smoothed;
            else
                this.values.frequency.maxed *= this.values.frequency.softening;

            this.values.frequency.values.push( this.values.frequency.value );
            this.values.frequency.average = this.values.frequency.values.reduce( function( a, b ) { return a + b; }, 0 ) / this.values.frequency.values.length;
            if( this.values.frequency.smoothed > this.values.frequency.max )
                this.values.frequency.max = this.values.frequency.smoothed;

            // Calculate frequencies
            var frequencies_indexes = [ 6, 18, 54, 162 ];
            for( j = 0; j < this.values.frequencies.length; j++ )
            {
                var _frequency = this.values.frequencies[ j ];
                magnitude = freq_byte_data[ frequencies_indexes[ j ] ];

                _frequency.value     = magnitude;
                _frequency.smoothed += ( _frequency.value - _frequency.smoothed ) / _frequency.ease;

                if( _frequency.smoothed > _frequency.maxed )
                    _frequency.maxed = _frequency.smoothed;
                else
                    _frequency.maxed *= _frequency.softening;

                _frequency.values.push( _frequency.value );
                _frequency.average = _frequency.values.reduce( reduce_function, 0 ) / _frequency.values.length;
            }

            // Calculate volume
            var volume = 0;

            for( i = 0, len = freq_byte_data.length; i < len; i++ )
            {
                magnitude = freq_byte_data[ i ];
                volume += magnitude;
            }

            volume /= len;

            this.values.volume.value     = volume;
            this.values.volume.smoothed += ( this.values.volume.value - this.values.volume.smoothed ) / this.values.volume.ease;

            if( this.values.volume.smoothed > this.values.volume.maxed )
                this.values.volume.maxed = this.values.volume.smoothed;
            else
                this.values.volume.maxed *= this.values.volume.softening;

            this.values.volume.values.push( this.values.volume.value );
            this.values.volume.average = this.values.volume.values.reduce( function( a, b ) { return a + b; }, 0 ) / this.values.volume.values.length;
            if( this.values.volume.smoothed > this.values.volume.max )
                this.values.volume.max = this.values.volume.smoothed;

            // Calculate timedomain
            var time_domain        = 0,
                previous_magnitude = null;

            for( i = 0, len = time_domain_byte_data.length; i < len; i++ )
            {
                magnitude = time_domain_byte_data[ i ];

                if( previous_magnitude !== null )
                    time_domain += Math.abs( previous_magnitude - magnitude );

                previous_magnitude = magnitude;
            }

            this.values.time_domain.value     = time_domain;
            this.values.time_domain.smoothed += ( this.values.time_domain.value - this.values.time_domain.smoothed ) / this.values.time_domain.ease;

            if( this.values.time_domain.smoothed > this.values.time_domain.maxed )
                this.values.time_domain.maxed = this.values.time_domain.smoothed;
            else
                this.values.time_domain.maxed *= this.values.time_domain.softening;

            this.values.time_domain.values.push( this.values.time_domain.value );
            this.values.time_domain.average = this.values.time_domain.values.reduce( function( a, b ) { return a + b; }, 0 ) / this.values.volume.values.length;
            if( this.values.time_domain.smoothed > this.values.time_domain.max )
                this.values.time_domain.max = this.values.time_domain.smoothed;

            /**
             * DRAW
             */

            // Reset frequency canvas
            this.contexts.frequency.clearRect( 0, 0, 500, 150 );
            this.contexts.frequency.fillStyle = '#BBBBBB';
            this.contexts.frequency.lineCap   = 'round';

            // Reset time domain canvas
            this.contexts.time_domain.clearRect( 0, 0, 500, 150 );
            this.contexts.time_domain.fillStyle = '#BBBBBB';
            this.contexts.time_domain.lineCap   = 'round';

            // Draw frequency lines
            for( i = 0, len = freq_byte_data.length; i < len; i++ )
            {
                if( frequencies_indexes.indexOf( i ) !== -1 )
                    this.contexts.frequency.fillStyle = '#BB0000';
                else
                    this.contexts.frequency.fillStyle = '#BBBBBB';

                magnitude = freq_byte_data[ i ];
                this.contexts.frequency.fillRect( i * 2, 150, 1, - magnitude * 0.5 );
            }

            // Draw time domain lines
            for( i = 0, len = time_domain_byte_data.length; i < len; i++ )
            {
                magnitude = time_domain_byte_data[ i ];
                this.contexts.time_domain.fillRect( i * 2, 150, 1, - magnitude );
            }

            // Draw average frequency points
            this.contexts.frequency.fillStyle = '#ffffff';
            this.contexts.frequency.beginPath();
            this.contexts.frequency.arc( this.values.frequencies[ 0 ].value * 10, 25, 10, 0, Math.PI * 2 );
            this.contexts.frequency.fill();

            this.contexts.frequency.beginPath();
            this.contexts.frequency.arc( this.values.frequencies[ 0 ].smoothed * 10, 50, 10, 0, Math.PI * 2 );
            this.contexts.frequency.fill();

            this.contexts.frequency.beginPath();
            this.contexts.frequency.arc( this.values.frequencies[ 0 ].maxed * 10, 75, 10, 0, Math.PI * 2 );
            this.contexts.frequency.fill();

            this.contexts.frequency.beginPath();
            this.contexts.frequency.arc( this.values.frequencies[ 0 ].average * 10, 100, 10, 0, Math.PI * 2 );
            this.contexts.frequency.fill();

            // Draw volume points
            this.contexts.frequency.beginPath();
            this.contexts.frequency.arc( 325, 150 - this.values.volume.value, 10, 0, Math.PI * 2 );
            this.contexts.frequency.fill();

            this.contexts.frequency.beginPath();
            this.contexts.frequency.arc( 350, 150 - this.values.volume.smoothed, 10, 0, Math.PI * 2 );
            this.contexts.frequency.fill();

            this.contexts.frequency.beginPath();
            this.contexts.frequency.arc( 375, 150 - this.values.volume.maxed, 10, 0, Math.PI * 2 );
            this.contexts.frequency.fill();

            this.contexts.frequency.beginPath();
            this.contexts.frequency.arc( 400, 150 - this.values.volume.average, 10, 0, Math.PI * 2 );
            this.contexts.frequency.fill();

            // Draw time domain points
            this.contexts.time_domain.fillStyle = '#ffffff';
            this.contexts.time_domain.beginPath();
            this.contexts.time_domain.arc( 325, 150 - this.values.time_domain.value * 0.6, 10, 0, Math.PI * 2 );
            this.contexts.time_domain.fill();

            this.contexts.time_domain.beginPath();
            this.contexts.time_domain.arc( 350, 150 - this.values.time_domain.smoothed * 0.6, 10, 0, Math.PI * 2 );
            this.contexts.time_domain.fill();

            this.contexts.time_domain.beginPath();
            this.contexts.time_domain.arc( 375, 150 - this.values.time_domain.maxed * 0.6, 10, 0, Math.PI * 2 );
            this.contexts.time_domain.fill();

            this.contexts.time_domain.beginPath();
            this.contexts.time_domain.arc( 400, 150 - this.values.time_domain.average * 0.6, 10, 0, Math.PI * 2 );
            this.contexts.time_domain.fill();
        }

        if( this.mode === 'recording' )
            this.save_frame();
    },

    /**
     * INIT AUDIO STREAM
     */
    init_audio_stream: function(params)
    {
        var that = this;

        // Prefixes compatibility
        navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );

        // Ask for audio permission
        navigator.getUserMedia(
            {
                'audio' :
                {
                    'mandatory':
                    {
                        'googEchoCancellation' : 'true',
                        'googAutoGainControl'  : 'true',
                        'googNoiseSuppression' : 'true',
                        'googHighpassFilter'   : 'true'
                    },
                    'optional': []
                }
            },
            function( stream )
            {
                that.success( stream );
            },
            function( e )
            {
                that.error( e );
            }
        );
    },

    /**
     * SUCCESS
     */
    success : function( stream )
    {
        // Prefixes compatibility
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        // Audio
        this.audio_context = new window.AudioContext();

        // Gain input
        this.gain = this.audio_context.createGain();

        // Stream source
        this.audio_input   = this.audio_context.createMediaStreamSource( stream );
        this.audio_input.connect( this.gain );

        // Analyser
        this.analyser = this.audio_context.createAnalyser();
        this.analyser.fftSize = 512;
        this.gain.connect( this.analyser );

        // Zero gain
        this.zero_gain = this.audio_context.createGain();
        this.zero_gain.gain.value = 0.0;
        this.gain.connect( this.zero_gain );
        this.zero_gain.connect( this.audio_context.destination );

        // Started
        this.started = true;
    },

    /**
     * ERROR
     */
    error : function( e )
    {
        console.log( 'error' );
        console.log( e );
    },

    /**
     * TOGGLE RECORDING
     */
    toggle_recording : function()
    {
        if( this.mode === 'recording' )
            this.stop_recording();
        else
            this.start_recording();
    },

    /**
     * START RECORDING
     */
    start_recording : function()
    {
        var that = this;

        // Set up
        this.mode = 'recording';
        this.recording.time_start = + new Date();
        this.reset();

        // Timeout before record end
        this.recording.timeout = window.setTimeout( function()
        {
            that.stop_recording();
        }, 6000 );

        // Trigger event
        this.trigger( 'start_recording' );
    },

    /**
     * START RECORDING
     */
    stop_recording : function()
    {
        // Set up
        this.mode = 'free';

        // Stop timeout if one running
        if( this.recording.timeout )
            window.clearTimeout( this.recording.timeout );

        // Rasterize save
        this.rasterize_save();

        // Trigger event
        this.trigger( 'stop_recording', [ this.save ] );
    },

    /**
     * RESET
     */
    reset : function()
    {
        // Ticker
        this.ticker.reset();

        // Save
        this.save = [];

        // Volume
        this.values.volume.average   = 0;
        this.values.volume.max       = 0;
        this.values.volume.values    = [];

        // Frequency
        this.values.frequency.average = [];
        this.values.frequency.max     = [];
        this.values.frequency.values  = [];

        // Frequencies
        for( var j = 0; j < this.values.frequencies.length; j++ )
        {
            var frequency = this.values.frequencies[ j ];
            frequency.average = 0;
            frequency.values  = [];
        }

        // Time domain
        this.values.time_domain.average = 0;
        this.values.time_domain.max     = 0;
        this.values.time_domain.values  = [];
    },

    /**
     * SET VALUES
     */
    set_values : function( values )
    {
        if( !values || values.length === 0 )
            return false;

        this.save = values;
    },

    /**
     * GO TO
     */
    go_to : function( frame_index, callback )
    {
        // Limits
        var max = this.options.recording.frame_per_second * this.options.recording.duration / 1000;
        if( frame_index < 0 )
            frame_index = 0;
        else if( frame_index > max )
            frame_index = max;

        // No save
        if( this.save.length === 0 )
        {
            console.warn( 'no save yet' );
            return false;
        }

        // Change mode
        this.mode = 'playing';

        // Get frame
        var frame = this.save[ frame_index ];

        this.time = frame.time;
        this.values.volume.smoothed           = frame.volume.smoothed;
        this.values.volume.value              = frame.volume.value;
        this.values.time_domain.smoothed      = frame.time_domain.smoothed;
        this.values.frequency.average         = frame.frequency.average;
        this.values.frequencies[ 0 ].smoothed = frame.frequencies[ 0 ].smoothed;
        this.values.frequencies[ 1 ].smoothed = frame.frequencies[ 1 ].smoothed;
        this.values.frequencies[ 2 ].smoothed = frame.frequencies[ 2 ].smoothed;
        this.values.frequencies[ 3 ].smoothed = frame.frequencies[ 3 ].smoothed;

        // Change progress
        this.recording.progress = frame_index / ( this.options.recording.frame_per_second * this.recording.duration / 1000 );

        this.ticker.do_next( function()
        {
            callback.apply( this, [ frame_index ] );
        } );
    }
} );
