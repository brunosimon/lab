(function(window,GAME)
{
    'use strict';

    GAME.Moon = Abstract.extend(
    {
        options:{
            face_size : 200,
            src       : 'src/game/textures/moon.png'
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.size          = 16;
            this.y             = 0;
            this.style         = {};
            this.style.shadow  = 'rgba(255,255,255,0.4)';
            this.style.color_1 = 'rgb(99,99,99)';    // Default
            this.style.color_2 = 'rgb(60,60,60)';    // Dark
            this.style.color_3 = 'rgb(152,152,152)'; // Light
            this.loaded        = false;


            this.canvas        = document.createElement('canvas');
            this.canvas.width  = this.size;
            this.canvas.height = this.size;
            this.context       = this.canvas.getContext('2d');

            var that = this;

            this.image = new Image();
            this.image.onload = function()
            {
                that.loaded = true;
            };
            this.image.src = this.options.src;
        },

        /**
         * START
         */
        start: function()
        {
        },

        /**
         * DRAW
         */
        draw: function(face,period)
        {
            if(!this.loaded)
                return;

            // Offset opposite to sun
            this.y = ((period.progress + 0.5) % 1) * this.options.face_size * 4;
            var offset = null;

            switch(face.name)
            {
                case 'front':
                    this.y *= -1;
                    offset  = this.options.face_size;
                    break;
                case 'top':
                    this.y *= -1;
                    offset  = this.options.face_size * 2;
                    break;
                case 'back':
                    this.y *= -1;
                    offset = this.options.face_size * 2;
                    face.context.translate(this.options.face_size,0);
                    face.context.rotate(Math.PI);
                    break;
                case 'bottom':
                    this.y *= -1;

                    if(this.y > - this.size)
                        this.y -= this.options.face_size * 4;

                    offset = this.options.face_size * 4;
                    break;
            }

            if(offset !== null)
            {
                face.context.shadowBlur  = 6;
                face.context.shadowColor = this.style.shadow;
                
                face.context.drawImage(this.image,this.options.face_size / 2 - this.size / 2,this.y + offset,this.size,this.size);

                if(face.name === 'back')
                {
                    face.context.rotate(-Math.PI);
                    face.context.translate(-this.options.face_size,0);
                }
            }
        }
    });
})(window,GAME);