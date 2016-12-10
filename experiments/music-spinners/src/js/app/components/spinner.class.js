B.Components.Spinner = B.Core.Abstract.extend(
{
    options :
    {
        canvas : false,
        color  : 'red'
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.color     = this.options.color;
        this.ticker    = new B.Tools.Ticker();
        this.viewport  = new B.Tools.Viewport();
        this.registry  = new B.Tools.Registry();
        this.light     = new B.Components.Light( { color : this.color } );
        this.tail      = new B.Components.Tail( { color : this.color } );
        this.particles = new B.Components.Particles( { color : this.color } );
    },

    /**
     * UPDATE
     */
    update : function()
    {
        var delta = this.ticker.time.delta;
        if( delta > 100 )
            delta = 100;

        this.light.update( this.ticker.time.elapsed );
        this.tail.update( this.light.x, this.light.y, this.ticker.time.elapsed, delta );
        this.particles.update( this.light.x, this.light.y, this.ticker.time.elapsed, delta );
    },

    /**
     * DRAW
     */
    draw : function()
    {
        this.light.draw();
        this.tail.draw();
        this.particles.draw();
    }
} );
