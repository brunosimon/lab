(function()
{
    'use strict';

    APP.CORE.Event_Emitter = APP.CORE.Abstract.extend(
    {
        options: {},

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.callbacks         = {};
            this.callbacks.default = {};
        },

        /**
         * ON
         */
        on: function(name,action)
        {
            // Errors
            if(typeof name === 'undefined' || name === '')
            {
                console.warn('Wrong name');
                return false;
            }

            if(typeof action === 'undefined')
            {
                console.warn('Wrong action');
                return false;
            }

            var that  = this,
                names = [];

            // Clean
            name  = name.replace(/[^a-zA-Z0-9 ,\/.]/g,'');
            name  = name.replace(/[,\/]+/g,' ');

            // Split
            names = name.split(' ');

            // Each name
            names.forEach(function(name)
            {
                name = that.resolve_name(name);

                // Create tag if not exist
                if(!(that.callbacks[name.tag] instanceof Object))
                    that.callbacks[name.tag] = {};

                // Create action if not exist
                if(!(that.callbacks[name.tag][name.value] instanceof Array))
                    that.callbacks[name.tag][name.value] = [];

                // Add action
                that.callbacks[name.tag][name.value].push(action);
            });

            return this;
        },

        /**
         * OFF
         */
        off: function(name)
        {
            // Errors
            if(typeof name === 'undefined' || name === '')
            {
                console.warn('Wrong name');
                return false;
            }

            var that  = this,
                names = [];

            // Clean
            name  = name.replace(/[^a-zA-Z0-9 ,\/.]/g,'');
            name  = name.replace(/[,\/]+/g,' ');

            // Split
            names = name.split(' ');

            // Each name
            names.forEach(function(name)
            {
                name = that.resolve_name(name);

                // Remove tag
                if(name.tag !== 'default' && name.value === '')
                {
                    delete that.callbacks[name.tag];
                }

                // Remove specific action in tag
                else
                {
                    // Default
                    if(name.tag === 'default')
                    {
                        // Try to remove from each tag
                        for(var tag in that.callbacks)
                        {
                            if(that.callbacks[tag] instanceof Object && that.callbacks[tag][name.value] instanceof Array)
                            {
                                delete that.callbacks[tag][name.value];

                                // Remove tag if empty
                                if(Object.keys(that.callbacks[tag]).length === 0)
                                    delete that.callbacks[tag];
                            }
                        }
                    }

                    // Specified tag
                    else if(that.callbacks[name.tag] instanceof Object && that.callbacks[name.tag][name.value] instanceof Array)
                    {
                        delete that.callbacks[name.tag][name.value];

                        // Remove tag if empty
                        if(Object.keys(that.callbacks[name.tag]).length === 0)
                            delete that.callbacks[name.tag];
                    }
                }
            });

            return this;
        },

        /**
         * TRIGGER
         */
        trigger: function(name,args)
        {
            // Errors
            if(typeof name === 'undefined' || name === '')
            {
                console.warn('Wrong name');
                return false;
            }

            var that = this;

            // Default args
            if(!(args instanceof Array))
                args = [];

            name = that.resolve_name(name);

            // Clean (need some work)
            name.value  = name.value.replace(/[^a-zA-Z0-9 ,\/.]/g,'');
            name.value  = name.value.replace(/[,\/]+/g,' ');

            // Default tag
            if(name.tag === 'default')
            {
                // Try to find action in each tag
                for(var tag in that.callbacks)
                {
                    if(that.callbacks[tag] instanceof Object && that.callbacks[tag][name.value] instanceof Array)
                    {
                        that.callbacks[tag][name.value].forEach(function(action)
                        {
                            action.apply(that,args);
                        });
                    }
                }
            }

            // Specified tag
            else if(this.callbacks[name.tag] instanceof Object)
            {
                if(name.value === '')
                {
                    console.warn('Wrong name');
                    return this;
                }

                that.callbacks[name.tag][name.value].forEach(function(action)
                {
                    action.apply(that,args);
                });
            }

            return this;
        },

        /**
         * TRIGGA NIGGA WUT
         */
        trigga: function(name,args)
        {
            return this.trigger(name,args);
        },

        /**
         * CLEAN NAME
         */
        clean_name: function(name)
        {
            name = name.toLowerCase();
            name = name.replace('-','_');

            return name;
        },

        /**
         * RESOLVE NAME
         */
        resolve_name: function(name)
        {
            var new_name = {},
            parts    = name.split('.');

            new_name.original = name;
            new_name.value    = parts[0];
            new_name.tag      = 'default'; // Default tag

            // Specified tag
            if(parts.length > 1 && parts[1] !== '')
                new_name.tag = parts[1];

            return new_name;
        }
    });
})();
