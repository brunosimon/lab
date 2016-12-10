(function(window,GAME)
{
    'use strict';

    GAME.Models = Abstract.extend(
    {
        options:
        {
            block_size : 1,
            textures   :
            {
                grass :
                {
                    top    : 'src/game/textures/blocks/grass_top.png',
                    side   : 'src/game/textures/blocks/grass_side.png',
                    bottom : 'src/game/textures/blocks/dirt.png'
                },
                dirt :
                {
                    default : 'src/game/textures/blocks/dirt.png'
                },
                stone :
                {
                    default : 'src/game/textures/blocks/stone.png'
                },
                stone_brick :
                {
                    default : 'src/game/textures/blocks/stonebrick.png'
                },
                red_stone_ore :
                {
                    default : 'src/game/textures/blocks/redstone_ore.png'
                },
                red_stone_block :
                {
                    default : 'src/game/textures/blocks/redstone_block.png'
                },
                quartz_ore :
                {
                    default : 'src/game/textures/blocks/quartz_ore.png'
                },
                pumpkin :
                {
                    top     : 'src/game/textures/blocks/pumpkin_top.png',
                    default : 'src/game/textures/blocks/pumpkin_side.png',
                    back    : 'src/game/textures/blocks/pumpkin_face_off.png'
                },
                planks_acacia :
                {
                    default : 'src/game/textures/blocks/planks_acacia.png'
                },
                planks_birch :
                {
                    default : 'src/game/textures/blocks/planks_birch.png'
                },
                planks_jungle :
                {
                    default : 'src/game/textures/blocks/planks_jungle.png'
                },
                planks_spruce :
                {
                    default : 'src/game/textures/blocks/planks_spruce.png'
                },
                melon :
                {
                    top    : 'src/game/textures/blocks/melon_top.png',
                    side   : 'src/game/textures/blocks/melon_side.png',
                    bottom : 'src/game/textures/blocks/melon_top.png'
                },
                log_spruce :
                {
                    top    : 'src/game/textures/blocks/log_spruce_top.png',
                    side   : 'src/game/textures/blocks/log_spruce.png',
                    bottom : 'src/game/textures/blocks/log_spruce_top.png'
                },
                log_oak :
                {
                    top    : 'src/game/textures/blocks/log_oak_top.png',
                    side   : 'src/game/textures/blocks/log_oak.png',
                    bottom : 'src/game/textures/blocks/log_oak_top.png'
                },
                iron_ore :
                {
                    default : 'src/game/textures/blocks/iron_ore.png'
                },
                gravel :
                {
                    default : 'src/game/textures/blocks/gravel.png'
                },
                furnace :
                {
                    default : 'src/game/textures/blocks/furnace_side.png',
                    front : 'src/game/textures/blocks/furnace_front_on.png',
                    top   : 'src/game/textures/blocks/furnace_top.png'
                },
                diamond_ore :
                {
                    default : 'src/game/textures/blocks/diamond_ore.png'
                },
                crafting_table :
                {
                    default : 'src/game/textures/blocks/crafting_table_side.png',
                    front   : 'src/game/textures/blocks/crafting_table_front.png',
                    top     : 'src/game/textures/blocks/crafting_table_top.png'
                },
                cobblestone :
                {
                    default : 'src/game/textures/blocks/cobblestone.png'
                },
                coal_block :
                {
                    default : 'src/game/textures/blocks/coal_block.png'
                },
                clay :
                {
                    default : 'src/game/textures/blocks/clay.png'
                },
                brick :
                {
                    default : 'src/game/textures/blocks/brick.png'
                }
            }
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.geometries = {};
            this.textures   = {};
            this.materials  = {};

            this.progress             = {};
            this.progress.to_load     = 0;
            this.progress.loaded      = 0;
            this.progress.ratio       = 0;
            this.progress.errors      = 0;
            this.progress.errors_urls = [];
            this.progress.has_errors  = false;
        },

        /**
         * START
         */
        start: function()
        {
            this.generate_textures();
            this.generate_materials();
            this.generate_geometries();
        },

        /**
         * GENERATE TEXTURES
         */
        generate_textures: function()
        {
            var that = this;

            // Each texture group
            _.each(this.options.textures,function(sides,group)
            {
                that.textures[group] = {};
                
                // Each texture URL
                _.each(sides,function(url,side)
                {
                    // Progress
                    that.progress.to_load++;

                    // Image
                    var _image   = new Image(),
                        _texture = new THREE.Texture();
                    
                    // Add to textures object
                    that.textures[group][side] = _texture;

                    // Load
                    _image.onload = function()
                    {
                        // Progress
                        that.progress.loaded++;
                        that.progress.ratio = that.progress.loaded / that.progress.to_load;

                        // Texture settings
                        _texture.image       = _image;
                        _texture.magFilter   = THREE.NearestFilter;
                        _texture.minFilter   = THREE.NearestFilter;
                        _texture.needsUpdate = true;

                        // Ready
                        if(that.progress.ratio === 1)
                            that.trigger('ready');
                    };

                    _image.onerror = function()
                    {
                        // Progress
                        that.progress.loaded++;
                        that.progress.errors++;
                        that.progress.has_errors = true;
                        that.progress.errors_urls.push(_image.src);
                    };

                    _image.src = url;
                });
            });
        },

        /**
         * GENERATE MATERIALS
         */
        generate_materials: function()
        {
            var that = this;

            // Each texture group
            _.each(this.options.textures,function(sides,group)
            {
                var materials = [];

                for(var i = 0; i < 6; i++)
                {
                    var _material = null;

                    switch(i)
                    {
                        // Right
                        case 0:
                            _material = new THREE.MeshLambertMaterial({
                                // wireframe : true,
                                color: 0xffffff,
                                map: that.textures[group].right || that.textures[group].side || that.textures[group].default
                            });
                            break;
                        // Left
                        case 1:
                            _material = new THREE.MeshLambertMaterial({
                                // wireframe : true,
                                color: 0xffffff,
                                map: that.textures[group].left || that.textures[group].side || that.textures[group].default
                            });
                            break;
                        // Top
                        case 2:
                            _material = new THREE.MeshLambertMaterial({
                                // wireframe : true,
                                color: 0xffffff,
                                map: that.textures[group].top || that.textures[group].default
                            });
                            break;
                        // Bottom
                        case 3:
                            _material = new THREE.MeshLambertMaterial({
                                // wireframe : true,
                                color: 0xffffff,
                                map: that.textures[group].bottom || that.textures[group].default
                            });
                            break;
                        // Front
                        case 4:
                            _material = new THREE.MeshLambertMaterial({
                                // wireframe : true,
                                color: 0xffffff,
                                map: that.textures[group].front || that.textures[group].side || that.textures[group].default
                            });
                            break;
                        // Back
                        case 5:
                            _material = new THREE.MeshLambertMaterial({
                                // wireframe : true,
                                color: 0xffffff,
                                map: that.textures[group].back || that.textures[group].side || that.textures[group].default
                            });
                            break;
                    }

                    _material.shading  = THREE.NoShading;
                    _material.blending = THREE.NoBlending;
                    
                    materials.push(_material);
                }

                that.materials[group] = new THREE.MeshFaceMaterial(materials);
            });
        },

        /**
         * GENERATE GEOMETRIES
         */
        generate_geometries: function()
        {
            this.geometries.default = new THREE.CubeGeometry(this.options.block_size,this.options.block_size,this.options.block_size,1,1,1);
        }
    });
})(window,GAME);