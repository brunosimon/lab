B.Components.Particles = B.Core.Abstract.extend(
{
    options :
    {
        color : 'red'
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.color           = this.options.color;
        this.registry        = new B.Tools.Registry();
        this.audio           = new B.Tools.Audio();
        this.canvas          = this.registry.get( 'canvas' );
        this.new_per_seconds = 50;
        this.all             = [];

        // Particle set up
        this.life_time  = 8000;
        this.radius     = 1;
        this.velocity   = 0.5;
        this.turbulence = 20;
    },

    /**
     * UPDATE
     */
    update : function( x, y, elapsed_time, delta_time )
    {
        // Each particle
        for( var i = 0, len = this.all.length; i < len; i++ )
        {
            // Set up
            var particle = this.all[ i ];
            particle.update( elapsed_time, delta_time );

            // Point is dead
            if( particle.life < 0 )
            {
                // Delete
                this.all.splice( i, 1 );
                i--;
                len--;
            }
        }

        // Create particles
        var count = Math.ceil( delta_time / 1000 * this.new_per_seconds );
        for( var j = 0; j < count; j++ )
        {
            var new_particle = new B.Components.Particle( {
                x          : x,
                y          : y,
                life_time  : Math.random() * this.life_time,
                radius     : Math.random() * this.radius * this.canvas.pixel_ratio,
                velocity   : this.registry.items.mode === 'music' ? Math.random() * Math.pow( this.audio.volume * this.velocity, 2 ) * 0.1 : Math.random() * this.velocity,
                turbulence : this.registry.items.mode === 'music' ? this.audio.volume * this.turbulence / 4 : this.turbulence,
                color      : this.color
            } );
            this.all.push( new_particle );
        }
    },

    /**
     * DRAW
     */
    draw : function()
    {
        // Each point
        for( var i = 1, len = this.all.length; i < len; i++ )
        {
            // Set up
            var particle = this.all[ i ];
            particle.draw();
        }
    }
} );
