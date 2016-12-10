var App = Abstract.extend(
{
    defaults:{
        particule_size  : 1,
        particule_count : 1600,
        background      : 'background-1.jpg',
        persistence     : 0.3
    },

    init: function(parent,options)
    {
        this._super(parent,options);

        //Perlin noise
        var canvas    = document.createElement('canvas');
        canvas.width  = this.options.canvas.width;
        canvas.height = this.options.canvas.height;
        this.perlin_noise = new Perlin_Noise(this,{canvas:canvas});

        //Particules
        this.context    = this.options.canvas.getContext('2d');
        this.create_particules();

        //Background
        this.load_image(function()
        {
            window.requestAnimationFrame(this.update.bind(this));
        }.bind(this));
    },

    load_image: function(callback)
    {
        var image = new Image();
        image.onload = function()
        {
            this.background = image;

            if(!_.isUndefined(callback))
                callback.call(this);

        }.bind(this);
        image.src = 'src/images/'+this.options.background;
    },

    create_particules: function()
    {
        this.particules = Array();
        for(var i = 0; i < this.options.particule_count; i++)
        {
            this.particules.push({
                x     : parseInt(Math.random() * this.options.canvas.width,10),
                y     : parseInt(Math.random() * this.options.canvas.height,10),
                speed : Math.random() * 1
            });
        }
    },

    update: function()
    {
        window.requestAnimationFrame(this.update.bind(this));

        // Stats
        rS('raf').tick();
        rS('fps').frame();
        rS().update();

        //Perlin noise
        this.perlin_noise.update();

        //Background
        this.context.globalAlpha = 1 - this.options.persistence;
        this.context.drawImage(this.background,0,0);
        this.context.globalAlpha = 1;

        //Particules
        this.context.fillStyle = 'white';
        var particule = null,
            temp_x    = null;

        for(var i = 0; i < this.particules.length; i++)
        {
            particule = this.particules[i];
            temp_x = particule.x;

            particule.x += this.perlin_noise.get_pixel_value(particule.x,particule.y) / 255 * 10 + particule.speed;
            particule.y += 2;

            if(particule.x < 0 || particule.x > this.options.canvas.width || particule.y < 0 || particule.y > this.options.canvas.height)
            {
                if(Math.random() < 0.5)
                {
                    particule.x = Math.random() * this.options.canvas.width * Math.random();
                    particule.y = 0;
                }
                else
                {
                    particule.x = 0;
                    particule.y = Math.random() * this.options.canvas.height * Math.random();
                }
            }
            this.context.fillRect(particule.x,particule.y,this.options.particule_size,this.options.particule_size);

        }
    }
});
