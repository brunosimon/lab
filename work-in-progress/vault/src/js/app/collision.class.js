(function(window,APP)
{
    'use strict';

    APP.Collision = Abstract.extend(
    {
        options:
        {
            debug  : false,
            start_position :
            {
                x : -3.5,
                y : 0.4
            },
            player :
            {
                speed :
                {
                    default : 4,
                    running : 12
                }
            },
            ratio   : 1,
            offsets :
            {
                x : 180,
                y : -55
            },
            boxes :
            [
                // Snow limits
                {
                    x        : -5,
                    y        : -16.8,
                    width    : 100,
                    height   : 0.1,
                    rotation : - Math.PI * 0.1
                },
                {
                    x        : -5,
                    y        : 17.8,
                    width    : 100,
                    height   : 0.1,
                    rotation : Math.PI * 0.1
                },
                {
                    x        : 45,
                    y        : 15,
                    width    : 0.1,
                    height   : 50,
                    rotation : 0
                },
                {
                    x        : 45,
                    y        : -65,
                    width    : 0.1,
                    height   : 50,
                    rotation : 0
                },
                {
                    x        : -55,
                    y        : -65,
                    width    : 0.1,
                    height   : 140,
                    rotation : 0
                },
                {
                    x        : -55,
                    y        : -50,
                    width    : 140,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : -55,
                    y        : 50,
                    width    : 140,
                    height   : 0.1,
                    rotation : 0
                },

                // Entrance sides
                {
                    x        : -10.5,
                    y        : -1.3,
                    width    : 29.3,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : -10.5,
                    y        : 2.2,
                    width    : 29.3,
                    height   : 0.1,
                    rotation : 0
                },

                // Entrance doords
                {
                    x        : -7.8,
                    y        : -1,
                    width    : 1.2,
                    height   : 0.1,
                    rotation : -Math.PI * 0.1
                },
                {
                    x        : -6.8,
                    y        : 1.4,
                    width    : 1.3,
                    height   : 0.1,
                    rotation : -Math.PI * 0.5
                },

                // Stairs
                {
                    x        : 3,
                    y        : 1.6,
                    width    : 1.2,
                    height   : 0.1,
                    rotation : -Math.PI * 0.5
                },
                {
                    x        : 3.6,
                    y        : 1,
                    width    : 5,
                    height   : 0.1,
                    rotation : 0
                },

                // Tube long sides
                {
                    x        : 18.67,
                    y        : -2.6,
                    width    : 44.6,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 18.67,
                    y        : 3.5,
                    width    : 44.6,
                    height   : 0.1,
                    rotation : 0
                },

                // Tube little sides (begin)
                {
                    x        : 18.67,
                    y        : -2.6,
                    width    : 0.1,
                    height   : 1.2,
                    rotation : 0
                },
                {
                    x        : 18.67,
                    y        : 2.3,
                    width    : 0.1,
                    height   : 1.2,
                    rotation : 0
                },

                // Tube little sides (end)
                {
                    x        : 63.2,
                    y        : -3.8,
                    width    : 0.1,
                    height   : 1.2,
                    rotation : 0
                },
                {
                    x        : 63.2,
                    y        : 3.5,
                    width    : 0.1,
                    height   : 1.2,
                    rotation : 0
                },

                // Cave
                {
                    x        : 63.2,
                    y        : -3.8,
                    width    : 96.7,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 159.8,
                    y        : -46,
                    width    : 0.1,
                    height   : 42,
                    rotation : 0
                },
                {
                    x        : 159.8,
                    y        : -46,
                    width    : 6.6,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 166.4,
                    y        : -46,
                    width    : 0.1,
                    height   : 3.2,
                    rotation : 0
                },
                {
                    x        : 166.4,
                    y        : -36.4,
                    width    : 0.1,
                    height   : 19.5,
                    rotation : 0
                },
                {
                    x        : 166.4,
                    y        : -10,
                    width    : 0.1,
                    height   : 22.2,
                    rotation : 0
                },
                {
                    x        : 63.2,
                    y        : 4.7,
                    width    : 45.7,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 109,
                    y        : 4.7,
                    width    : 0.1,
                    height   : 1.2,
                    rotation : 0
                },
                {
                    x        : 123,
                    y        : 5.2,
                    width    : 36.8,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 160,
                    y        : 5.2,
                    width    : 0.1,
                    height   : 15,
                    rotation : 0
                },
                {
                    x        : 160,
                    y        : 20,
                    width    : 7,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 167,
                    y        : 19,
                    width    : 0.1,
                    height   : 1,
                    rotation : 0
                },

                // Cave room 1
                {
                    x        : 167,
                    y        : 19,
                    width    : 6.5,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : 19,
                    width    : 0.1,
                    height   : 5.8,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : 24.8,
                    width    : 47,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 220.5,
                    y        : 5.5,
                    width    : 0.1,
                    height   : 19.5,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : 5.5,
                    width    : 47,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : 5.5,
                    width    : 0.1,
                    height   : 6.6,
                    rotation : 0
                },
                {
                    x        : 166.5,
                    y        : 12.1,
                    width    : 7,
                    height   : 0.1,
                    rotation : 0
                },

                // Cave room 2
                {
                    x        : 166.5,
                    y        : -10,
                    width    : 7,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : -10,
                    width    : 0.1,
                    height   : 5.8,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : -5,
                    width    : 47,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 220.5,
                    y        : -23.5,
                    width    : 0.1,
                    height   : 19.5,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : -23,
                    width    : 47,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : -23.5,
                    width    : 0.1,
                    height   : 6.6,
                    rotation : 0
                },
                {
                    x        : 166.5,
                    y        : -16.9,
                    width    : 7,
                    height   : 0.1,
                    rotation : 0
                },

                // Cave room 3
                {
                    x        : 166.5,
                    y        : -36.5,
                    width    : 7,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : -36.5,
                    width    : 0.1,
                    height   : 5.8,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : -31,
                    width    : 47,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 220.5,
                    y        : -49.5,
                    width    : 0.1,
                    height   : 19.5,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : -49,
                    width    : 47,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 173.5,
                    y        : -49.5,
                    width    : 0.1,
                    height   : 6.6,
                    rotation : 0
                },
                {
                    x        : 166.5,
                    y        : -42.9,
                    width    : 7,
                    height   : 0.1,
                    rotation : 0
                },

                // Desk
                {
                    x        : 106.5,
                    y        : 6,
                    width    : 7.8,
                    height   : 0.7,
                    rotation : 0
                },
                {
                    x        : 116,
                    y        : 6,
                    width    : 7.4,
                    height   : 0.7,
                    rotation : 0
                },
                {
                    x        : 106.7,
                    y        : 6,
                    width    : 0.1,
                    height   : 8,
                    rotation : 0
                },
                {
                    x        : 106.5,
                    y        : 13.7,
                    width    : 14,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 120.4,
                    y        : 6,
                    width    : 0.1,
                    height   : 8,
                    rotation : 0
                },
                {
                    x        : 114.2,
                    y        : 6,
                    width    : 0.1,
                    height   : 1.1,
                    rotation : 0
                },
                {
                    x        : 114.2,
                    y        : 8.4,
                    width    : 0.1,
                    height   : 6,
                    rotation : 0
                },
                {
                    x        : 116,
                    y        : 6,
                    width    : 0.1,
                    height   : 1.1,
                    rotation : 0
                },
                {
                    x        : 116,
                    y        : 8.4,
                    width    : 0.1,
                    height   : 6,
                    rotation : 0
                },
                {
                    x        : 114.2,
                    y        : 11.2,
                    width    : 1.8,
                    height   : 0.1,
                    rotation : 0
                },
                {
                    x        : 115.6,
                    y        : 5.3,
                    width    : 1.4,
                    height   : 0.1,
                    rotation : -Math.PI * 0.35
                },

                // SAS
                {
                    x        : 122.9,
                    y        : 2,
                    width    : 0.8,
                    height   : 5,
                    rotation : 0
                },
                {
                    x        : 122.9,
                    y        : -4,
                    width    : 0.8,
                    height   : 3,
                    rotation : 0
                },

                // SAS doors
                {
                    x        : 121.8,
                    y        : -0.9,
                    width    : 1.2,
                    height   : 0.1,
                    rotation : -Math.PI * 0.1
                },
                {
                    x        : 121.8,
                    y        : 1.9,
                    width    : 1.3,
                    height   : 0.1,
                    rotation : Math.PI * 0.02
                },

                // Speaker
                {
                    x        : 197.5,
                    y        : -41.6,
                    width    : 2,
                    height   : 3,
                    rotation : -Math.PI * 0.1
                }
            ]
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.world    = new B2World(new B2Vec2(0,0),true);
            this.speed    = this.options.player.speed.default;
            // this.player_x = 

            if(this.options.debug)
                this.init_debug();

            this.init_player();
            this.init_boxes();
        },

        /**
         * INIT PLAYER
         */
        init_player: function()
        {
            this.player = this.get_circle({
                radius : 0.5,
                x      : this.options.start_position.x,
                y      : this.options.start_position.y,
                sleep  : false
            });
        },

        /**
         * INIT BOXES
         */
        init_boxes: function()
        {
            var that = this;

            _.each(this.options.boxes,function(options)
            {
                options.width /= 2;
                options.height /= 2;

                options.x += options.width;
                options.y += options.height;


                that.get_square({
                    width     : options.width,
                    height    : options.height,
                    x         : options.x,
                    y         : options.y,
                    rotation  : options.rotation,
                    type      : 'square',
                    body_type : 'static'
                });
            });
        },

        /**
         * INIT DEBUG
         */
        init_debug: function()
        {
            var debug_draw = new B2DebugDraw(),
                canvas     = document.createElement('canvas'); //this.options.canvas;

            canvas.id     = 'collision-debug';
            canvas.width  = 600;
            canvas.height = 600;
            document.body.appendChild(canvas);

            canvas.setAttribute('style','position:absolute;top:0;left:0;border:solid 1px #BBB;');
            debug_draw.SetSprite(canvas.getContext("2d"));
            debug_draw.SetDrawScale(10.0);
            debug_draw.SetFillAlpha(0.3);
            debug_draw.SetLineThickness(0.0);
            debug_draw.SetFlags(B2DebugDraw.e_shapeBit/* | B2DebugDraw.e_aabbBit*/);
            this.world.SetDebugDraw(debug_draw);
        },

        /**
         * CREATE CIRCLE
         */
        get_circle: function(params)
        {
            params = _.defaults(
                _.isObject(params)?params:{},
                {
                    radius      : 1,
                    x           : 5,
                    y           : 5,
                    density     : 1,
                    friction    : 0.1,
                    restitution : 0,
                    type        : 'circle'
                }
            );

            var fixture = this.get_fixture(params),
                body    = this.get_body(params),
                circle  = this.world.CreateBody(body);

            circle.CreateFixture(fixture);

            return circle;
        },

        /**
         * GET SQUARE
         */
        get_square: function(params)
        {
            params = _.defaults(
                _.isObject(params)?params:{},
                {
                    width       : 1,
                    height      : 0.2,
                    x           : 5,
                    y           : 5,
                    rotation    : 0,
                    density     : 0.1,
                    friction    : 0.1,
                    restitution : 0,
                    type        : 'square'
                }
            );

            var fixture = this.get_fixture(params),
                body    = this.get_body(params),
                square  = this.world.CreateBody(body);

            square.CreateFixture(fixture);

            return square;
        },

        /**
         * CREATE FIXTURE
         */
        get_fixture: function(params)
        {
            params = _.defaults(
                _.isObject(params)?params:{},
                {
                    radius      : 1,
                    width       : 1,
                    height      : 1,
                    density     : 0.1,
                    friction    : 0.1,
                    restitution : 0,
                    type        : 'square'
                }
            );

            var fixture         = new B2FixtureDef();
            fixture.density     = params.density;
            fixture.friction    = params.friction;
            fixture.restitution = params.restitution;

            switch(params.type)
            {
                case 'circle':
                    fixture.shape = new B2CircleShape(params.radius);
                    break;
                case 'square':
                    fixture.shape = new B2PolygonShape();
                    fixture.shape.SetAsBox(
                        params.width,
                        params.height
                   );
                    break;
            }
            return fixture;
        },

        /**
         * CREATE BODY
         */
        get_body: function(params)
        {
            params = _.defaults(
                _.isObject(params)?params:{},
                {
                    x         : 5,
                    y         : 5,
                    rotation  : 0,
                    body_type : 'dynamic',
                    damping   : 3,
                    sleep     : true,
                    awake     : true,
                    type      : 'square'
                }
            );

            var body            = new B2BodyDef();
            body.position.x     = params.x - this.options.offsets.x;
            body.position.y     = params.y - this.options.offsets.y;
            body.angle          = params.rotation;
            body.linearDamping  = params.damping;
            body.angularDamping = params.damping;
            body.allowSleep     = params.sleep;
            body.awake          = params.awake;

            switch(params.body_type)
            {
                case 'static':
                    body.type = B2Body.b2_staticBody;
                    break;
                case 'kinematic':
                    body.type = B2Body.b2_kinematicBody;
                    break;
                // case 'dynamic':
                default:
                    body.type = B2Body.b2_dynamicBody;
                    break;

            }

            return body;
        },


        /**
         * GET PLAYER POSITION
         */
        get_player_position: function()
        {
            return {
                x: (this.player.GetPosition().x + this.options.offsets.x) * this.options.ratio,
                z: (this.player.GetPosition().y + this.options.offsets.y) * this.options.ratio
            };
        },
    

        /**
         * UPDATE
         */
        update: function(ticker,controller,rotation_y)
        {
            this.player.SetAngle(-rotation_y - Math.PI / 2);


            var cos     = Math.cos(rotation_y),
                sin     = Math.sin(rotation_y),
                speed_x = 0,
                speed_y = 0;

            if(controller.keyboard.is_key_name_active('up'))
            {
                speed_y -= cos;
                speed_x -= sin;
            }

            if(controller.keyboard.is_key_name_active('down'))
            {
                speed_y += cos;
                speed_x += sin;
            }

            if(controller.keyboard.is_key_name_active('right'))
            {
                speed_y -= sin;
                speed_x += cos;
            }

            if(controller.keyboard.is_key_name_active('left'))
            {
                speed_y += sin;
                speed_x -= cos;
            }

            if(controller.keyboard.is_key_name_active('shift'))
            {
                this.speed = this.options.player.speed.running;
            }
            else
            {
                this.speed = this.options.player.speed.default;
            }

            speed_y = speed_y * this.speed;
            speed_x = speed_x * this.speed;

            this.player.SetAwake(true);
            this.player.SetLinearVelocity(new B2Vec2(speed_x,speed_y));

            this.world.Step(
                ticker.time.difference,
                6,
                2
            );
            this.world.ClearForces();

            if(this.options.debug)
                this.world.DrawDebugData();
        }
    });
})(window,APP);