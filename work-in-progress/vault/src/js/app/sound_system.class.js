(function(window,APP)
{
    "use strict";

    APP.Sound_System = Abstract.extend(
    {
        options :
        {
            fade_in_duration  : 8,
            fade_out_duration : 8,
            master_volume     : 1,
            path              : 'src/sounds/',
            debug             : false,
            list              :
            {
                outside :
                {
                    type              : 'zone',
                    zones             : [1],
                    volume_max        : 1,
                    file              : 'ambience/00-outside.mp3',
                    fade_in_duration  : 3,
                    fade_out_duration : 3,
                    loop              : true
                },
                neon :
                {
                    type              : 'zone',
                    zones             : [2],
                    volume_max        : 1,
                    file              : 'ambience/01-neon.mp3',
                    fade_in_duration  : 3,
                    fade_out_duration : 5,
                    loop              : true
                },
                tunnel :
                {
                    type       : 'zone',
                    zones      : [3],
                    volume_max : 1,
                    file       : 'ambience/02-tunnel.mp3',
                    loop       : true
                },
                end :
                {
                    type       : 'zone',
                    zones      : [4,5,6,7,8],
                    volume_max : 1,
                    file       : 'ambience/03-end.mp3',
                    loop       : true
                },
                bip_of_the_soul :
                {
                    type       : 'point',
                    file       : 'bip-of-the-soul.mp3',
                    volume_max : 0.8,
                    loop       : false,
                    point      :
                    {
                        x          : 197,
                        z          : -38,
                        min_radius : 2,
                        max_radius : 35
                    }
                }
            }
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.ready          = false;
            this.playing        = [];
            this.list           = {};

            this.infos          = {};
            this.infos.to_load  = 0;
            this.infos.loaded   = 0;
            this.infos.progress = 0;

            this.create_list();
        },

        /**
         * START
         */
        start: function()
        {
            this.load_sounds();
        },

        /**
         * CREATE LIST
         */
        create_list: function()
        {
            var that = this;

            _.each(this.options.list,function(options,name)
            {
                // Create object
                that.list[name] = {
                    audio             : null,
                    status            : 'paused',
                    volume_max        : options.volume_max,
                    fade_in_duration  : options.fade_in_duration,
                    fade_out_duration : options.fade_out_duration,
                    loop              : options.loop,
                    type              : options.type,
                    zones             : options.zones,
                    point             : options.point,
                    played            : 0
                };
            });
        },

        /**
         * LOAD SOUNDS
         */
        load_sounds: function()
        {
            var that = this;

            _.each(this.options.list,function(options,name)
            {
                var src   = that.options.path + options.file,
                    audio = new Audio();

                // Update infos
                that.infos.to_load++;

                audio.volume   = 0;
                audio.src      = src;
                audio.loop     = options.loop;
                audio.controls = that.options.debug;
                audio.preload  = true;
                audio.type     = 'audio/mp3';

                audio.addEventListener('canplaythrough',function()
                {
                    // Update infos
                    that.infos.loaded++;
                    that.infos.progress = that.infos.loaded / that.infos.to_load;

                    // Test if ready
                    that.test_ready();

                },false);

                that.list[name].audio = audio;
                document.body.appendChild(audio);
            });
        },

        /**
         * TEST READY
         */
        test_ready: function()
        {
            if(this.infos.progress === 1)
                this.infos.ready = true;

            this.trigger('loading_update',[this.infos]);
        },

        /**
         * UPDATE ZONE
         */
        update_zone: function(zone)
        {
            var sounds     = [],
                sounds_len = 0,
                others     = [],
                i          = 0;

            _.each(this.list,function(sound,name)
            {
                if(sound.type === 'zone')
                {
                    if(sound.zones.indexOf(zone) !== -1)
                    {
                        sounds.push(sound);
                        sounds_len++;
                    }
                    else
                    {
                        others.push(sound);
                    }
                }
            });

            // To play
            if(sounds_len)
            {
                for(i = 0; i < sounds_len; i++)
                    this.fade_to(sounds[i],sounds[i].volume_max / sounds_len );
            }

            // To stop
            for(i = 0; i < others.length; i++)
                this.fade_to(others[i],0);
        },

        /**
         * UPDATE POSITION
         */
        update_position: function(position)
        {
            var sounds     = [],
                sounds_len = 0,
                i          = 0,
                distance   = 0,
                volume     = 0;

            _.each(this.list,function(sound,name)
            {
                if(sound.type === 'point')
                {
                    distance = Math.sqrt(Math.abs(Math.pow(position.x - sound.point.x,2) + Math.pow(position.z - sound.point.z,2)));
                    
                    if(distance < sound.point.max_radius)
                    {
                        if(sound.audio.paused && (sound.played === 0 || sound.loop === true))
                        {
                            sound.audio.play();
                            sound.played++;
                        }

                        volume = 1 - (distance - sound.point.min_radius) / (sound.point.max_radius);
                        volume = volume < 0 ? 0 :
                                 volume > 1 ? 1 : volume;

                        volume *= sound.volume_max;

                        sound.audio.volume = volume;
                    }
                    else
                    {
                        if(!sound.audio.paused)
                        {
                            // sound.audio.pause();
                            sound.audio.volume = 0;
                        }
                    }
                }
            });

        },

        /**
         * FADE TO
         */
        fade_to: function(sound,volume,duration)
        {
            // Param duration
            if(typeof duration === 'undefined')
            {
                if(volume > 0)
                    duration = typeof sound.fade_in_duration !== 'undefined' ? sound.fade_in_duration : this.options.fade_in_duration;
                else
                    duration = typeof sound.fade_in_duration !== 'undefined' ? sound.fade_in_duration : this.options.fade_out_duration;
            }

            // Param volume
            if(typeof volume === 'undefined')
                volume = 1;

            volume *= this.options.master_volume;

            // Same volume
            if(sound.audio.volume === volume)
                return;

            // Status
            sound.status = 'fading';

            // Play
            if(sound.audio.paused && volume > 0 && (sound.played === 0 || sound.loop))
            {
                sound.audio.play();
                sound.played++;
            }

            // Tween
            TweenLite.to(sound.audio,duration,{volume:volume,onComplete:function()
            {
                // Paused
                if(sound.audio.volume === 0)
                {
                    sound.audio.pause();
                    sound.status = 'paused';
                }

                // Played
                else
                    sound.status = 'playing';
            }});
        }
    });
}(window,APP));