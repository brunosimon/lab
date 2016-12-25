var CollisionEngine = Abstract.extend({

    // ---------------------------------------------------------------------------
    // INIT
    // ---------------------------------------------------------------------------
     
    init: function(parent)
    {
        this.parent = parent;
        this.init_params();
        this.init_Box2D();
    },
    


    // ---------------------------------------------------------------------------
    // PARAMS
    // ---------------------------------------------------------------------------

    init_params: function()
    {
        this.game       = this.parent.parent;
        this.display    = this.game.display;
        this.world      = this.game.world;
        this.controller = this.game.controller;
        this.debug      = true;

        this.ratio      = 1200;
    },
    

    convert_params: function(params)
    {
        var new_params = {};

        if(!_.isUndefined(params.x))
            new_params.x = params.x / this.ratio;

        if(!_.isUndefined(params.y))
            new_params.y = params.z / this.ratio;

        if(!_.isUndefined(params.width))
            new_params.width = params.width / this.ratio / 2;

        if(!_.isUndefined(params.height))
            new_params.height = params.depth / this.ratio / 2;

        if(!_.isUndefined(params.radius))
            new_params.radius = params.radius / this.ratio;

        if(!_.isUndefined(params.is_static))
            new_params.is_static = params.is_static;

        if(!_.isUndefined(params.density))
            new_params.density = params.density;

        if(!_.isUndefined(params.friction))
            new_params.friction = params.friction;

        if(!_.isUndefined(params.restitution))
            new_params.restitution = params.restitution;

        return new_params;
    },
    


    // ---------------------------------------------------------------------------
    // Box2D INIT
    // ---------------------------------------------------------------------------

    init_Box2D: function()
    {
        //World
        this.box2d = this.create_world();

        //Player
        this.player = this.create_player();

        //Debug
        if(this.debug)
            this.init_debug();
    },

    init_debug: function()
    {
        var debug_draw = new b2DebugDraw(),
            canvas    = document.getElementById('collision-debug');

            canvas.setAttribute('style','position:absolute;top:0;left:0;border:solid 1px #BBB;');
            debug_draw.SetSprite(canvas.getContext("2d"));
            debug_draw.SetDrawScale(30.0);
            debug_draw.SetFillAlpha(0.3);
            debug_draw.SetLineThickness(0.0);
            debug_draw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this.box2d.SetDebugDraw(debug_draw);

            this.game.on('tic',this.update_Box2D.bind(this));
    },
    


    // ---------------------------------------------------------------------------
    // Box2D CREATIONS
    // ---------------------------------------------------------------------------

    create_world: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                gravity_x: 0,
                gravity_y: 0
            }
        );

        var world = new b2World(
           new b2Vec2(params.gravity_x,params.gravity_y),
           true
        );

        return world;
    },

    create_player: function(params)
    {
        var player = this.player = this.create_circle({
            radius: 0.16,
            x:      0,
            y:      0,
            sleep:  false
        });

        return player;
    },

    create_square: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                width:      1,
                height:     1,
                x:          5,
                y:          5,
                density:    0.1,
                friction:   0.1,
                restitution:0,
                type:       'square'
            }
        );

        var fixture = this.create_fixture(params),
            body    = this.create_body(params),
            square  = this.box2d.CreateBody(body);

        square.CreateFixture(fixture);
        return square;
    },

    create_circle: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                radius:     1,
                x:          5,
                y:          5,
                density:    1,
                friction:   0.1,
                restitution:0,
                type:       'circle'
            }
        );

        var fixture = this.create_fixture(params),
            body    = this.create_body(params),
            circle  = this.box2d.CreateBody(body);

        circle.CreateFixture(fixture);
        return circle;
    },

    create_fixture: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                radius:     1,
                width:      1,
                height:     1,
                density:    0.1,
                friction:   0.1,
                restitution:0,
                type:       'square'
            }
        );

        var fixture         = new b2FixtureDef();
        fixture.density     = params.density;
        fixture.friction    = params.friction;
        fixture.restitution = params.restitution;

        switch(params.type)
        {
            case 'circle':
                fixture.shape = new b2CircleShape(params.radius);
                break;
            case 'square':
                fixture.shape = new b2PolygonShape();
                fixture.shape.SetAsBox(
                    params.width,
                    params.height
               );
                break;
        }
        return fixture;
    },

    create_body: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                x:         5,
                y:         5,
                is_static: false,
                damping:   3,
                sleep:     true,
                awake:     true,
                type:      'square'
            }
        );

        var body            = new b2BodyDef();
        body.type           = params.is_static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
        body.position.x     = params.x;
        body.position.y     = params.y;
        body.linearDamping  = params.damping;
        body.angularDamping = params.damping;
        body.allowSleep     = params.sleep;
        body.awake          = params.awake;

        return body;
    },
    


    // ---------------------------------------------------------------------------
    // GET
    // ---------------------------------------------------------------------------

    get_player_position: function()
    {
        return {
            x: this.player.GetPosition().x * this.ratio,
            y: this.player.GetPosition().y * this.ratio
        };
    },
    


    // ---------------------------------------------------------------------------
    // Box2D UPDATE
    // ---------------------------------------------------------------------------

    update_Box2D: function()
    {
        this.update_player_position();
        this.update_player_rotation();
        this.update_box2d_world();

        this.trigger('update');
    },

    update_player_position: function()
    {
        var cos = Math.cos(this.parent.player.rotation.y),
            sin = Math.sin(this.parent.player.rotation.y),
            speed_x = 0,
            speed_y = 0;

        if(this.controller.keyboard.up)
        {
            speed_y -= cos;
            speed_x -= sin;
        }

        if(this.controller.keyboard.down)
        {
            speed_y += cos;
            speed_x += sin;
        }

        if(this.controller.keyboard.right)
        {
            speed_y -= sin;
            speed_x += cos;
        }

        if(this.controller.keyboard.left)
        {
            speed_y += sin;
            speed_x -= cos;
        }
        this.player.SetLinearVelocity(new b2Vec2(speed_x,speed_y));
    },

    update_player_rotation: function()
    {
        this.player.SetAngle(-this.parent.player.rotation.y - Math.PI / 2);
    },

    update_box2d_world: function()
    {
        this.box2d.Step(
            this.game.delta/1000, //frame-rate
            10,                   //velocity iterations
            10                    //position iterations
        );

        this.box2d.ClearForces();

        if(this.debug)
            this.box2d.DrawDebugData();
    }
});