var Point = Abstract.extend(
{
    defaults:{
        context    : null,
        radius     : 1,
        x          : 10,
        y          : 10,
        speed_x    : 0,
        speed_y    : 0,
        multiplier : 1
    },

    /**
     * INIT
     */
    init: function(parent,options)
    {
        this._super(parent,options);

        this.radius     = this.type(this.options.radius)     !== 'undefined' ? this.options.radius : 1;
        this.x          = this.type(this.options.x)          !== 'undefined' ? this.options.x : 0;
        this.y          = this.type(this.options.y)          !== 'undefined' ? this.options.y : 0;
        this.speed_x    = this.type(this.options.speed_x)    !== 'undefined' ? this.options.speed_x : 0;
        this.speed_y    = this.type(this.options.speed_y)    !== 'undefined' ? this.options.speed_y : 0;
        this.multiplier = this.type(this.options.multiplier) !== 'undefined' ? this.options.multiplier : 1;
    },

    /**
     * UPDATE
     */
    update: function(canvas,wind_x,wind_y)
    {
        this.x += this.speed_x * this.multiplier + wind_x;
        this.y += this.speed_y * this.multiplier + wind_y;

        if(this.x < 0)
            this.x = canvas.width;
        else if(this.x > canvas.width - 1)
            this.x = 0;

        if(this.y < 0)
            this.y = canvas.height - 1;
        else if(this.y > canvas.height)
            this.y = 0;

    },

    /**
     * DRAW
     */
    draw: function(context)
    {
        if(this.radius === 1)
            context.fillRect(this.x,this.y,this.radius,this.radius);
        else
            context.arc(this.x,this.y,this.radius,0,Math.PI*2);
    }
});