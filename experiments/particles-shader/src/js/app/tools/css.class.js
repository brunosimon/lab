(function()
{
    "use strict";

    APP.TOOLS.Css = APP.CORE.Abstract.extend(
    {
        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if(APP.TOOLS.Css.prototype.instance === null)
                return null;
            else
                return APP.TOOLS.Css.prototype.instance;
        },

        /**
         * INIT
         * @param  object options
         * @return Images
         */
        init: function(options)
        {
            this._super(options);

            this.prefixes = ['webkit','moz','o','ms',''];
            this.browser  = new APP.TOOLS.Browser();

            APP.TOOLS.Css.prototype.instance = this;
        },

        apply: function($target,property,value)
        {
            if(typeof property === 'undefined' || property === '')
                console.warn('Wrong property');
            if(typeof value === 'undefined' || value === '')
                console.warn('Wrong value');
            if(typeof $target === 'undefined' || !$target.length)
                console.warn('Wrong target');

            if(this.browser.is.IE && this.browser.version < 10)
                value = value.replace('translateZ(0)','');

            for(var css = {}, i = 0, len = this.prefixes.length; i < len; i++)
            {
                var updated_property = this.prefixes[i];

                if(updated_property !== '')
                    updated_property += this.capitalize_first_letter(property);
                else
                    updated_property = property;

                css[updated_property] = value;
            }

            $target.each(function()
            {
                var keys = Object.keys(css);

                for(var i = 0, len = keys.length; i < len; i++)
                    this.style[keys[i]] = css[keys[i]];
            });
            // $target.css(css);
        },

        capitalize_first_letter: function(text)
        {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
    });
})();
