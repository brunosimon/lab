(function(window,GAME)
{
    'use strict';

    GAME.Sky = Abstract.extend(
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

            // Day
            this.day          = {};
            this.day.colors   = [
                {
                    pos : 0,
                    r   : 30,
                    g   : 113,
                    b   : 202
                },
                {
                    pos : 1,
                    r   : 111,
                    g   : 182,
                    b   : 228
                }
            ];

            // Night
            this.night          = {};
            this.night.colors   = [
                {
                    pos : 0,
                    r   : 0,
                    g   : 0,
                    b   : 0
                },
                {
                    pos : 1,
                    r   : 20,
                    g   : 20,
                    b   : 40
                }
            ];
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
            var gradient     = face.context.createLinearGradient(0,this.options.face_size/4,0,this.options.face_size/2),
                top_color    = null,
                bottom_color = null;

            for(var i = 0; i < this.night.colors.length; i++)
            {
                var night_color = this.night.colors[i],
                    day_color   = this.day.colors[i],
                    color       = {};

                // Merging day / night colors
                color.pos = night_color.pos;
                color.r   = Math.floor(night_color.r * period.night.intensity + day_color.r * period.day.intensity);
                color.g   = Math.floor(night_color.g * period.night.intensity + day_color.g * period.day.intensity);
                color.b   = Math.floor(night_color.b * period.night.intensity + day_color.b * period.day.intensity);

                gradient.addColorStop(color.pos,'rgba('+color.r+','+color.g+','+color.b+',1)');

                if(i === 0)
                    top_color = 'rgba('+color.r+','+color.g+','+color.b+',1)';

                if(i === this.night.colors.length - 1)
                    bottom_color = 'rgba('+color.r+','+color.g+','+color.b+',1)';
            }

            face.context.save();
            switch(face.name)
            {
                case 'top':
                    face.context.fillStyle = top_color;
                    break;
                case 'bottom':
                    face.context.fillStyle = bottom_color;
                    break;
                default:
                    face.context.fillStyle = gradient;
            }

            face.context.fillRect(0,0,this.options.face_size,this.options.face_size);
            face.context.restore();
        }
    });
})(window,GAME);