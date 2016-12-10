(function(window,APP)
{
    'use strict';

    APP.Models = Abstract.extend(
    {
        options:
        {
            geometries :
            {
                ratio     : 0.25,
                path      : 'src/models/',
                prefix    : '',
                extension : '.js'
            },
            textures :
            {
                path    : 'src/textures/baked/',
                quality : 'high'
            },
            materials :
            {
                default : new THREE.MeshLambertMaterial({color:0xffffff,wireframe:false})
            },
            list :
            {
                floor :
                {
                    zones    : [1,2,3,4,5,6,7,8],
                    geometry : 'floor',
                    material : new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.0})
                },
                cave_floor_1 :
                {
                    zones    : [1,2,3,4,5,6,7,8],
                    geometry : 'cave_floor_1',
                    texture  : 'cave_floor_1.jpg'
                },
                cave_floor_2 :
                {
                    zones    : [5,6,7,8],
                    geometry : 'cave_floor_2',
                    texture  : 'cave_floor_2.jpg'
                },
                cave_floor_3 :
                {
                    zones    : [6,7,8],
                    geometry : 'cave_floor_3',
                    texture  : 'cave_floor_3.jpg'
                },
                cave_floor_4 :
                {
                    zones    : [6,7,8],
                    geometry : 'cave_floor_4',
                    texture  : 'cave_floor_4.jpg'
                },
                cave_stone_1 :
                {
                    zones    : [2,3,4,5,6,7,8],
                    geometry : 'cave_stone_1',
                    texture  : 'cave_stone_1.jpg'
                },
                cave_stone_2 :
                {
                    zones    : [3,4,5,6,7,8],
                    geometry : 'cave_stone_2',
                    texture  : 'cave_stone_2.jpg'
                },
                cave_stone_3 :
                {
                    zones    : [3,4,5,6,7,8],
                    geometry : 'cave_stone_3',
                    texture  : 'cave_stone_3.jpg'
                },
                desk_door_right :
                {
                    zones    : [3,4,5,6],
                    geometry : 'desk_door_right',
                    texture  : 'desk_door_right.jpg'
                },
                desk_lights :
                {
                    zones    : [5],
                    geometry : 'desk_lights',
                    texture  : 'desk_lights.jpg'
                },
                desks_walls :
                {
                    zones    : [3,4,5,6],
                    geometry : 'desks_walls',
                    texture  : 'desks_walls.jpg'
                },
                entrance_bridge_block :
                {
                    zones    : [1,2,3],
                    geometry : 'entrance_bridge_block',
                    texture  : 'entrance_bridge_block.jpg'
                },
                entrance_bridge_floor :
                {
                    zones    : [1,2,3],
                    geometry : 'entrance_bridge_floor',
                    texture  : 'entrance_bridge_floor.jpg'
                },
                entrance_decoration :
                {
                    zones    : [1,2],
                    geometry : 'entrance_decoration',
                    texture  : 'entrance_decoration.jpg'
                },
                entrance_door_left :
                {
                    zones    : [1,2,3,4],
                    geometry : 'entrance_door_left',
                    texture  : 'entrance_door_left.jpg'
                },
                entrance_door_right :
                {
                    zones    : [1,2,3,4],
                    geometry : 'entrance_door_right',
                    texture  : 'entrance_door_right.jpg'
                },
                entrance_guard_rail_left :
                {
                    zones    : [1,2,3],
                    geometry : 'entrance_guard_rail_left',
                    texture  : 'entrance_guard_rail_left.jpg'
                },
                entrance_guard_rail_right :
                {
                    zones    : [1,2,3],
                    geometry : 'entrance_guard_rail_right',
                    texture  : 'entrance_guard_rail_right.jpg'
                },
                entrance_main_block_floor :
                {
                    zones    : [1,2,3],
                    geometry : 'entrance_main_block_floor',
                    texture  : 'entrance_main_block_floor.jpg'
                },
                entrance_main_block :
                {
                    zones    : [1,2,3,4,5],
                    geometry : 'entrance_main_block',
                    texture  : 'entrance_main_block.jpg'
                },
                roof_structure_1 :
                {
                    zones    : [1,2,3],
                    geometry : 'roof_structure_1',
                    texture  : 'roof_structure_1.jpg'
                },
                roof_structure_2 :
                {
                    zones    : [2,3,4,5,6,7,8],
                    geometry : 'roof_structure_2',
                    texture  : 'roof_structure_2.jpg'
                },
                roof_structure_3 :
                {
                    zones    : [5,6,7,8],
                    geometry : 'roof_structure_3',
                    texture  : 'roof_structure_3.jpg'
                },
                roof_structure_4 :
                {
                    zones    : [5,6,7,8],
                    geometry : 'roof_structure_4',
                    texture  : 'roof_structure_4.jpg'
                },
                entrance_stairs :
                {
                    zones    : [1,2,3,4],
                    geometry : 'entrance_stairs',
                    texture  : 'entrance_stairs.jpg'
                },
                entrance_ventilation :
                {
                    zones    : [1,2],
                    geometry : 'entrance_ventilation',
                    texture  : 'entrance_ventilation.jpg'
                },
                logo :
                {
                    zones    : [1,2,3],
                    geometry : 'logo',
                    texture  : 'logo.jpg'
                },
                roof_lights_1 :
                {
                    zones    : [1,2,3],
                    geometry : 'roof_lights_1',
                    texture  : 'roof_lights_1.jpg',
                },
                roof_lights_2 :
                {
                    zones    : [2,3,4],
                    geometry : 'roof_lights_2',
                    texture  : 'roof_lights_2.jpg',
                },
                roof_lights_3 :
                {
                    zones    : [3,4,5,6],
                    geometry : 'roof_lights_3',
                    texture  : 'roof_lights_3.jpg',
                },
                roof_lights_4 :
                {
                    zones    : [4,5,6,7,8],
                    geometry : 'roof_lights_4',
                    texture  : 'roof_lights_4.jpg',
                },
                roof_lights_5 :
                {
                    zones    : [7,8],
                    geometry : 'roof_lights_5',
                    texture  : 'roof_lights_5.jpg',
                },
                sas_door_left :
                {
                    zones    : [3,4,5,6,7],
                    geometry : 'sas_door_left',
                    texture  : 'sas_door_left.jpg'
                },
                sas_door_right :
                {
                    zones    : [3,4,5,6,7],
                    geometry : 'sas_door_right',
                    texture  : 'sas_door_right.jpg'
                },
                sas_wall :
                {
                    zones    : [1,2,3,4,5,6,7],
                    geometry : 'sas_wall',
                    texture  : 'sas_wall.jpg'
                },
                snow :
                {
                    zones    : [1,2,3],
                    geometry : 'snow',
                    texture  : 'snow.jpg'
                },
                speaker :
                {
                    zones    : [7,8],
                    geometry : 'speaker',
                    texture  : 'speaker-updated.jpg',
                    side     : THREE.DoubleSide
                },
                tube_end_gap :
                {
                    zones    : [3,4,5,6,7],
                    geometry : 'tube_end_gap',
                    texture  : 'tube_end_gap.jpg'
                },
                tube_floor :
                {
                    zones    : [1,2,3,4,5,6,7],
                    geometry : 'tube_floor',
                    texture  : 'tube_floor.jpg'
                },
                tube :
                {
                    zones    : [1,2,3,4,5,6,7],
                    geometry : 'tube',
                    texture  : 'tube.jpg'
                }
            }
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.ready            = false;
            this.loader           = new THREE.JSONLoader();
            this.list             = {};
            this.listened_objects = {mouse_move:[],mouse_down:[]};

            this.infos                     = {};

            this.infos.geometries          = {};
            this.infos.geometries.to_load  = 0;
            this.infos.geometries.loaded   = 0;
            this.infos.geometries.progress = 0;
            this.infos.geometries.ready    = false;
            this.infos.geometries.started  = false;

            this.infos.textures           = {};
            this.infos.textures.to_load   = 0;
            this.infos.textures.loaded    = 0;
            this.infos.textures.progress  = 0;
            this.infos.textures.ready     = false;
            this.infos.geometries.started = false;

            this.create_list();
        },

        /**
         * START
         */
        start: function(quality)
        {
            var that = this;

            this.options.textures.quality = quality;

            this.load_geometries();
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
                    geometry  : null,
                    mesh      : null,
                    texture   : null,
                    material  : null,
                    visible   : false,
                    animated  : false,
                    zones     : options.zones
                };
            });
        },

        /**
         * LOAD GEOMETRIES
         */
        load_geometries: function()
        {
            var that = this;

            // Infos
            this.infos.geometries.started = true;

            _.each(this.options.list,function(options,name)
            {
                // Infos
                that.infos.geometries.to_load++;

                // Get path and reformated name
                var path = that.options.geometries.path + that.options.geometries.prefix + options.geometry + that.options.geometries.extension;

                that.loader.load(path,function(geometry)
                {
                    geometry.computeTangents();
                    // Update list
                    that.list[name].geometry = geometry;

                    // Infos
                    that.infos.geometries.loaded++;
                    that.infos.geometries.progress = that.infos.geometries.loaded / that.infos.geometries.to_load;

                    // Test if ready
                    that.test_ready();
                });
            });
        },

        /**
         * LOAD TEXTURES
         */
        load_textures: function()
        {
            var that            = this,
                loading_started = false;

            // Infos
            this.infos.textures.started = true;

            _.each(this.options.list,function(options,name)
            {
                if(typeof options.texture === 'undefined')
                    return;

                loading_started = true;

                // Update infos
                that.infos.textures.to_load++;

                // Get path and reformated name
                var path    = that.options.textures.path + that.options.textures.quality + '/' + options.texture ,
                    texture = null;

                texture = new THREE.ImageUtils.loadTexture(path,{},function()
                {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                    // Update list
                    that.list[name].texture = texture;

                    // Update infos
                    that.infos.textures.loaded++;
                    that.infos.textures.progress = that.infos.textures.loaded / that.infos.textures.to_load;

                    // Test if ready
                    that.test_ready();
                });
            });

            if(!loading_started)
            {
                this.infos.textures.progress = 1;
                that.test_ready();
            }
        },

        /**
         * CREATE MATERIALS
         */
        create_materials: function()
        {
            var that = this;

            _.each(this.options.list,function(options,name)
            {
                var object = that.list[name];

                // Has texture
                if(typeof object.texture !== 'undefined' && object.texture !== null)
                {
                    that.list[name].material = new THREE.MeshLambertMaterial({map:object.texture,side:typeof options.side !== 'undefined' ? options.side : THREE.FrontSide});
                }

                // Has material
                else if(typeof options.material !== 'undefined' && options.material !== null)
                {
                    that.list[name].material = options.material;
                }

                // No texture / no material
                else
                {
                    that.list[name].material = that.options.materials.default;
                }

            });
        },

        /**
         * CREATE MESHES
         */
        create_meshes: function()
        {
            var that = this;

            _.each(this.options.list,function(options,name)
            {
                var object = that.list[name];

                if(typeof options.animated !== 'undefined' && options.animated)
                {
                    object.animated = true;
                    object.mesh     = new THREE.MorphAnimMesh(object.geometry,object.material);
                }
                else
                {
                    object.mesh = new THREE.Mesh(object.geometry,object.material);
                }

                object.mesh.position.set(0,0,0);
                object.mesh.scale.set(that.options.geometries.ratio,that.options.geometries.ratio,that.options.geometries.ratio);
                object.name = name;
            });
        },


        /**
         * ADD LISTENER ON OBJECT
         */
        add_listener_on_object: function(listener,name,action)
        {
            var object = this.list[name];

            if(typeof object === 'undefined' || typeof action !== 'function')
                return false;

            if(typeof object.mesh.action === 'undefined')
                object.mesh.action = {};
            
            object.mesh.action[listener] = action;
            this.listened_objects[listener].push(object.mesh);
        },

        /**
         * TEST IF EVERYTHING READY
         */
        test_ready: function()
        {
            // Geometries ready
            if(this.infos.geometries.progress === 1 && !this.infos.geometries.ready)
            {
                this.infos.geometries.ready = true;
                this.load_textures();
            }

            // Textures ready
            if(this.infos.textures.progress === 1 && !this.infos.textures.ready)
            {
                this.infos.textures.ready = true;
                this.create_materials();
                this.create_meshes();
            }

            // All ready
            if(this.infos.geometries.ready && this.infos.textures.ready && !this.ready)
            {
                this.ready = true;
                this.trigger('ready');
            }

            this.trigger('loading_update',[this.infos]);
        },

        /**
         * UPDATE
         */
        update: function(ticker)
        {

        }
    });
})(window,APP);
