B.Components.Tail = B.Core.Abstract.extend(
{
    options :
    {
        color : 'red'
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.color                        = this.options.color;
        this.registry                     = new B.Tools.Registry();
        this.canvas                       = this.registry.get( 'canvas' );
        this.line_width                   = 1.5 * this.canvas.pixel_ratio;
        this.points                       = {};
        this.points.life_time             = 8000;
        this.points.all                   = [];
        this.points.turbulence            = {};
        this.points.turbulence.multiplier = 0.7;
    },

    /**
     * UPDATE
     */
    update : function( x, y, elapsed_time, delta_time )
    {
        // Each point
        for( var i = 0, len = this.points.all.length; i < len; i++ )
        {
            // Set up
            var point = this.points.all[ i ];
            point.life      -= delta_time;
            point.life_ratio = point.life / point.life_time;
            point.x          = point.origin.x + point.turbulence.x * ( 1 - point.life_ratio );
            point.y          = point.origin.y + point.turbulence.y * ( 1 - point.life_ratio );
            // point.x          = point.turbulence.x;
            // point.y          = point.turbulence.y;

            // Point is dead
            if( point.life < 0 )
            {
                // Delete
                this.points.all.splice( i, 1 );
                i--;
                len--;
            }
        }

        var new_point = {};
        new_point.x                 = x;
        new_point.y                 = y;
        new_point.origin            = {};
        new_point.origin.x          = x;
        new_point.origin.y          = y;
        new_point.life              = this.points.life_time;
        new_point.life_time         = this.points.life_time;
        new_point.life_ratio        = 1;
        new_point.turbulence        = {};
        new_point.turbulence.offset = elapsed_time;
        new_point.turbulence.x      = ( new_point.origin.x - this.canvas.sizes.half.width  ) * ( Math.sin( elapsed_time / 300 ) * 0.3 + Math.sin( elapsed_time / 160 ) * 0.1 + Math.sin( elapsed_time / 85 ) * 0.1 + Math.sin( elapsed_time / 22 ) * 0.01 ) * this.points.turbulence.multiplier;
        new_point.turbulence.y      = ( new_point.origin.y - this.canvas.sizes.half.height ) * ( Math.sin( elapsed_time / 300 ) * 0.3 + Math.sin( elapsed_time / 160 ) * 0.1 + Math.sin( elapsed_time / 85 ) * 0.1 + Math.sin( elapsed_time / 22 ) * 0.01 ) * this.points.turbulence.multiplier;


        this.points.all.push( new_point );
    },

    /**
     * DRAW
     */
    draw : function()
    {
        // Set up
        this.canvas.context.globalCompositeOperation = 'lighter';
        this.canvas.context.lineWidth                = this.line_width;
        // this.canvas.context.shadowColor              = 'red';
        // this.canvas.context.shadowBlur               = 10;

        // Each point
        for( var i = 1, len = this.points.all.length; i < len; i++ )
        {
            // Set up
            var previous_point = this.points.all[ i - 1 ],
                point          = this.points.all[ i ];

            this.canvas.context.strokeStyle = this.get_color( point.life_ratio );

            this.canvas.context.beginPath();
            this.canvas.context.moveTo( previous_point.x, previous_point.y );
            this.canvas.context.lineTo( point.x, point.y );
            this.canvas.context.stroke();
        }
        this.canvas.context.shadowColor = 'rgba(0,0,0,0)';
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
