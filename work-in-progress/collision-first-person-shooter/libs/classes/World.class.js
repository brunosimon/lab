var World = Abstract.extend({

    // ---------------------------------------------------------------------------
    // INIT
    // ---------------------------------------------------------------------------
     
    init: function(parent)
    {
        this.parent = parent;
        this.init_params();
        this.init_scene();
        this.init_collision_engine();
        this.init_components();
        this.init_player();

        this.parent.on('tic',this.update.bind(this));
    },
    


    // ---------------------------------------------------------------------------
    // PARAMS
    // ---------------------------------------------------------------------------

    init_params: function()
    {
        
    },
    


    // ---------------------------------------------------------------------------
    // SCENE
    // ---------------------------------------------------------------------------

    init_scene: function()
    {
        var that      = this,
            container = this.parent.display.container,
            width     = this.parent.display.width,
            height    = this.parent.display.height;

        //Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            clearAlpha: 1,
            clearColor: 0xFFFFFF
        });
        this.renderer.setSize(width,height);
        this.renderer.shadowMapEnabled = true;
        container.appendChild(this.renderer.domElement);

        //Scene
        this.scene = new THREE.Scene();

        //Camera
        this.camera            = new THREE.PerspectiveCamera(55,width/height,1,10000);
        this.camera.position.z = 400;
        this.camera.position.y = 400;
        this.camera.eulerOrder = 'ZYX';
        this.scene.add(this.camera);

        //Display resize
        this.parent.display.on('resize',function()
        {
            var width  = that.parent.display.width,
                height = that.parent.display.height;

            that.camera.aspect = width/height;
            that.camera.updateProjectionMatrix();

            that.renderer.setSize(width,height);
        });
    },



    // ---------------------------------------------------------------------------
    // COMPONENTS INIT
    // ---------------------------------------------------------------------------

    init_components: function()
    {
        this.components = [];

        //Buildings
        this.add_floor();
        this.add_buildings();
        this.add_components();
        this.add_lights();
    },

    add_floor: function()
    {
        var floor = this.create_plane({height:20000,width:20000,rotation_x:-Math.PI/2});
    },

    add_buildings: function()
    {
        this.create_cube({
            x:3000,
            y:2000,
            z:3000,
            height:4000,
            width:1000,
            depth:1000,
            is_static:true
        });
        this.create_cube({
            x:2350,
            y:600,
            z:3000,
            height:1200,
            width:300,
            depth:300,
            is_static:true
        });

        this.create_cube({
            x:5000,
            y:1500,
            z:1000,
            height:3000,
            width:800,
            depth:800,
            is_static:true
        });

        this.create_cube({
            x:5000,
            y:1500,
            z:2200,
            height:3000,
            width:800,
            depth:800,
            is_static:true
        });

        this.create_cube({
            x:0,
            y:300,
            z:3000,
            height:600,
            width:1100,
            depth:1100,
            is_static:true
        });

        this.create_cube({
            x:0,
            y:1100,
            z:3000,
            height:1600,
            width:1000,
            depth:1000,
            is_static:true
        });

        this.create_cube({
            x:0,
            y:2600,
            z:3000,
            height:1000,
            width:20,
            depth:20,
            is_static:true
        });
    },

    add_components: function()
    {
        for(var i = 0; i < 100; i++)
        {
            var x = Math.random() * 5000,
                z = Math.random() * 5000,
                height = Math.random() * 300 + 30,
                width = Math.random() * 200 + 100,
                y = height / 2,
                density = height * width / 4000;

            this.components.push(this.create_cube({x:x,y:y,z:z,height:height,width:width,depth:width,is_static:false,density:density}));
        }

        // var sphere   = this.create_sphere({x:500,y:300,z:500}),
    },

    add_lights: function()
    {
        var ambient_light       = this.create_ambient_light({color:0xa6b4b7}),
            directional_light_1 = this.create_directional_light({intensity:0.3}),
            directional_light_2 = this.create_directional_light({vector_x:0.3,vector_y:0.7,vector_z:1,intensity:0.3});
    },



    // ---------------------------------------------------------------------------
    // COMPONENTS CREATES
    // ---------------------------------------------------------------------------

    create_cube: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                type: 'cube'
            }
        );

        return {
            dimensional: this.create_object(params),
            collision:   this.engine.create_square(this.engine.convert_params(params))
        };
    },

    create_sphere: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                type: 'sphere'
            }
        );

        var object = this.create_object(params);
        this.scene.add(object);
        return object;
    },

    create_plane: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                type: 'plane'
            }
        );

        var object = this.create_object(params);
        this.scene.add(object);
        return object;
    },

    create_geo: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                width:  500,
                depth:  500,
                height: 500,
                radius: 200,
                type:   'cube'
            }
        );
        switch(params.type)
        {
            case 'plane':
                return new THREE.PlaneGeometry(params.width,params.height,20,20);
            case 'cube':
                return new THREE.CubeGeometry(params.width,params.height,params.depth);
            case 'sphere':
                return new THREE.SphereGeometry(params.radius,20,20);
        }
    },

    create_mtl: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                color:      0xAAAAAA,
                specular:   0x333333,
                shininess:  1
            }
        );

        return new THREE.MeshPhongMaterial({
            color:     params.color,
            specular:  params.specular,
            shininess: params.shininess
        });
    },

    create_object: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                width:      500,
                height:     500,
                radius:     200,
                x:          0,
                y:          0,
                z:          0,
                rotation_x: 0,
                rotation_y: 0,
                rotation_z: 0,
                density:    0.1,
                friction:   0.1,
                restitution:0.3,
                color:      0xAAAAAA,
                specular:   0x333333,
                shininess:  1,
                type:       'cube'
            }
        );

        var geo = this.create_geo(params),
            mtl = this.create_mtl(params),
            object = new THREE.Mesh(geo,mtl);

        object.position.x = params.x;
        object.position.y = params.y;
        object.position.z = params.z;

        object.rotation.x = params.rotation_x;
        object.rotation.y = params.rotation_y;
        object.rotation.z = params.rotation_z;

        this.scene.add(object);

        return object;
    },

    create_ambient_light: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                color: 0xBBBBBB
            }
        );
        
        var light = new THREE.AmbientLight(params.color);
        this.scene.add(light);
        return light;
    },

    create_directional_light: function(params)
    {
        params = _.defaults(
            _.isObject(params)?params:{},
            {
                color:     0xFFFFFF,
                vector_x:  -1,
                vector_y:  0.7,
                vector_z:  -2,
                intensity: 0.3
            }
        );

        var light = new THREE.DirectionalLight(params.color);
        light.position.set(params.vector_x,params.vector_y,params.vector_z);
        light.intensity = params.intensity;
        this.scene.add(light);

        return light;
    },



    // ---------------------------------------------------------------------------
    // COLLISION ENGINE
    // ---------------------------------------------------------------------------

    init_collision_engine: function()
    {
        this.engine = new CollisionEngine(this);
    },



    // ---------------------------------------------------------------------------
    // PLAYER
    // ---------------------------------------------------------------------------

    init_player: function()
    {
        this.player = new Player(this);
    },



    // ---------------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------------

    update: function()
    {
        this.update_camera();
        this.update_components();
        
        this.renderer.render(this.scene,this.camera);
    },

    update_camera: function()
    {
        this.camera.rotation.x = this.player.rotation.x;
        this.camera.rotation.y = this.player.rotation.y;

        this.camera.position.x = this.player.position.x;
        this.camera.position.y = this.player.position.y;
        this.camera.position.z = this.player.position.z;
    },

    update_components: function()
    {
        _.each(this.components,function(e)
        {
            var dimensional = e.dimensional,
                collision   = e.collision;

            dimensional.position.x = collision.GetPosition().x * this.engine.ratio;
            dimensional.position.z = collision.GetPosition().y * this.engine.ratio;
            dimensional.rotation.y = -collision.GetAngle();
        }.bind(this));
    }
});