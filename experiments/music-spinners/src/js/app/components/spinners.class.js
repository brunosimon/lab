B.Components.Spinners = B.Core.Abstract.extend(
{
    options :
    {
        canvas : false
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.viewport           = new B.Tools.Viewport();
        this.registry           = new B.Tools.Registry();
        this.canvas             = this.registry.set( 'canvas', {} );
        this.canvas.element     = this.options.canvas;
        this.canvas.context     = this.canvas.element.getContext( '2d' );
        this.canvas.sizes       = {};
        this.canvas.pixel_ratio = window.devicePixelRatio || 1;
        this.background         = new B.Components.Background();
        this.items              = [];

        // Add spinners
        this.items.push( new B.Components.Spinner( { color : 'red' } ) );
        this.items.push( new B.Components.Spinner( { color : 'blue' } ) );
        this.items.push( new B.Components.Spinner( { color : 'green' } ) );

        // Init
        this.init_ticker();
        this.init_resize();
        this.init_tweaks();
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
        this.ticker.on( 'tick', function( infos )
        {
            that.update( infos );
            that.draw();
        } );
    },

    /**
     * INIT RESIZE
     */
    init_resize : function()
    {
        var that = this;

        // Viewport resize event
        this.viewport.on( 'resize', function( width, height )
        {
            that.canvas.pixel_ratio       = window.devicePixelRatio || 1;
            that.canvas.element.width     = width * that.canvas.pixel_ratio;
            that.canvas.element.height    = height * that.canvas.pixel_ratio;
            that.canvas.sizes.width       = that.canvas.element.width;
            that.canvas.sizes.height      = that.canvas.element.height;
            that.canvas.sizes.half        = {};
            that.canvas.sizes.half.width  = that.canvas.element.width / 2;
            that.canvas.sizes.half.height = that.canvas.element.height / 2;

            that.canvas.element.style.width  = '100%';
            that.canvas.element.style.height = '100%';

            that.background.update();
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

        // Dummy
        var dummy = {};

        dummy.light     = {};
        dummy.tail      = {};
        dummy.particles = {};

        var item = that.items[ 0 ];

        dummy.light.animation_radius = item.light.animation.radius;
        dummy.light.animation_speed  = item.light.animation.speed;
        dummy.light.disc_1_radius    = item.light.disc_1.radius;
        dummy.light.disc_2_radius    = item.light.disc_2.radius;
        dummy.light.disc_3_radius    = item.light.disc_3.radius;
        dummy.light.disc_1_opacity   = item.light.disc_1.opacity;
        dummy.light.disc_2_opacity   = item.light.disc_2.opacity;
        dummy.light.disc_3_opacity   = item.light.disc_3.opacity;

        dummy.tail.line_width                   = item.tail.line_width;
        dummy.tail.points_life_time             = item.tail.points.life_time;
        dummy.tail.points_turbulence_multiplier = item.tail.points.turbulence.multiplier;

        dummy.particles.new_per_seconds = item.particles.new_per_seconds;
        dummy.particles.life_time       = item.particles.life_time;
        dummy.particles.radius          = item.particles.radius;
        dummy.particles.velocity        = item.particles.velocity;
        dummy.particles.turbulence      = item.particles.turbulence;

        // Callbacks
        var callbacks = {};

        callbacks.light = function()
        {
            // Each item
            for( var i = 0; i < that.items.length; i++ )
            {
                // Update item
                var item = that.items[ i ];
                item.light.animation.radius = dummy.light.animation_radius;
                item.light.animation.speed  = dummy.light.animation_speed;
                item.light.disc_1.radius    = dummy.light.disc_1_radius;
                item.light.disc_2.radius    = dummy.light.disc_2_radius;
                item.light.disc_3.radius    = dummy.light.disc_3_radius;
                item.light.disc_1.opacity   = dummy.light.disc_1_opacity;
                item.light.disc_2.opacity   = dummy.light.disc_2_opacity;
                item.light.disc_3.opacity   = dummy.light.disc_3_opacity;
            }
        };

        callbacks.tail = function()
        {
            // Each item
            for( var i = 0; i < that.items.length; i++ )
            {
                // Update item
                var item = that.items[ i ];
                item.tail.line_width                   = dummy.tail.line_width;
                item.tail.points.life_time             = dummy.tail.points_life_time;
                item.tail.points.turbulence.multiplier = dummy.tail.points_turbulence_multiplier;
            }
        };

        callbacks.particles = function()
        {
            // Each item
            for( var i = 0; i < that.items.length; i++ )
            {
                // Update item
                var item = that.items[ i ];
                item.particles.new_per_seconds = dummy.particles.new_per_seconds;
                item.particles.life_time       = dummy.particles.life_time;
                item.particles.radius          = dummy.particles.radius;
                item.particles.velocity        = dummy.particles.velocity;
                item.particles.turbulence      = dummy.particles.turbulence;
            }
        };

        // Create folders
        var folders = {};

        folders.light     = this.tweaker.gui.addFolder( 'Light' );
        folders.tail      = this.tweaker.gui.addFolder( 'Tail' );
        folders.particles = this.tweaker.gui.addFolder( 'Particles' );

        folders.light.open();
        folders.tail.open();
        folders.particles.open();

        // Add tweaks
        folders.light.add( dummy.light, 'animation_radius' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'radius' ).onChange( callbacks.light );
        folders.light.add( dummy.light, 'animation_speed' ).min( 0 ).max( 2 ).step( 0.01 ).name( 'speed' ).onChange( callbacks.light );
        folders.light.add( dummy.light, 'disc_1_radius' ).min( 0 ).max( 100 ).step( 1 ).name( 'disc 1 radius' ).onChange( callbacks.light );
        folders.light.add( dummy.light, 'disc_2_radius' ).min( 0 ).max( 100 ).step( 1 ).name( 'disc 2 radius' ).onChange( callbacks.light );
        folders.light.add( dummy.light, 'disc_3_radius' ).min( 0 ).max( 100 ).step( 1 ).name( 'disc 3 radius' ).onChange( callbacks.light );
        folders.light.add( dummy.light, 'disc_1_opacity' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'disc 1 opacity' ).onChange( callbacks.light );
        folders.light.add( dummy.light, 'disc_2_opacity' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'disc 2 opacity' ).onChange( callbacks.light );
        folders.light.add( dummy.light, 'disc_3_opacity' ).min( 0 ).max( 1 ).step( 0.01 ).name( 'disc 3 opacity' ).onChange( callbacks.light );

        folders.tail.add( dummy.tail, 'line_width' ).min( 0 ).max( 50 ).step( 1 ).name( 'line width' ).onChange( callbacks.tail );
        folders.tail.add( dummy.tail, 'points_life_time' ).min( 0 ).max( 20000 ).step( 1 ).name( 'life time' ).onChange( callbacks.tail );
        folders.tail.add( dummy.tail, 'points_turbulence_multiplier' ).min( 0 ).max( 3 ).step( 0.01 ).name( 'turbulence mult.' ).onChange( callbacks.tail );

        folders.particles.add( dummy.particles, 'new_per_seconds' ).min( 0 ).max( 1000 ).step( 1 ).name( 'per second' ).onChange( callbacks.particles );
        folders.particles.add( dummy.particles, 'life_time' ).min( 0 ).max( 20000 ).step( 1 ).name( 'life time' ).onChange( callbacks.particles );
        folders.particles.add( dummy.particles, 'radius' ).min( 0 ).max( 20 ).step( 1 ).name( 'radius' ).onChange( callbacks.particles );
        folders.particles.add( dummy.particles, 'velocity' ).min( 0 ).max( 20 ).step( 0.01 ).name( 'velocity' ).onChange( callbacks.particles );
        folders.particles.add( dummy.particles, 'turbulence' ).min( 0 ).max( 200 ).step( 1 ).name( 'turbulence' ).onChange( callbacks.particles );
    },

    /**
     * UPDATE
     */
    update : function()
    {
        // Each item
        for( var i = 0; i < this.items.length; i++ )
        {
            // Update item
            this.items[ i ].update();
        }
    },

    /**
     * DRAW
     */
    draw : function()
    {
        this.background.draw();

        // Each item
        for( var i = 0; i < this.items.length; i++ )
        {
            // Update item
            this.items[ i ].draw();
        }
    }
} );
