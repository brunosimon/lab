(function(window,GAME)
{
    'use strict';

    GAME.Environment = Abstract.extend(
    {
        options :
        {
            day_duration : 24,
            running      : false
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.period                 = {};
            this.period.progress        = 0;
            this.period.day             = {};
            this.period.day.intensity   = 0;
            this.period.night           = {};
            this.period.night.intensity = 0;

            this.running       = this.options.running;
            this.force_running = false;
            this.day_offset    = 0;

            this.scene                  = this.options.scene;
            this.skybox                 = new GAME.Skybox({scene:this.scene});
            this.global_lights          = new GAME.Global_Lights({scene:this.scene});

            this.set_time(0.15);
        },

        /**
         * SET TIME
         * Beetween 0 and 1
         */
        set_time: function(time)
        {
            if(time < 0)
                time  = 0;
            else if(time > 1)
                time = 1;

            this.day_offset      = time - this.period.progress;
            this.force_running   = true;
        },

        /**
         * START
         */
        start: function()
        {
            this.skybox.start();
            this.global_lights.start();
        },

        /**
         * UPDATE
         */
        update: function(ticker)
        {
            if(!this.running && !this.force_running)
                return;

            if(this.force_running)
                this.force_running = false;

            this.period.progress = ((ticker.time.passed / this.options.day_duration) + this.day_offset) % 1;

            // Night
            if(this.period.progress < 0.10)
            {
                this.period.day.intensity   = 0;
                this.period.night.intensity = 1;
            }
            // Night to day
            else if(this.period.progress < 0.20)
            {
                this.period.day.intensity   = (this.period.progress - 0.10) * 10;
                this.period.night.intensity = (this.period.progress - 0.10) * 10 * -1 + 1;
            }
            // Day
            else if(this.period.progress < 0.60)
            {
                this.period.day.intensity   = 1;
                this.period.night.intensity = 0;
            }
            // Day to night
            else if(this.period.progress < 0.70)
            {
                this.period.day.intensity   = (this.period.progress - 0.60) * 10 * -1 + 1;
                this.period.night.intensity = (this.period.progress - 0.60) * 10;
            }
            // Night
            else
            {
                this.period.day.intensity   = 0;
                this.period.night.intensity = 1;
            }

            this.skybox.update(this.period);
            this.global_lights.update(this.period);
        }
    });
})(window,GAME);