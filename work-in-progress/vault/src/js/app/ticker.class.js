(function(window,APP)
{
    'use strict';

    APP.Ticker = Abstract.extend(
    {
        options:{
            
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.time            = {};
            this.time.passed     = 0;
            this.time.current    = +new Date()/1000;
            this.time.previous   = this.time.current;
            this.time.difference = 0;
        },

        /**
         * START
         */
        start: function()
        {
            // RAF
            window.requestAnimationFrame(this.update.bind(this));
        },

        /**
         * UPDATE
         */
        update: function()
        {
            // RAF
            window.requestAnimationFrame(this.update.bind(this));

            this.time.current    = +new Date()/1000;
            this.time.difference = this.time.current - this.time.previous;
            this.time.passed    += this.time.difference;

            this.trigger('tic');

            this.time.previous = this.time.current;
        }
    });
})(window,APP);