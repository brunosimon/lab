(function(window,APP)
{
    'use strict';

    APP.Mouse = Abstract.extend(
    {
        options :
        {
            send_move_on :
            [
                'mouse_down',
                'pointer_locked'
            ]
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.mouse_down     = false;
            this.pointer_locked = false;

            this.position   = {};
            this.position.x = null;
            this.position.y = null;

            this.last_position   = {};
            this.last_position.x = null;
            this.last_position.y = null;
        },

        /**
         * START LISTENING
         */
        start_listening: function()
        {
            var that = this,
                win  = {};

            win.width  = window.innerWidth;
            win.height = window.innerHeight;

            // Mouse move
            window.onmousemove = function(e)
            {
                var movement_x = 0,
                    movement_y = 0;

                // Pointer lock
                if(that.pointer_locked)
                {
                    movement_x = e.movementX       ||
                                 e.mozMovementX    ||
                                 e.webkitMovementX ||
                                 0;

                    movement_y = e.movementY       ||
                                 e.mozMovementY    ||
                                 e.webkitMovementY ||
                                 0;
                }

                // Drag'n drop
                else
                {
                    if(that.last_position.x !== null && that.last_position.y !== null)
                    {
                        movement_x = e.clientX - that.last_position.x;
                        movement_y = e.clientY - that.last_position.y;
                    }

                    that.last_position.x = e.clientX;
                    that.last_position.y = e.clientY;
                }

                if(that.options.send_move_on.indexOf('pointer_locked') !== -1 && that.pointer_locked || that.options.send_move_on.indexOf('mouse_down') !== -1 && that.mouse_down)
                {
                    that.position.x += movement_x / 1000;
                    that.position.y += movement_y / 1000;
                }

                var x = this.pointer_locked ? Math.round(window.innerWidth / 2) : e.clientX,
                    y = this.pointer_locked ? Math.round(window.innerHeight / 2) : e.clientY;

                that.trigger('mouse_move',[{x:x,y:y}]);

                return false;
            };

            // Mouse down
            window.onmousedown = function(e)
            {
                that.mouse_down = true;

                var x = this.pointer_locked ? Math.round(window.innerWidth / 2) : e.clientX,
                    y = this.pointer_locked ? Math.round(window.innerHeight / 2) : e.clientY;

                that.trigger('mouse_down',[{x:x,y:y}]);
            };

            // Mouse up
            window.onmouseup = function(e)
            {
                that.mouse_down = false;
                that.trigger('mouse_up');
            };
        },

        /**
         * STOP LISTENING
         */
        stop_listening: function()
        {
            window.onmousemove = null;
            window.onmousedown = null;
            window.onmouseup   = null;
        }
    });
})(window,APP);
