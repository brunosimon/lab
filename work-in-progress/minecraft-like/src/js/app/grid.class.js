(function(window,GAME)
{
    'use strict';

    GAME.Grid = Abstract.extend(
    {
        options:
        {
            view_distance : 4,
            block_size    : 1
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.scene  = this.options.scene;
            this.models = this.options.models;
        },

        /**
         * START
         */
        start: function()
        {
            this.generate_terrain();
        },

        /**
         * GENERATE TERRAIN
         */
        generate_terrain: function()
        {
            var x = 0,
                y = 0,
                z = 0;

            this.blocks = [];

            //X
            for(x = -this.options.view_distance; x <= this.options.view_distance; x++)
            {
                this.blocks[x] = [];

                //Z
                for(z = -this.options.view_distance; z <= this.options.view_distance; z++)
                {
                    this.blocks[x][z] = [];

                    var rand = Math.random();

                    this.add_block(x,0,z,'grass');
                        
                    if(rand > 0.8)
                        this.add_block(x,1,z,'grass');
                }
            }

            this.remove_block(1,1,1);
            this.remove_block(2,1,1);
            this.remove_block(3,1,1);
            this.remove_block(1,1,2);
            this.remove_block(1,1,3);

            this.add_block(2,1,2,'stone',true);
            this.add_block(2,1,3,'stone',true);
            this.add_block(3,1,2,'stone',true);
            this.add_block(3,1,3,'stone',true);
            this.add_block(3,2,3,'pumpkin',true);
        },

        /**
         * GET BLOCK
         */
        get_block: function(x,y,z)
        {
            try
            {
                var block = this.blocks[x][z][y];

                if(typeof block === 'undefined')
                    return false;

                return block;
            }
            catch(e)
            {
                return false;
            }
        },

        /**
         * REMOVE BLOCK
         */
        remove_block: function(x,y,z)
        {
            var block = this.get_block(x,y,z);

            if(!block)
                return false;
            else
            {
                this.blocks[x][z][y] = undefined;
                block.remove();
            }
        },

        /**
         * ADD BLOCK
         */
        add_block: function(x,y,z,type,force)
        {
            if(typeof force === 'undefined')
                force = false;

            var block = this.get_block(x,y,z);
            
            if(block)
            {
                if(!force)
                    return false;
                else
                    block.remove();
            }
             
            this.blocks[x][z][y] = new GAME.Block({
                scene    : this.scene,
                geometry : this.models.geometries.default,
                material : this.models.materials[type],
                x        : this.options.block_size * x,
                y        : this.options.block_size * y + this.options.block_size / 2,
                z        : this.options.block_size * z,
                size     : this.options.block_size
            });
        },

        /**
         * GET LIMIT
         */
        get_limits: function(x,y,z,radius,height)
        {
            var limits   = {},
                temp     = {},
                i        = 0,
                j        = 0;

            limits.x     = {};
            limits.x.min = null;
            limits.x.max = null;
            
            limits.y     = {};
            limits.y.min = null;
            limits.y.max = null;
            
            limits.z     = {};
            limits.z.min = null;
            limits.z.max = null;

            //X
            temp.x     = {};
            temp.x.min = Math.floor(x + this.options.block_size / 2 - 1);
            temp.x.max = Math.ceil(x - this.options.block_size / 2 + 1);
            temp.z     = [];
            temp.z.min = Math.floor(z - radius + this.options.block_size / 2);
            temp.z.max = Math.ceil(z + radius + this.options.block_size / 2);
            temp.y     = {};
            temp.y.min = Math.floor(y);
            temp.y.max = Math.ceil(y + height);

            for(i = temp.z.min; i < temp.z.max; i++)
            {
                for(j = temp.y.min; j < temp.y.max; j++)
                {
                    //Min
                    try
                    {
                        if(typeof this.blocks[temp.x.min][i][j] !== 'undefined')
                        {
                            if(limits.x.min === null || limits.x.min > this.blocks[temp.x.min][i][j].x)
                                limits.x.min = this.blocks[temp.x.min][i][j].x + this.options.block_size / 2 + radius;
                        }
                    }
                    catch(e)
                    {}

                    //Max
                    try
                    {
                        if(typeof this.blocks[temp.x.max][i][j] !== 'undefined')
                        {
                            if(limits.x.max === null || limits.x.min < this.blocks[temp.x.min][i][j].x)
                                limits.x.max = this.blocks[temp.x.max][i][j].x - this.options.block_size / 2 - radius;
                        }
                    }
                    catch(e)
                    {}
                }
            }


            //Z
            temp.z     = {};
            temp.z.min = Math.floor(z + this.options.block_size / 2 - 1);
            temp.z.max = Math.ceil(z - this.options.block_size / 2 + 1);
            temp.x     = [];
            temp.x.min = Math.floor(x - radius + this.options.block_size / 2);
            temp.x.max = Math.ceil(x + radius + this.options.block_size / 2);
            temp.y     = {};
            temp.y.min = Math.floor(y);
            temp.y.max = Math.ceil(y + height);

            for(i = temp.x.min; i < temp.x.max; i++)
            {
                for(j = temp.y.min; j < temp.y.max; j++)
                {
                    //Min
                    try
                    {
                        if(typeof this.blocks[i][temp.z.min][j] !== 'undefined')
                        {
                            if(limits.z.min === null || limits.z.min > this.blocks[i][temp.z.min][j].z)
                                limits.z.min = this.blocks[i][temp.z.min][j].z + this.options.block_size / 2 + radius;
                        }
                    }
                    catch(e)
                    {}

                    //Max
                    try
                    {
                        if(typeof this.blocks[i][temp.z.max][j] !== 'undefined')
                        {
                            if(limits.z.max === null || limits.z.min < this.blocks[i][temp.z.min][j].z)
                                limits.z.max = this.blocks[i][temp.z.max][j].z - this.options.block_size / 2 - radius;
                        }
                    }
                    catch(e)
                    {}
                }
            }

            //Y
            temp.y     = {};
            temp.y.min = Math.floor(y) - 1;
            temp.y.max = Math.ceil(y + height);
            temp.z     = {};
            temp.z.min = Math.floor(z - radius + this.options.block_size / 2);
            temp.z.max = Math.ceil(z + radius + this.options.block_size / 2);
            temp.x     = [];
            temp.x.min = Math.floor(x - radius + this.options.block_size / 2);
            temp.x.max = Math.ceil(x + radius + this.options.block_size / 2);

            for(i = temp.x.min; i < temp.x.max; i++)
            {
                for(j = temp.z.min; j < temp.z.max; j++)
                {
                    //Min
                    try
                    {
                        if(typeof this.blocks[i][j][temp.y.min] !== 'undefined')
                        {
                            if(limits.y.min === null || limits.y.min < this.blocks[i][j][temp.y.min].y)
                                limits.y.min = this.blocks[i][j][temp.y.min].y + this.options.block_size / 2;
                        }
                    }
                    catch(e)
                    {}

                    //Max
                    try
                    {
                        if(typeof this.blocks[i][j][temp.y.max] !== 'undefined')
                        {
                            if(limits.y.max === null || limits.y.max > this.blocks[i][j][temp.y.max].y)
                                limits.y.max = this.blocks[i][j][temp.y.max].y - this.options.block_size / 2;
                        }
                    }
                    catch(e)
                    {}
                }
            }

            return limits;
        },

        /**
         * UPDATE
         */
        update: function(ticker)
        {
            
        }
    });
})(window,GAME);