(function(window,GAME)
{
    'use strict';

    GAME.Skybox = Abstract.extend(
    {
        options :
        {
            debug      : [/*'sides','show'*/],
            draw_edges : false,
            draw_sides : false,
            texture    :
            {
                width  : 400,
                height : 300,
                side   :
                {
                    size : 200,
                    preview_size : 100
                },
                sides  : [
                    // RIGHT
                    {
                        name : 'right',
                        x    : 2,
                        y    : 1
                    },
                    // LEFT
                    {
                        name : 'left',
                        x    : 0,
                        y    : 1
                    },
                    // TOP
                    {
                        name : 'top',
                        x    : 1,
                        y    : 0
                    },
                    // BOTTOM
                    {
                        name : 'bottom',
                        x    : 1,
                        y    : 2
                    },
                    // FRONT
                    {
                        name : 'front',
                        x    : 1,
                        y    : 1
                    },
                    // BACK
                    {
                        name : 'back',
                        x    : 3,
                        y    : 1
                    }
                ]
            }
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.scene = this.options.scene;

            this.sun   = new GAME.Sun({face_size:this.options.texture.side.size});
            this.moon  = new GAME.Moon({face_size:this.options.texture.side.size});
            this.stars = new GAME.Stars({face_size:this.options.texture.side.size});
            this.sky   = new GAME.Sky({face_size:this.options.texture.side.size});
        },

        /**
         * START
         */
        start: function()
        {
            this.create_texture();
            this.create_mesh();
            this.set_debug(this.options.debug);
        },

        /**
         * CREATE MESH
         */
        create_mesh: function()
        {
            // Skybox
            var shader = THREE.ShaderLib['cube'];
            shader.uniforms['tCube'].value = this.texture.group;

            var material = new THREE.ShaderMaterial(
            {
                fragmentShader : shader.fragmentShader,
                vertexShader   : shader.vertexShader,
                uniforms       : shader.uniforms,
                side           : THREE.BackSide
            }),
            mesh = new THREE.Mesh(new THREE.CubeGeometry(10000,10000,10000),material);
            this.scene.add(mesh);
        },

        /**
         * CREATE TEXTURE
         */
        create_texture: function()
        {
            this.texture = {};

            // Sides
            this.texture.sides = [];
            for(var i = 0; i < 6; i++)
            {
                var side_options = this.options.texture.sides[i],
                    side         = side_options;

                side.canvas                = document.createElement('canvas');
                side.canvas.width          = this.options.texture.side.size;
                side.canvas.height         = this.options.texture.side.size;
                side.canvas.style.position = 'absolute';
                side.canvas.style.top      = this.options.texture.side.preview_size * side_options.y + 'px';
                side.canvas.style.left     = this.options.texture.side.preview_size  * side_options.x + 'px';
                side.canvas.style.width    = this.options.texture.side.preview_size + 'px';
                side.canvas.style.height   = this.options.texture.side.preview_size + 'px';

                side.context               = side.canvas.getContext('2d');
                side.context.fillRect(0,0,this.options.texture.side.size,this.options.texture.side.size,0,0,this.options.texture.side.size,this.options.texture.side.size);

                this.texture.sides.push(side);
            }

            this.texture.group       = new THREE.Texture([this.texture.sides[0].canvas,this.texture.sides[1].canvas,this.texture.sides[2].canvas,this.texture.sides[3].canvas,this.texture.sides[4].canvas,this.texture.sides[5].canvas],new THREE.CubeRefractionMapping());

            this.texture.group.flipY       = false;
            this.texture.group.wrapS       = this.texture.group.wrapT = THREE.RepeatWrapping;
            this.texture.group.magFilter   = THREE.NearestFilter;
            this.texture.group.minFilter   = THREE.NearestFilter;
            this.texture.group.needsUpdate = true;
        },

        /**
         * SET DEBUG
         */
        set_debug: function(values)
        {
            var i;

            // Draw face edges
            this.options.draw_edges = values.indexOf('edges') !== -1;

            // Draw face name
            this.options.draw_sides = values.indexOf('sides') !== -1;

            // Show on screen
            if(values.indexOf('show') !== -1)
            {
                for(i = 0; i < 6; i++)
                    document.body.appendChild(this.texture.sides[i].canvas);
            }
            else
            {
                try
                {
                    for(i = 0; i < 6; i++)
                        document.body.removeChild(this.texture.sides[i].canvas);
                }
                catch(e){}
            }
        },

        /**
         * CLEAR
         */
        clear: function(side)
        {
            side.context.fillRect(0,0,this.options.texture.side.size,this.options.texture.side.size);
        },

        /**
         * DRAW DEBUG
         */
        draw_debug: function(side)
        {
            if(this.options.draw_sides)
            {
                side.context.save();
                side.context.font = '10px Helvetica';
                side.context.textAlign = 'center';
                side.context.fillStyle = 'rgb(252,255,188)';
                side.context.fillText(side.name,50,10);
                side.context.restore();
            }
        },

        /**
         * UPDATE
         */
        update: function(period)
        {
            var side = null;

            for(var i = 0; i < 6; i++)
            {
                side = this.texture.sides[i];
                this.clear(side);

                this.sky.draw(side,period);
                this.stars.draw(side,period);
                this.sun.draw(side,period);
                this.moon.draw(side,period);

                this.draw_debug(side);
                
                this.texture.group.needsUpdate = true;
            }
        }
    });
})(window,GAME);
