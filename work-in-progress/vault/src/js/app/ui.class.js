(function(window,APP)
{
    'use strict';

    APP.UI = Abstract.extend(
    {
        options :
        {
            transition_duration : 0.3,
            pointer_opacity     : 0.7
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.blocks         = {};
            this.blocks.main    = $('.ui');
            this.blocks.pointer = this.blocks.main.find('.pointer');

            this.popins                             = {};
            this.popins.instructions                = {};
            this.popins.instructions.popin_opened   = false;
            this.popins.instructions.blocks         = {};
            this.popins.instructions.blocks.popin   = this.blocks.main.find('.instructions-popin');
            this.popins.instructions.blocks.label   = this.blocks.main.find('.label');

            this.popins.loading                         = {};
            this.popins.loading.popin_opened            = false;
            this.popins.loading.blocks                  = {};
            this.popins.loading.blocks.popin            = this.blocks.main.find('.loading-popin');
            // this.popins.loading.blocks.geometries_count = this.popins.loading.blocks.popin.find('.geometries .count');
            // this.popins.loading.blocks.geometries_total = this.popins.loading.blocks.popin.find('.geometries .total');
            // this.popins.loading.blocks.geometries_bar   = this.popins.loading.blocks.popin.find('.geometries .bar .progress');
            // this.popins.loading.blocks.textures_count   = this.popins.loading.blocks.popin.find('.textures .count');
            // this.popins.loading.blocks.textures_total   = this.popins.loading.blocks.popin.find('.textures .total');
            // this.popins.loading.blocks.textures_bar     = this.popins.loading.blocks.popin.find('.textures .bar .progress');

            this.popins.quality              = {};
            this.popins.quality.popin_opened = false;
            this.popins.quality.blocks       = {};
            this.popins.quality.blocks.popin = this.blocks.main.find('.quality-popin');
            this.popins.quality.blocks.links = this.popins.quality.blocks.popin.find('a');
            
            this.popins.loading.blocks.percent = this.popins.loading.blocks.popin.find('.part .percent');
            this.popins.loading.blocks.bar     = this.popins.loading.blocks.popin.find('.part .bar .progress');

            this.init_events();
        },

        /**
         * INIT EVENTS
         */
        init_events: function()
        {
            var that = this;
        
            // Label click
            this.popins.instructions.blocks.label.on('click',function()
            {
                if(that.popins.instructions.popin_opened)
                    that.popin_close('instructions');
                else
                    that.popin_open('instructions');

                return false;
            });

            // Ok click
            this.popins.instructions.blocks.popin.find('.start').on('click',function()
            {
                that.popin_close('instructions');
            });

            // Quality click
            this.popins.quality.blocks.links.on('click',function()
            {
                var _this   = $(this),
                    quality = _this.hasClass('low') ? 'low' : 'high';

                that.popin_close('quality');
                that.trigger('quality_click',[quality]);

                return false;
            });
        },

        /**
         * GO_FULLSCREEN
         */
        go_fullscreen: function()
        {
            if(this.popins.instructions.popin_opened)
                TweenLite.to(this.popins.instructions.blocks.popin,this.options.transition_duration,{css:{opacity:0}});

            TweenLite.to(this.popins.instructions.blocks.label,this.options.transition_duration,{css:{opacity:0}});
        },

        /**
         * LEAVE FULLSCREEN
         */
        leave_fullscreen: function()
        {
            if(this.popin_opened)
                TweenLite.to(this.popins.instructions.blocks.popin,this.options.transition_duration,{css:{opacity:1}});

            TweenLite.to(this.popins.instructions.blocks.label,this.options.transition_duration,{css:{opacity:1}});
        },

        /**
         * GO_FULLSCREEN
         */
        go_pointer_locked: function()
        {
            this.blocks.pointer.css({opacity:this.options.pointer_opacity});
        },

        /**
         * LEAVE FULLSCREEN
         */
        leave_pointer_locked: function()
        {
            this.blocks.pointer.css({opacity:0});
        },

        /**
         * POPIN OPEN
         */
        popin_open: function(target)
        {
            this.popins[target].popin_opened = true;

            this.popins[target].blocks.popin.css({display:'block'});
            TweenLite.to(this.popins[target].blocks.popin,0.3,{css:{opacity:1}});
        },

        /**
         * POPIN CLOSE
         */
        popin_close: function(target)
        {
            var that = this;

            this.popins[target].popin_opened = false;
        
            TweenLite.to(this.popins[target].blocks.popin,0.3,{css:{opacity:0},onComplete:function()
            {
                that.popins[target].blocks.popin.css({display:'none'});
            }});
        },

        /**
         * UPDATE POPIN LOADING
         */
        update_popin_loading: function(infos)
        {
            // this.popins.loading.blocks.geometries_count.text(infos.geometries.loaded);
            // this.popins.loading.blocks.geometries_total.text(infos.geometries.to_load);
            // this.popins.loading.blocks.geometries_bar.css({width:Math.round(infos.geometries.progress * 100) + '%'});
            // this.popins.loading.blocks.textures_count.text(infos.textures.loaded);
            // this.popins.loading.blocks.textures_total.text(infos.textures.to_load);
            // this.popins.loading.blocks.textures_bar.css({width:Math.round(infos.textures.progress * 100) + '%'});

            var percent = Math.round((infos.geometries.progress + infos.textures.progress) / 2 * 100);
            this.popins.loading.blocks.percent.text(percent);
            this.popins.loading.blocks.bar.css({width:percent + '%'});
        },

        /**
         * START
         */
        start: function()
        {
            
        }
    });
})(window,APP);