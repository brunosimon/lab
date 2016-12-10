(function()
{
    "use strict";

    APP.TOOLS.Browser = APP.CORE.Event_Emitter.extend(
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
                'resize',
                'scroll'
            ]
        },

        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.TOOLS.Browser.prototype.instance === null )
                return null;
            else
                return APP.TOOLS.Browser.prototype.instance;
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.ticker        = new APP.TOOLS.Ticker();
            this.top           = 0;
            this.left          = 0;
            this.direction     = {};
            this.direction.x   = null;
            this.direction.y   = null;
            this.mouse         = {};
            this.mouse.x       = 0;
            this.mouse.y       = 0;
            this.mouse.ratio   = {};
            this.mouse.ratio.x = 0;
            this.mouse.ratio.y = 0;
            this.is            = null;
            this.version       = null;
            this.mobile        = this.mobile_detection();
            this.window        = $( window );
            this.width         = this.window.width();
            this.height        = this.window.height();
            this.pixel_ratio   = window.devicePixelRatio || 1;
            this.shall_trigger = {};

            this.set_browser();
            this.set_browser_version();

            this.listening_to        = {};
            this.listening_to.resize = this.options.listen_to.indexOf('resize')     !== -1;
            this.listening_to.scroll = this.options.listen_to.indexOf('scroll')     !== -1;

            this.init_events();

            if(this.options.add_classes_to.length)
                this.add_classes();

            if(this.options.disable_hover_on_scroll)
                this.disable_hover_on_scroll();

            APP.TOOLS.Browser.prototype.instance = this;
        },

        /**
         * START
         */
        start: function()
        {
            if(this.listening_to.scroll)
                this.window.trigger( 'scroll' );

            if(this.listening_to.resize)
                this.window.trigger( 'resize' );
        },

        /**
         * DISABLE HOVER ON SCROLL
         * Huge gain in performance when scrolling
         */
        disable_hover_on_scroll: function()
        {
            var that = this,
                body = $( 'body' );

            this.body  = document.body;
            this.timer = null;

            var disable = function()
            {
                clearTimeout(that.timer);
                if(!body.hasClass( 'disable-hover' ))
                    body.addClass( 'disable-hover' );

                that.timer = setTimeout( function()
                {
                    body.removeClass( 'disable-hover' );
                }, that.options.disable_hover_on_scroll_duration );
            };

            if( window.addEventListener )
                window.addEventListener( 'scroll', disable, false );
            else
                window.attachEvent( 'scroll', disable, false );
        },

        /**
         * GET BROWSER
         */
        set_browser: function()
        {
            var is    = {},
                agent = navigator.userAgent.toLowerCase();

            // Detect browser
            is.opera             = !!window.opera || navigator.userAgent.indexOf( ' OPR/' ) >= 0;
            is.firefox           = typeof InstallTrigger !== 'undefined';
            is.safari            = Object.prototype.toString.call( window.HTMLElement ).indexOf( 'Constructor' ) > 0;
            is.chrome            = !!window.chrome && !is.opera;
            is.internet_explorer = ( ( agent.indexOf( 'msie' ) !== -1 ) && ( agent.indexOf( 'opera' ) === -1 ) );// For use within normal web clients
            is.ipad              = agent.indexOf( 'ipad' ) !== -1;

            // // For use within iPad developer UIWebView
            // // Thanks to Andrew Hedges!
            // var ua = navigator.userAgent;
            // var isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua);

            // Alias
            is.O    = is.opera;
            is.FF   = is.firefox;
            is.SAF  = is.safari;
            is.CH   = is.chrome;
            is.IE   = is.internet_explorer;
            is.MSIE = is.internet_explorer;
            is.IPAD = is.ipad;

            this.is = is;
        },

        /**
         * GET BROWSER VERSION
         * Actually only for IE
         */
        set_browser_version: function()
        {
            this.version = false;

            if( this.is.IE )
            {
                var user_agent = navigator.userAgent.toLowerCase();
                this.version = user_agent.indexOf( 'msie' ) !== -1 ? parseInt( user_agent.split( 'msie' )[ 1 ], 10 ) : false;

                this.is[ 'internet_explorer_' + this.version ] = true;
                this.is[ 'IE_' + this.version ] = true;
            }
        },

        /**
         * GET MOBILE
         */
        mobile_detection : function()
        {
            var checker = {};

            checker.iphone     = navigator.userAgent.match( /(iPhone|iPod|iPad)/ );
            checker.blackberry = navigator.userAgent.match( /BlackBerry/ );
            checker.android    = navigator.userAgent.match( /Android/ );
            checker.opera      = navigator.userAgent.match( /Opera Mini/i );
            checker.windows    = navigator.userAgent.match( /IEMobile/i );
            checker.all        = ( checker.iphone || checker.blackberry || checker.android || checker.opera || checker.windows );

            return checker;
        },

        /**
         * ADD CLASSES
         * Add browser class to wanted elements like <body> or <html>
         */
        add_classes: function()
        {
            var target = null;
            for( var i = 0, len = this.options.add_classes_to.length; i < len; i++ )
            {
                target = $( this.options.add_classes_to[ i ] );

                if( target.length )
                {
                    for( var key in this.is )
                    {
                        if( this.is[ key ] )
                        {
                            target.addClass( key );
                            if( this.is.IE && this.version )
                            {
                                target.addClass( key + '-' + this.version );
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

            // Ticker
            this.ticker.on( 'tick', function()
            {
                that.frame();
            } );

            // Scroll
            if( this.listening_to.scroll )
            {
                this.window.on( 'scroll touchmove', function(e)
                {
                    // e = e || window.event;
                    // if (e.preventDefault)
                    //     e.preventDefault();
                    // e.returnValue = false;

                    if( that.is.IE && document.compatMode === 'CSS1Compat' )
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

                    that.shall_trigger.scroll = [ that.top, that.left ];
                });
            }

            // Resize
            if( this.listening_to.resize )
            {
                this.window.on( 'resize', function(e)
                {
                    that.width  = window.innerWidth;
                    that.height = window.innerHeight;

                    that.shall_trigger.resize = [ that.width, that.height ];
                });
            }
        },

        match_media: function( condition )
        {
            if( !( 'matchMedia' in window ) || typeof condition !== 'string' || condition === '' )
                return false;

            return !!window.matchMedia(condition).matches;
        },

        /**
         * FRAME
         */
        frame: function()
        {
            var keys = Object.keys(this.shall_trigger);
            for( var i = 0; i < keys.length; i++ )
                this.trigger( keys[ i ] , [ this.shall_trigger[ keys[ i ]  ] ] );

            if( keys.length )
                this.shall_trigger = {};
        }
    });
})();
