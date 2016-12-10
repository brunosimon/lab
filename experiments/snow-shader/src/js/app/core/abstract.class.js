(function()
{
    'use strict';

    APP.CORE.Abstract = Class.extend(
    {
        options: {},

        /**
         * INIT
         */
        init: function( options )
        {
            if( typeof options === 'undefined' )
                options = {};

            this.$ = {};

            this.options = merge( this.options, options );
        },

        /**
         * START
         */
        start: function()
        {

        },

        /**
         * DESTROY
         */
        destroy: function()
        {

        }
    });
})();
