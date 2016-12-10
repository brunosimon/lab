(function(window,GAME)
{
    'use strict';

    GAME.Player = Abstract.extend(
    {
        options:{
            
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            // Position
            this.position    = {};
            this.position.x  = 0;
            this.position.y  = 10;
            this.position.z  = 0;

            // Rotation
            this.rotation   = {};
            this.rotation.x = 0;
            this.rotation.y = 0;

            // Size
            this.size             = {};
            this.size.height      = 1.8;
            this.size.head_height = 1.72;
            this.size.radius      = 0.4;

            // Speed
            this.speed        = {};
            this.speed.max    = 1;
            this.speed.x      = 0;
            this.speed.y      = 0;
            this.speed.z      = 0;
            this.speed.global = 0;

            // Direction ratio
            this.direction_ratio           = {};
            this.direction_ratio.forward   = {};
            this.direction_ratio.forward.z = 0;
            this.direction_ratio.forward.x = 0;
            this.direction_ratio.lateral   = {};
            this.direction_ratio.lateral.z = 0;
            this.direction_ratio.lateral.x = 0;

            // Acceleration
            this.acceleration      = {};
            this.acceleration.gain = 2;
            this.acceleration.x    = 0;
            this.acceleration.y    = 0;
            this.acceleration.z    = 0;

            // Deceleration
            this.deceleration            = {};
            this.deceleration.multiplier = 1.2;

            // Limits
            this.limits = {};

            // Jump
            this.jump                     = {};
            this.jump.gain                = 10;
            this.jump.max_bottom_distance = 0.1;

            // Distances
            this.distances        = {};
            this.distances.bottom = 0;

            // Gravity
            this.gravity      = {};
            this.gravity.gain = -0.5;

            // Controller
            this.controller = this.options.controller;
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            this.controller.keyboard.on('keydown',function(e)
            {
                if(e.key_name === 'space')
                {
                    if(that.position.y < that.limits.y.min + that.jump.max_bottom_distance)
                        that.speed.y = that.jump.gain;
                }
            });
        },

        /**
         * UPDATE
         */
        update: function(ticker,limits)
        {
            this.limits = limits;

            this.update_rotation(ticker.time.difference);
            this.update_position(ticker.time.difference,limits);
        },

        /**
         * UPDATE ROTATION
         */
        update_rotation: function(time)
        {
            this.rotation.x = - this.controller.mouse.position.y * 4;
            this.rotation.y = - this.controller.mouse.position.x * 4;

            // this.rotation limits
            if(this.rotation.x < - Math.PI / 2)
                this.rotation.x = - Math.PI / 2;
            if(this.rotation.x > Math.PI / 2)
                this.rotation.x = Math.PI / 2;
        },

        /**
         * UPDATE POSITION
         */
        update_position: function(time)
        {
            // Acceleration
            this.direction_ratio.forward.z = Math.cos(this.rotation.y);
            this.direction_ratio.forward.x = Math.sin(this.rotation.y);
            this.direction_ratio.lateral.z = Math.cos(this.rotation.y + Math.PI / 2);
            this.direction_ratio.lateral.x = Math.sin(this.rotation.y + Math.PI / 2);

            if(this.controller.keyboard.is_key_name_active('up'))
            {
                this.acceleration.x -= this.direction_ratio.forward.x * this.acceleration.gain;
                this.acceleration.z -= this.direction_ratio.forward.z * this.acceleration.gain;
            }

            if(this.controller.keyboard.is_key_name_active('down'))
            {
                this.acceleration.x += this.direction_ratio.forward.x * this.acceleration.gain;
                this.acceleration.z += this.direction_ratio.forward.z * this.acceleration.gain;
            }

            if(this.controller.keyboard.is_key_name_active('right'))
            {
                this.acceleration.x += this.direction_ratio.lateral.x * this.acceleration.gain;
                this.acceleration.z += this.direction_ratio.lateral.z * this.acceleration.gain;
            }

            if(this.controller.keyboard.is_key_name_active('left'))
            {
                this.acceleration.x -= this.direction_ratio.lateral.x * this.acceleration.gain;
                this.acceleration.z -= this.direction_ratio.lateral.z * this.acceleration.gain;
            }

            this.speed.x += this.acceleration.x;
            this.speed.y += this.acceleration.y;
            this.speed.z += this.acceleration.z;

            this.acceleration.x = 0;
            this.acceleration.y = 0;
            this.acceleration.z = 0;

            // Deceleration
            this.speed.x /= this.deceleration.multiplier;
            this.speed.z /= this.deceleration.multiplier;

            // Gravity
            if(this.position.y > this.limits.y.min)
                this.speed.y += this.gravity.gain;

            // Position
            this.position.x += this.speed.x * time;
            this.position.y += this.speed.y * time;
            this.position.z += this.speed.z * time;

            var ignore_x_limit = false,
                ignore_z_limit = false;

            // // Join Z max & X max
            // if(this.limits.z.max && this.position.z >= this.limits.z.max && this.limits.x.max && this.position.x >= this.limits.x.max)
            // {
            //     if(this.limits.x.max - this.position.x < this.limits.z.max - this.position.z)
            //         ignore_z_limit = true;
            //     else
            //         ignore_x_limit = true;
            // }

            // // Join Z min & X min
            // if(this.limits.z.min && this.position.z <= this.limits.z.min && this.limits.x.min && this.position.x <= this.limits.x.min)
            // {
            //     if(this.limits.x.min - this.position.x < this.limits.z.min - this.position.z)
            //         ignore_z_limit = true;
            //     else
            //         ignore_x_limit = true;
            // }

            // // Join Z min & X max
            // if(this.limits.z.min && this.position.z <= this.limits.z.min && this.limits.x.max && this.position.x >= this.limits.x.max)
            // {
            //     if(this.limits.x.max - this.position.x < this.limits.z.min - this.position.z)
            //         ignore_z_limit = true;
            //     else
            //         ignore_x_limit = true;
            // }

            // // Join Z max & X min
            // if(this.limits.z.max && this.position.z >= this.limits.z.max && this.limits.x.min && this.position.x <= this.limits.x.min)
            // {
            //     if(this.limits.x.min - this.position.x < this.limits.z.max - this.position.z)
            //         ignore_z_limit = true;
            //     else
            //         ignore_x_limit = true;
            // }

            // X min
            if(this.limits.x.min !== null && this.position.x < this.limits.x.min && !ignore_x_limit)
            {
                this.speed.x    = 0;
                this.position.x = this.limits.x.min;
            }

            // X max
            if(this.limits.x.max !== null && this.position.x >= this.limits.x.max && !ignore_x_limit)
            {
                this.speed.x    = 0;
                this.position.x = this.limits.x.max;
            }

            // Z min
            if(this.limits.z.min !== null && this.position.z < this.limits.z.min && !ignore_z_limit)
            {
                this.speed.z    = 0;
                this.position.z = this.limits.z.min;
            }

            // Z max
            if(this.limits.z.max !== null && this.position.z >= this.limits.z.max && !ignore_z_limit)
            {
                this.speed.z    = 0;
                this.position.z = this.limits.z.max;
            }

            // Y min
            if(this.limits.y.min !== null && this.position.y < this.limits.y.min)
            {
                this.speed.y    = 0;
                this.position.y = this.limits.y.min;
            }

            // Y max
            if(this.limits.y.max !== null && this.position.y + this.size.height > this.limits.y.max)
            {
                this.speed.y    = 0;
                this.position.y = this.limits.y.max - this.size.height;
            }
        }
    });
})(window,GAME);