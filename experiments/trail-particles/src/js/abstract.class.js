var Abstract = Class.extend(
{
    // ---------------------------------------------------------------------------
    // INIT
    // ---------------------------------------------------------------------------

    defaults: {},

    init: function(parent,options)
    {
        if(_.isUndefined(options))
            options = {};

        this.options = _.defaults(options,this.defaults);
        this.parent  = parent;
    },



    // ---------------------------------------------------------------------------
    // TYPE
    // ---------------------------------------------------------------------------

    type: function(o)
    {
        if (o === null)
            return 'null';

        if (o && (o.nodeType === 1 || o.nodeType === 9))
            return 'element';

        var s    = Object.prototype.toString.call(o),
            type = s.match(/\[object (.*?)\]/)[1].toLowerCase();

        if (type === 'number')
        {
            if (isNaN(o))
                return 'nan';
            if (!isFinite(o))
                return 'infinity';
        }

        return type;
    },



    // ---------------------------------------------------------------------------
    // CALLBACKS
    // ---------------------------------------------------------------------------

    init_callbacks: function()
    {
        if(_.isUndefined(this.callbacks_initialized))
        {
            this.callbacks_initialized = true;
            this.callbacks_names       = [];
            this.callbacks_actions     = [];
        }
    },

    on: function(name,action)
    {
        this.init_callbacks();

        var that  = this,
            names = name.split(' '),
            added = false;

        if(_.isUndefined(action))
            return false;

        _.each(
            names,
            function(name)
            {
                var index = _.indexOf(that.callbacks_names,name);
                name = that.clean_callback_name(name);

                if(index == -1)
                {
                    that.callbacks_names.push(name);
                    that.callbacks_actions.push([action]);
                }
                else
                {
                    that.callbacks_actions[index].push(action);
                }
                added = true;
            }
        );

        return added;
    },

    //NEED UPGRADE TO REMOVE SELECTIVE ACTION (use _.indexOf)
    off: function(name,action)
    {
        this.init_callbacks();

        // var i       = 0,
        //     len     = this.callbacks_names.length,
        //     removed = false;

        // for(;i<len;i++)
        // {
        //     if(this.callbacks_names[i] === name)
        //     {
        //         this.callbacks_names.splice(i,1);
        //         this.callbacks_actions.splice(i,1);
        //         removed = true;
        //         len = 0;
        //     }
        // }

        // return removed;
    },

    trigger: function(name,args)
    {
        this.init_callbacks();

        var index   = _.indexOf(this.callbacks_names,name),
            applied = false;

        if(_.isUndefined(args))
            args = [];

        if(index === -1)
            return applied;

        else
        {
            _.each(
                this.callbacks_actions[index],
                function(action)
                {
                    action.apply(this,args);
                }
            );
            applied = true;
        }

        return applied;
    },

    clean_callback_name: function(name)
    {
        name = name.toLowerCase();
        name = name.replace('-','_');
        return name;
    }
});