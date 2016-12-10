B.Components.Background = B.Core.Abstract.extend(
{
    options : {},

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.registry = new B.Tools.Registry();
        this.canvas   = this.registry.get( 'canvas' );
    },

    /**
     * UPDATE
     */
    update : function()
    {
        // Update gradient
        this.gradient = this.canvas.context.createRadialGradient(
            this.canvas.sizes.half.width,
            this.canvas.sizes.half.height,
            0,
            this.canvas.sizes.half.width,
            this.canvas.sizes.half.height,
            this.canvas.sizes.width
        );

        this.gradient.addColorStop( 0, '#0e2558' );
        this.gradient.addColorStop( 0.15, '#062a75' );
        this.gradient.addColorStop( 0.3, '#062056' );
        this.gradient.addColorStop( 1, '#000000' );
    },

    /**
     * DRAW
     */
    draw : function()
    {
        // Fill
        this.canvas.context.globalCompositeOperation = 'source-over';
        this.canvas.context.fillStyle = this.gradient;
        this.canvas.context.fillRect( 0, 0, this.canvas.sizes.width, this.canvas.sizes.height );
    }
} );
