(function(window,APP)
{
    'use strict';

    APP.Screen = Abstract.extend(
    {
        options:{},

        /**
         * INIT
         */
        init: function(options)
        {
            this.status         = 'visible';
            this.fullscreen     = false;
            this.pointer_locked = false;

            this._super(options);
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            this.init_resize();
            this.init_status();
            this.init_fullscreen();
            this.init_pointer_lock();
        },

        /**
         * INIT RESIZE
         */
        init_resize: function()
        {
            var that = this;

            // Resize
            window.onresize = function()
            {
                that.trigger('resize');
            };
        },

        /**
         * INIT STATUS
         */
        init_status: function()
        {
            var that   = this,
                hidden = 'hidden';

            if(hidden in document)
                document.addEventListener('visibilitychange',onchange);

            else if((hidden = 'mozHidden') in document)
                document.addEventListener('mozvisibilitychange',onchange);

            else if((hidden = 'webkitHidden') in document)
                document.addEventListener('webkitvisibilitychange',onchange);

            else if((hidden = 'msHidden') in document)
                document.addEventListener('msvisibilitychange',onchange);

            // IE 9 and lower:
            else if('onfocusin' in document)
                document.onfocusin = document.onfocusout = onchange;

            // All others:
            else
                window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

            function onchange(e)
            {
                var map = {
                        focus    : 'visible',
                        focusin  : 'visible',
                        pageshow : 'visible',
                        blur     : 'hidden',
                        focusout : 'hidden',
                        pagehide : 'hidden'
                    };

                e = e || window.event;
                if(e.type in map)
                    that.status = map[e.type];
                else
                    that.status = this[hidden] ? 'hidden' : 'visible';

                that.trigger('status_change');
            }
        },

        /**
         * INIT FULLSCREEN
         */
        init_fullscreen: function()
        {
            var that = this;

            var fullscreen_change = function()
            {
                if(!!(document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement))
                    that.fullscreen = true;
                else
                    that.fullscreen = false;

                that.trigger('fullscreen_change',[that.fullscreen]);
            };

            document.addEventListener('fullscreenchange',fullscreen_change,false);
            document.addEventListener('mozfullscreenchange',fullscreen_change,false);
            document.addEventListener('webkitfullscreenchange',fullscreen_change,false);
            document.addEventListener('msfullscreenchange',fullscreen_change,false);
        },

        /**
         * INIT POINTER LOCK
         */
        init_pointer_lock: function()
        {
            var that = this;

            var pointer_lock_change = function()
            {
                // if(!!(document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement))
                //     that.pointer_locked = true;
                // else
                //     that.pointer_locked = false;

                that.pointer_locked = !that.pointer_locked;

                that.trigger('pointer_locked_change',[that.pointer_locked]);
            };

            document.addEventListener('pointerlockchange',pointer_lock_change,false);
            document.addEventListener('mozpointerlockchange',pointer_lock_change,false);
            document.addEventListener('webkitpointerlockchange',pointer_lock_change,false);
            document.addEventListener('mspointerlockchange',pointer_lock_change,false);
        },

        /**
         * TOGGLE FULLSCREEN
         */
        toggle_fullscreen: function()
        {
            // Leave
            if(this.is_fullscreen())
                this.leave_fullscreen();

            // Go
            else
                this.go_fullscreen();
        },

        /**
         * IS FULLSCREEN
         */
        is_fullscreen: function()
        {
            return !(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement);
        },

        /**
         * GO FULLSCREEN
         */
        go_fullscreen: function()
        {
            if(document.documentElement.requestFullscreen)
                document.documentElement.requestFullscreen();
            else if (document.documentElement.msRequestFullscreen)
                document.documentElement.msRequestFullscreen();
            else if (document.documentElement.mozRequestFullScreen)
                document.documentElement.mozRequestFullScreen();
            else if (document.documentElement.webkitRequestFullscreen)
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);

            this.lock_pointer();
        },

        /**
         * LEAVE FULLSCREEN
         */
        leave_fullscreen: function()
        {
            if (document.exitFullscreen)
                document.exitFullscreen();
            else if (document.msExitFullscreen)
                document.msExitFullscreen();
            else if (document.mozCancelFullScreen)
                document.mozCancelFullScreen();
            else if (document.webkitExitFullscreen)
                document.webkitExitFullscreen();

            this.unlock_pointer();
        },

        /**
         * LOCK POINTER
         */
        lock_pointer: function()
        {
            document.documentElement.requestPointerLock = document.documentElement.requestPointerLock ||
                                                          document.documentElement.mozRequestPointerLock ||
                                                          document.documentElement.webkitRequestPointerLock;

            document.documentElement.requestPointerLock();
        },

        /**
         * UNLOCK POINTER
         */
        unlock_pointer: function()
        {
            document.exitPointerLock = document.exitPointerLock ||
                                       document.mozExitPointerLock ||
                                       document.webkitExitPointerLock;

            document.exitPointerLock();
        }
    });
})(window,APP);
