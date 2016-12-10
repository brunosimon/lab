(function(window)
{
    "use strict";

    APP.Browser = Abstract.extend(
    {
        options:
        {
            disable_hover_on_scroll : false,
            disable_hover_on_scroll_duration : 300,
            add_classes_to :
            [
                'body'
            ],
            listen_to :
            [
                // 'mouse_move',
                'resize',
                'scroll'
            ]
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.top           = 0;
            this.left          = 0;
            this.width         = 0;
            this.height        = 0;
            this.direction     = {};
            this.direction.x   = null;
            this.direction.y   = null;
            this.mouse         = {};
            this.mouse.x       = 0;
            this.mouse.y       = 0;
            this.mouse.ratio   = {};
            this.mouse.ratio.x = 0;
            this.mouse.ratio.y = 0;
            this.is            = this.get_browser();
            this.version       = this.get_browser_version();
            this.window        = $(window);

            this.listening_to            = {};
            this.listening_to.resize     = this.options.listen_to.indexOf('resize')     !== -1;
            this.listening_to.scroll     = this.options.listen_to.indexOf('scroll')     !== -1;
            this.listening_to.mouse_move = this.options.listen_to.indexOf('mouse_move') !== -1;

            this.init_events();

            if(this.options.add_classes_to.length)
                this.add_classes();

            if(this.options.disable_hover_on_scroll)
                this.disable_hover_on_scroll();
        },

        /**
         * START
         */
        start: function()
        {
            if(this.listening_to.scroll)
                this.window.trigger('scroll');

            if(this.listening_to.resize)
                this.window.trigger('resize');

            if(this.listening_to.mouse_move)
                $(this.is.IE ? window.document : window).trigger('mousemove');
        },

        /**
         * DISABLE HOVER ON SCROLL
         * Huge gain in performance when scrolling
         */
        disable_hover_on_scroll: function()
        {
            var that = this,
                body = $('body');

            this.body  = document.body;
            this.timer = null;

            var disable = function()
            {
                clearTimeout(that.timer);
                if(!body.hasClass('disable-hover'))
                    body.addClass('disable-hover');

                that.timer = setTimeout(function()
                {
                    body.removeClass('disable-hover');
                },that.options.disable_hover_on_scroll_duration);
            };

            if(window.addEventListener)
                window.addEventListener('scroll',disable,false);
            else
                window.attachEvent('scroll',disable,false);
        },

        /**
         * GET BROWSER
         */
        get_browser: function()
        {
            var res   = {},
                agent = navigator.userAgent.toLowerCase();

            // Detect browser
            res.opera             = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
            res.firefox           = typeof InstallTrigger !== 'undefined';
            res.safari            = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
            res.chrome            = !!window.chrome && !res.opera;
            res.internet_explorer = ((agent.indexOf('msie') !== -1) && (agent.indexOf('opera') === -1));// For use within normal web clients
            res.ipad              = agent.indexOf('ipad') !== -1;

            // // For use within iPad developer UIWebView
            // // Thanks to Andrew Hedges!
            // var ua = navigator.userAgent;
            // var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);

            // Alias
            res.O    = res.opera;
            res.FF   = res.firefox;
            res.SAF  = res.safari;
            res.CH   = res.chrome;
            res.IE   = res.internet_explorer;
            res.MSIE = res.internet_explorer;
            res.IPAD = res.ipad;

            return res;
        },

        /**
         * GET BROWSER VERSION
         * Actually only for IE
         */
        get_browser_version: function()
        {
            if(this.is.IE)
            {
                var user_agent = navigator.userAgent.toLowerCase();
                return user_agent.indexOf('msie') !== -1 ? parseInt(user_agent.split('msie')[1],10) : false;
            }

            return false;
        },

        /**
         * ADD CLASSES
         * Add browser class to wanted elements like <body> or <html>
         */
        add_classes: function()
        {
            var target = null;
            for(var i = 0,len = this.options.add_classes_to.length; i < len; i++)
            {
                target = $(this.options.add_classes_to[i]);

                if(target.length)
                {
                    for(var key in this.is)
                    {
                        if(this.is[key])
                        {
                            target.addClass(key);
                            if(this.is.IE && this.version)
                            {
                                target.addClass(key + '-' + this.version);
                            }
                        }
                    }
                }
            }
        },

        /**
         * INIT EVENTS
         * Start listening events
         */
        init_events: function()
        {
            var that = this;

            // Scroll
            if(this.listening_to.scroll)
            {
                this.window.on('scroll',function(e)
                {
                    if(that.is.IE && document.compatMode === "CSS1Compat")
                    {
                        that.direction.y = window.document.documentElement.scrollTop > that.top ? 'down' : 'up';
                        that.direction.x = window.document.documentElement.scrollLeft > that.top ? 'right' : 'left';
                        that.top         = window.document.documentElement.scrollTop;
                        that.left        = window.document.documentElement.scrollLeft;
                    }
                    else
                    {
                        that.direction.y = window.pageYOffset > that.top ? 'down' : 'up';
                        that.direction.x = window.pageXOffset > that.top ? 'right' : 'left';
                        that.top         = window.pageYOffset;
                        that.left        = window.pageXOffset;
                    }

                    that.trigger('scroll');
                });
            }

            // Resize
            if(this.listening_to.resize)
            {
                this.window.on('resize',function(e)
                {
                    that.width  = that.window.width();
                    that.height = that.window.height();

                    that.trigger('resize');
                });
            }

            // Mouse move
            if(this.listening_to.mouse_move)
            {
                $(this.is.IE ? window.document : window).on('mousemove',function(e)
                {
                    that.mouse.x = e.clientX;
                    that.mouse.y = e.clientY;

                    if(that.width !== 0 && that.height !== 0)
                    {
                        that.mouse.ratio.x = that.mouse.x / that.width;
                        that.mouse.ratio.y = that.mouse.y / that.height;
                    }

                    that.trigger('mousemove');
                });
            }
        }
    });
})(window);
