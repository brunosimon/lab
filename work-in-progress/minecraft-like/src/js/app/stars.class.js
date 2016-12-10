(function(window,GAME)
{
    'use strict';

    GAME.Stars = Abstract.extend(
    {
        options:{
            face_size : 200,
            count     : 200
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.color      = 'rgba(255,255,255,1)';
            this.list       = {};
            this.list.top   = [];
            this.list.front = [];
            this.list.left  = [];
            this.list.back  = [];
            this.list.right = [];

            for(var i = 0;i < this.options.count;i++)
            {
                var rand = Math.random(),
                    star = {};

                // Top (full face)
                if(rand < 1/3)
                {
                    star.x = Math.floor(Math.random() * this.options.face_size);
                    star.y = Math.floor(Math.random() * this.options.face_size);
                    this.list.top.push(star);
                }
                // Sides (top half face)
                else if(rand < 1/3 + ((2/3)/4))
                {
                    star.x = Math.floor(Math.random() * this.options.face_size);
                    star.y = Math.floor(Math.random() * this.options.face_size / 2);
                    this.list.front.push(star);
                }
                else if(rand < 1/3 + ((2/3)/4) * 2)
                {
                    star.x = Math.floor(Math.random() * this.options.face_size);
                    star.y = Math.floor(Math.random() * this.options.face_size / 2);
                    this.list.right.push(star);
                }
                else if(rand < 1/3 + ((2/3)/4) * 3)
                {
                    star.x = Math.floor(Math.random() * this.options.face_size);
                    star.y = Math.floor(Math.random() * this.options.face_size / 2);
                    this.list.back.push(star);
                }
                else
                {
                    star.x = Math.floor(Math.random() * this.options.face_size);
                    star.y = Math.floor(Math.random() * this.options.face_size / 2);
                    this.list.left.push(star);
                }
            }
        },

        /**
         * START
         */
        start: function()
        {
        },

        /**
         * DRAW
         * One path, one fill
         */
        draw: function(face,period)
        {
            if(face.name === 'bottom')
                return;

            var stars = this.list[face.name],
                star  = null;

            face.context.save();
            face.context.globalAlpha = period.night.intensity;
            face.context.fillStyle   = this.color;
            face.context.beginPath();
            for(var i = 0; i < stars.length; i++)
            {
                star = stars[i];
                face.context.rect(star.x,star.y,1,1);
            }
            face.context.fill();
            face.context.restore();
        }
    });
})(window,GAME);