var App = Abstract.extend(
{
    defaults:
    {
        image            : 'image-1.jpg',
        fill_color       : '#ffffff',
        fill_alpha       : 1,
        minimum_speed    : 0.3,
        background_color : '#000000',
        multiplier       : 5,
        persistence      : 0.95,
        wind_x           : 1.0,
        wind_y           : 1.0,
        particles_count  : 10000
    },

    /**
     * INIT
     */
    init: function(parent,options)
    {
        this._super(parent,options);

        this.canvas  = this.options.canvas;
        this.context = this.canvas.getContext('2d');
        this.images  = document.getElementById('images');

        //Get grayscale
        this.get_gray_image_data(null,function()
        {
            this.create_points();
            this.init_drag_and_drop();

            //Start animation frame polyfill
            window.requestAnimationFrame(this.update.bind(this));
        }.bind(this));
    },

    /**
     * INIT DRAG AND DROP
     */
    init_drag_and_drop: function()
    {
        this.drop_zone = document.getElementById('drop-zone');

        // Add events to drop zone
        this.drop_zone.addEventListener('dragleave',this.handle_drag_leave.bind(this),false);
        this.drop_zone.addEventListener('dragover',this.handle_drag_over.bind(this),false);
        this.drop_zone.addEventListener('drop',this.handle_drop.bind(this),false);

        // Add events to canvas
        this.canvas.addEventListener('dragleave',this.handle_drag_leave.bind(this),false);
        this.canvas.addEventListener('dragover',this.handle_drag_over.bind(this),false);
        this.canvas.addEventListener('drop',this.handle_drop.bind(this),false);
    },

    handle_drag_over: function(e)
    {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        // Hover class
        this.drop_zone.classList.add('hover');
    },

    handle_drag_leave: function(e)
    {
        e.stopPropagation();
        e.preventDefault();

        // Hover class
        this.drop_zone.classList.remove('hover');
    },

    handle_drop: function(e)
    {
        e.stopPropagation();
        e.preventDefault();

        var that   = this,
            file   = e.dataTransfer.files[0],
            reader = new FileReader();

        // Hover class
        this.drop_zone.classList.remove('hover');

        // Test if file is an Image
        if(file.type.match('image.*'))
        {
            // Load image
            reader.onload = function(e)
            {
                this.get_gray_image_data(e.target.result);
            }.bind(this);

            reader.readAsDataURL(file);
        }
    },

    /**
     * GET WHITE INTENSITY AT
     * Find white value between 0 and 1 in the grayscale table of pixels
     * created previously
     */
    get_white_intensity_at: function(x,y)
    {
        if(x < 0)
            x = 0;
        else if(x > this.canvas.width)
            x = this.canvas.width;

        if(y < 0)
            y = 0;
        else if(y > this.canvas.height)
            y = this.canvas.height;

        return this.gray_data[y * this.canvas.width + x];
    },

    /**
     * GET GRAY IMAGE DATA
     * Transform image into grayscale keep only grays value (4 times smaller array)
     */
    get_gray_image_data: function(source,callback)
    {
        if(this.type(source) === 'undefined' || this.type(source) === 'null')
            source = 'src/img/' + this.options.image;

        // Get image
        this.get_image(source,function(image)
        {
            // Update current canvas sizes will clear it
            // Need to put previous image data back
            var current_data = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
            this.canvas.width  = image.width;
            this.canvas.height = image.height;
            this.context.putImageData(current_data,0,0);

            // Create canvas to get image data without drawing it in normal canvas
            var canvas    = document.createElement('canvas');
            canvas.width  = image.width;
            canvas.height = image.height;
            var context   = canvas.getContext('2d');

            // Draw image
            context.drawImage(image,0,0,canvas.width,canvas.height);

            // Get grayscale array
            var data      = context.getImageData(0,0,canvas.width,canvas.height).data,
                gray_data = [];

            for(var i = 0; i < data.length; i += 4)
            {
                var ratio = (data[i] + data[i+1] + data[i+2]) / (255 * 3);
                gray_data.push(ratio);
            }

            this.gray_data = gray_data;

            //Callback
            if(this.type(callback) === 'function')
                callback.call(this);

        }.bind(this));
    },

    /**
     * LOAD IMAGE
     */
    get_image: function(source,callback)
    {
        var image = new Image(),
            data  = null;

        image.onload = function()
        {
            if(this.type(callback) === 'function')
                callback.call(this,image);

        }.bind(this);

        image.src = source;
    },

    /**
     * CREATE POINTS
     */
    create_points: function()
    {
        var i = this.options.particles_count;

        this.points = [];

        while(i--)
        {
            this.points.push(new Point(this,{
                x       : Math.random() * this.canvas.width,
                y       : Math.random() * this.canvas.height,
                speed_x : Math.random() * 2 - 1,
                speed_y : Math.random() * 2 - 1
            }));
        }
    },

    /**
     * CLEAR CANVAS
     */
    clear: function(opacity)
    {
        if(this.type(opacity) === 'undefined')
            opacity = 1 - this.options.persistence;

        // Problem with HSLA using dat GUI
        this.context.globalAlpha = opacity;
        this.context.fillStyle   = this.options.background_color;
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
    },

    /**
     * UPDATE
     * Loop
     */
    update: function()
    {
        // Loop
        window.requestAnimationFrame(this.update.bind(this));

        // Stats
        rS('raf').tick();
        rS('fps').frame();
        rS().update();

        // Clear canvas (with persistence)
        this.clear();

        var i     = this.points.length,
            point = null;

        // Set context
        this.context.globalAlpha = this.options.fill_alpha;
        this.context.fillStyle   = this.options.fill_color;
        this.context.beginPath();

        while(i--)
        {
            // Update point
            point = this.points[i];
            point.multiplier = this.get_white_intensity_at(Math.floor(this.points[i].x),Math.floor(point.y)) * this.options.multiplier + this.options.minimum_speed;
            point.update(this.canvas,this.options.wind_x,this.options.wind_y);

            // Draw point
            point.draw(this.context);
            this.context.fill();
        }
    },

    /**
     * SAVE IMAGE
     * Put result in the DOM just after canvas
     */
    save_image: function()
    {
        var image    = new Image();
        image.width  = this.canvas.width;
        image.height = this.canvas.height;
        image.src    = this.canvas.toDataURL();

        var existing_imgs = this.images.getElementsByTagName('img');

        this.images.insertBefore(image,existing_imgs.length ? existing_imgs[0] : null);
    }
});
