B.Components.Light = B.Core.Abstract.extend(
{
    options :
    {
        position_mode : 'circular',
        color         : 'red'
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.color            = this.options.color;
        this.mouse            = new B.Tools.Mouse();
        this.registry         = new B.Tools.Registry();
        this.audio            = new B.Tools.Audio();
        this.canvas           = this.registry.get( 'canvas' );
        this.animation        = {};
        this.animation.radius = 0.10;
        this.animation.speed  = 0.1; // t / s
        this.disc_1           = {};
        this.disc_1.radius    = 2 * this.canvas.pixel_ratio;
        this.disc_1.opacity   = 1;
        this.disc_2           = {};
        this.disc_2.radius    = 2 * this.canvas.pixel_ratio;
        this.disc_2.opacity   = 0.5;
        this.disc_3           = {};
        this.disc_3.radius    = 30 * this.canvas.pixel_ratio;
        this.disc_3.opacity   = 0.6;
        this.x                = 100;
        this.y                = 100;
        this.position_mode    = this.options.position_mode;
        this.frequency_value  = 0;
    },

    /**
     * UPDATE
     */
    update : function( time )
    {
        var rotation_offset;
        switch( this.color )
        {
            case 'blue' :
                rotation_offset = ( Math.PI * 2 ) / 3 * 0;
                break;

            case 'green' :
                rotation_offset = ( Math.PI * 2 ) / 3 * 1;
                break;

            case 'red' :
                rotation_offset = ( Math.PI * 2 ) / 3 * 2;
                break;
        }

        if( this.registry.items.mode === 'music' )
        {
            var frequency_value = 0;
            switch( this.color )
            {
                case 'blue' :
                    frequency_value = this.audio.frequency_data[ 40 ] + 30;
                    break;

                case 'green' :
                    frequency_value = this.audio.frequency_data[ 0 ] + 35;
                    break;

                case 'red' :
                    frequency_value = this.audio.frequency_data[ 15 ] + 40;
                    break;
            }
            this.frequency_value += ( frequency_value - this.frequency_value ) * 0.3;

            this.x = this.canvas.sizes.half.width  + Math.cos( ( time / 1000 ) * this.animation.speed * Math.PI * 2 ) * this.canvas.sizes.width * ( this.frequency_value * 0.0007 );
            this.y = this.canvas.sizes.half.height + Math.sin( ( time / 1000 ) * this.animation.speed * Math.PI * 2 ) * this.canvas.sizes.width * ( this.frequency_value * 0.0007 );
        }
        else if( this.registry.items.mode === 'circular' )
        {
            this.x = this.canvas.sizes.half.width  + Math.cos( ( time / 1000 ) * this.animation.speed * Math.PI * 2 + rotation_offset ) * this.canvas.sizes.width * this.animation.radius;
            this.y = this.canvas.sizes.half.height + Math.sin( ( time / 1000 ) * this.animation.speed * Math.PI * 2 + rotation_offset ) * this.canvas.sizes.width * this.animation.radius;
        }
        else if( this.registry.items.mode === 'mouse' )
        {
            var offset = { x : 0, y : 0 };
            offset.x = Math.cos( ( time / 1000 ) * this.animation.speed * Math.PI * 2 + rotation_offset ) * 30;
            offset.y = Math.sin( ( time / 1000 ) * this.animation.speed * Math.PI * 2 + rotation_offset ) * 30;

            this.x = ( this.mouse.position.x + offset.x ) * this.canvas.pixel_ratio;
            this.y = ( this.mouse.position.y + offset.y ) * this.canvas.pixel_ratio;
        }
    },

    /**
     * DRAW
     */
    draw : function()
    {
        // Draw disc 3
        var gradient_3 = this.canvas.context.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.disc_3.radius );

        switch( this.color )
        {
            case 'blue' :
                gradient_3.addColorStop( 0, 'rgba(0,200,255,' + ( this.disc_3.opacity - ( Math.random() * 0.05 ) ) + ')' );
                gradient_3.addColorStop( 1, 'rgba(0,0,255,0)' );

                break;

            case 'green' :
                gradient_3.addColorStop( 0, 'rgba(100,255,0,' + ( this.disc_3.opacity - ( Math.random() * 0.05 ) ) + ')' );
                gradient_3.addColorStop( 1, 'rgba(0,255,0,0)' );

                break;

            case 'red' :
                gradient_3.addColorStop( 0, 'rgba(255,0,59,' + ( this.disc_3.opacity - ( Math.random() * 0.05 ) ) + ')' );
                gradient_3.addColorStop( 1, 'rgba(255,0,120,0)' );

                break;
        }

        this.canvas.context.globalCompositeOperation = 'lighter';
        this.canvas.context.fillStyle = gradient_3;
        this.canvas.context.beginPath();
        this.canvas.context.arc( this.x, this.y, this.disc_3.radius, 0, Math.PI * 2 );
        this.canvas.context.fill();

        // Draw dics 2
        var gradient_2 = this.canvas.context.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.disc_2.radius );
        gradient_2.addColorStop( 0, 'rgba(255,255,255,' + ( this.disc_2.opacity - ( Math.random() * 0.05 ) ) + ')' );
        gradient_2.addColorStop( 1, 'rgba(255,255,255,0)' );

        this.canvas.context.globalCompositeOperation = 'lighter';
        this.canvas.context.fillStyle = gradient_2;
        this.canvas.context.beginPath();
        this.canvas.context.arc( this.x, this.y, this.disc_2.radius, 0, Math.PI * 2 );
        this.canvas.context.fill();

        // Draw disc 1
        var gradient_1 = this.canvas.context.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.disc_1.radius );
        gradient_1.addColorStop( 0, 'rgba(255,255,255,' + this.disc_1.opacity + ')' );
        gradient_1.addColorStop( 1, 'rgba(255,255,255,0)' );

        this.canvas.context.globalCompositeOperation = 'lighter';
        this.canvas.context.fillStyle = gradient_1;
        this.canvas.context.beginPath();
        this.canvas.context.arc( this.x, this.y, this.disc_1.radius, 0, Math.PI * 2 );
        this.canvas.context.fill();
    }
} );
