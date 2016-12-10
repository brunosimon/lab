var APP = {};

(function(window,APP)
{
    'use strict';

    APP.App = Abstract.extend(
    {
        options:{},

        /**
         * INIT
         */
        init: function(options)
        {
            var that = this;

            this._super(options);

            // Origin
            if(['default','lo-moth'].indexOf(this.options.origin) === -1)
                this.options.origin = 'default';

            this.controller   = new APP.Controller();
            this.sound_system = new APP.Sound_System();
            this.world        = new APP.World({canvas:this.options.canvas,collision_canvas:this.options.collision_canvas,controller:this.controller,sound_system:this.sound_system,origin:this.options.origin});
            this.ticker       = new APP.Ticker();
            this.screen       = new APP.Screen();
            this.ui           = new APP.UI();

            //Fullscreen
            this.fullscreen        = {};
            this.fullscreen.active = false;

            // Quality
            this.ui.on('quality_click',function(quality)
            {
                that.start(quality);
            });

            // Controller
            this.controller.keyboard.on('keyup',function(e)
            {
                if(e.key_name === 'fullscreen')
                    that.screen.toggle_fullscreen();
            });

            // Loading update
            this.world.on('loading_update',function(infos)
            {
                that.ui.update_popin_loading(infos);
            });

            // On ticker tic
            this.ticker.on('tic',function()
            {
                that.update();
            });

            // On world ready
            this.world.on('ready',function()
            {
                that.ticker.start();
                that.ui.popin_close('loading');
            });

            // On screen resize
            this.screen.on('resize',function()
            {
                that.resize();
            });

            // On screen status change
            this.screen.on('status_change',function()
            {
                that.world.active = that.screen.status === 'visible';
            });

            // Pointer locked
            this.screen.on('pointer_locked_change',function(active)
            {
                that.controller.mouse.pointer_locked = active;
                if(active)
                    that.ui.go_pointer_locked();
                else
                    that.ui.leave_pointer_locked();
            });

            // Pointer locked
            this.screen.on('fullscreen_change',function(active)
            {
                if(active)
                    that.ui.go_fullscreen();
                else
                    that.ui.leave_fullscreen();
            });

            this.ui.start();
        },

        /**
         * START
         */
        start: function(quality)
        {
            this.ui.popin_open('loading');
            this.screen.start(quality);
            this.world.start(quality);
            this.sound_system.start();
            this.resize();
        },

        /**
         * UPDATE
         */
        update: function()
        {
            this.world.update(this.ticker);
        },

        /**
         * RESIZE
         */
        resize: function()
        {
            var width  = window.innerWidth,
                height = window.innerHeight;

            this.world.resize(width,height);
        }
    });
})(window,APP);
