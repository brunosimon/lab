(function(window,GAME)
{
    'use strict';

    GAME.Keyboard = Abstract.extend(
    {
        options:
        {
            keys:
            [
                {
                    name      : 'up',
                    key_codes : [90,38,87]
                },
                {
                    name      : 'right',
                    key_codes : [68,39]
                },
                {
                    name      : 'down',
                    key_codes : [83,40]
                },
                {
                    name      : 'left',
                    key_codes : [81,37,65]
                },
                {
                    name      : 'space',
                    key_codes : [32]
                }
            ]
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.keys_pressed = [];
        },

        /**
         * START LISTENING
         */
        start_listening: function()
        {
            var that     = this,
                key_code = null,
                key_name = null,
                index    = null;

            window.onkeydown = function(e)
            {
                key_code = e.keyCode;
                key_name = that.get_name_with_key_code(key_code);
                index    = that.keys_pressed.indexOf(key_name);

                // Callback
                if(key_name)
                {
                    if(index === -1)
                    {
                        // Keys pressed
                        that.keys_pressed.push(key_name);

                        that.trigger('keydown',[{key_name:key_name,key_code:key_code}]);
                    }
                    return false;
                }
            };

            window.onkeyup = function(e)
            {
                key_code = e.keyCode;
                key_name = that.get_name_with_key_code(key_code);
                index    = that.keys_pressed.indexOf(key_name);

                // Callback
                if(key_name)
                {
                    // Keys pressed
                    if(index !== -1)
                        that.keys_pressed.splice(index,1);

                    that.trigger('keyup',[{key_name:key_name,key_code:key_code}]);
                    return false;
                }
            };
        },

        /**
         * STOP LISTENING
         */
        stop_listening: function()
        {
            window.onkeydown = null;
            window.onkeyup   = null;
        },

        /**
         * GET NAME WITH KEY CODE
         * return key name if match
         * return false if no match
         */
        get_name_with_key_code: function(key_code)
        {
            var index  = null,
                result = false;

            _.each(this.options.keys,function(key)
            {
                index = key.key_codes.indexOf(key_code);

                if(index !== -1)
                    result = key.name;
            });

            return result;
        },

        is_key_name_active: function(key_name)
        {
            return this.keys_pressed.indexOf(key_name) === -1 ? false : true;
        }
    });
})(window,GAME);