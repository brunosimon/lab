(function(window,APP)
{
    'use strict';

    APP.Player = Abstract.extend(
    {
        options:{
            zones    : [-44,-6,14,61,98,122,147,167],
            start    : 'default',
            starting :
            {
                default :
                {
                    position :
                    {
                        x : -24,
                        z : 16
                    },
                    rotation :
                    {
                        x : Math.PI * 0.09,
                        y : Math.PI * 0.25
                    }
                },
                entrance :
                {
                    position :
                    {
                        x : -7.5,
                        z : 0
                    },
                    rotation :
                    {
                        x : 0,
                        y : Math.PI * 0.5
                    }
                },
                speaker :
                {
                    position :
                    {
                        x : 192,
                        z : -40
                    },
                    rotation :
                    {
                        x : 0,
                        y : Math.PI * 0.5
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

            this.started  = false;
            this.zone     = null;
            this.speed    = 5;
            this.starting = this.options.starting[this.options.start];

            // Floor
            this.floor        = {};
            this.floor.mesh   = null;
            this.floor.caster = new THREE.Raycaster();
            this.floor.ray    = new THREE.Vector3(0,-1,0);

            // Position
            this.position    = {};
            this.position.x  = -14;
            this.position.y  = 0;
            this.position.z  = 0;

            // Rotation
            this.rotation   = {};
            this.rotation.x = 0;
            this.rotation.y = Math.PI * 0.35;

            // Size
            this.size             = {};
            this.size.height      = 2;
            this.size.eyes_height = 1.90;
            this.size.radius      = 0.4;

            // Controller
            this.controller = this.options.controller;
            this.collision  = new APP.Collision({
                canvas:this.options.collision_canvas,
                start_position :
                {
                    x : this.starting.position.x,
                    y : this.starting.position.z  // Different projection
                }
            });
        },

        /**
         * START
         */
        start: function()
        {
            this.started = true;
        },

        /**
         * UPDATE
         */
        update: function(ticker)
        {
            if(!this.started)
                return false;
            
            this.collision.update(ticker,this.controller,this.rotation.y);
            this.update_rotation(ticker.time.difference);
            this.update_position(ticker.time.difference);
        },

        /**
         * UPDATE ROTATION
         */
        update_rotation: function(time)
        {
            this.rotation.x = - this.controller.mouse.position.y * 4 + this.starting.rotation.x;
            this.rotation.y = - this.controller.mouse.position.x * 4 - this.starting.rotation.y;

            // this.rotation limits
            if(this.rotation.x < - Math.PI / 2)
                this.rotation.x = - Math.PI / 2;
            if(this.rotation.x > Math.PI / 2)
                this.rotation.x = Math.PI / 2;
        },

        /**
         * UPDATE POSITION
         */
        update_position: function()
        {
            // X & Z
            var position    = this.collision.get_player_position();
            this.position.x = position.x;
            this.position.z = position.z;

            // Y
            var collisions   = null,
                ray_position = {
                    x : this.position.x,
                    y : this.position.y + this.size.eyes_height,
                    z : this.position.z
                };

            // Zones
            var zone = 1;
            for(var i = 0, len = this.options.zones.length; i <= len; i++)
            {
                if(this.options.zones[i] < this.position.x)
                    zone = i + 1;
            }
            if(zone !== this.zone)
            {
                this.zone = zone;
                this.trigger('zone_change',[zone]);
            }

            this.floor.caster.set(ray_position,this.floor.ray);
            
            collisions = this.floor.caster.intersectObjects([this.floor.mesh]);
            
            if(collisions.length)
                this.position.y = collisions[0].point.y;
        }
    });
})(window,APP);