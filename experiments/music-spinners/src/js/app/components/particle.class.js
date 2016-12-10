B.Components.Particle = B.Core.Abstract.extend(
{
    options :
    {
        color : 'red'
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.color            = this.options.color;
        this.registry         = new B.Tools.Registry();
        this.canvas           = this.registry.get( 'canvas' );
        this.x                = this.options.x;
        this.y                = this.options.y;
        this.life_time        = this.options.life_time || Math.random() * 8000;
        this.life             = this.life_time;
        this.radius           = this.options.radius || Math.random() * 1 * this.canvas.pixel_ratio;
        this.velocity         = {};
        this.velocity.initial = this.options.velocity || Math.random() * 0.5;

        var random_angle = Math.random() * Math.PI * 2;
        this.velocity.x       = Math.cos( random_angle ) * this.velocity.initial;
        this.velocity.y       = Math.sin( random_angle ) * this.velocity.initial;

        this.turbulence               = {};
        this.turbulence.time_offset_x = Math.round( Math.random() * 8000 );
        this.turbulence.time_offset_y = Math.round( Math.random() * 8000 );
        this.turbulence.x             = 0;
        this.turbulence.y             = 0;
        this.turbulence.force         = {};
        this.turbulence.force.current = 0;
        this.turbulence.force.max     = this.options.turbulence || 20;
    },

    /**
     * UPDATE
     */
    update : function( elapsed_time, delta_time )
    {
        this.life       -= delta_time;
        this.life_ratio  = this.life / this.life_time;
        this.x          += this.velocity.x;
        this.y          += this.velocity.y;

        this.turbulence.force.current = ( 1 - this.life_ratio ) * this.turbulence.force.max;

        this.turbulence.x = Math.sin( ( elapsed_time + this.turbulence.time_offset_x ) / 200 ) * this.turbulence.force.current - this.turbulence.force.current * 0.5;
        this.turbulence.y = Math.cos( ( elapsed_time + this.turbulence.time_offset_y ) / 160 ) * this.turbulence.force.current - this.turbulence.force.current * 0.5;
    },

    /**
     * DRAW
     */
    draw : function()
    {
        var that = this,
            x    = this.x + this.turbulence.x,
            y    = this.y + this.turbulence.y;

        // Draw Inner disc
        this.canvas.context.globalCompositeOperation = 'lighter';
        this.canvas.context.fillStyle = this.get_color( this.life_ratio );
        this.canvas.context.beginPath();
        this.canvas.context.arc( x, y, this.radius, 0, Math.PI * 2 );
        this.canvas.context.fill();
    },

    /**
     * GET COLOR
     */
    get_color : function( ratio )
    {
        var r, g, b, a, color;

        switch( this.color )
        {
            case 'blue' :
                r = 0;
                g = Math.round( 200 * ratio );
                b = 255;

                break;

            case 'green' :
                r = Math.round( 255 * ratio * 0.5 );
                g = 200;
                b = 120;

                break;

            case 'red' :
                r = 200;
                g = Math.round( 255 * ratio * 0.5 );
                b = 185 + Math.round( 70 * ratio );

                break;
        }

        a = ratio;

        color = [
            'rgba(',
            r,
            ',',
            g,
            ',',
            b,
            ',',
            a,
            ')'
        ].join( '' );

        return color;
    }
} );
