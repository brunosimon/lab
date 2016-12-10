(function(window,GAME)
{
    'use strict';

    GAME.Sun = Abstract.extend(
    {
        options:{
            face_size : 200
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.size         = Math.floor(this.options.face_size * 0.08);
            this.y            = 0;
            this.style        = {};
            this.style.shadow = 'rgba(255,248,214,0.5)';
            this.style.color  = '#fff';
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
            this.y = period.progress * this.options.face_size * 4;
            var offset = null;

            switch(face.name)
            {
                case 'front':
                    this.y *= -1;
                    offset      = this.options.face_size;
                    break;
                case 'top':
                    this.y *= -1;
                    offset      = this.options.face_size * 2;
                    break;
                case 'back':
                    offset = - this.options.face_size * 2 - this.size;
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
                face.context.save();
                face.context.shadowBlur  = 6;
                face.context.shadowColor = this.style.shadow;
                face.context.fillStyle   = this.style.color;
                face.context.fillRect(this.options.face_size * 0.6 - this.size / 2,this.y + offset,this.size,this.size);
                face.context.restore();
            }
        }
    });
})(window,GAME);