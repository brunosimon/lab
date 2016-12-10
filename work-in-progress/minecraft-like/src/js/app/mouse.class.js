(function(window,GAME)
{
    'use strict';

    GAME.Mouse = Abstract.extend(
    {
        options:{
            
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.position   = {};
            this.position.x = null;
            this.position.y = null;
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


            window.onmousedown = function(e)
            {
                that.trigger('mouse_down',[{x:that.position.x,y:that.position.y}]);
            };

            window.onmousemove = function(e)
            {
                that.position.x = (e.clientX / win.width - 0.5) * 2;
                that.position.y = (e.clientY / win.height - 0.5) * 2;
                that.trigger('mouse_move',[{x:that.position.x,y:that.position.y}]);
            };

            window.onmousedown = function(e)
            {
                that.position.x = (e.clientX / win.width - 0.5) * 2;
                that.position.y = (e.clientY / win.height - 0.5) * 2;
                that.trigger('mouse_down',[{x:that.position.x,y:that.position.y}]);
            };

            window.onmouseup = function(e)
            {
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
})(window,GAME);