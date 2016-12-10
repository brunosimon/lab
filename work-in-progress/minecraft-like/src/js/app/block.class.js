(function(window,GAME)
{
    'use strict';

    GAME.Block = Abstract.extend(
    {
        options:{
            x    : 0,
            y    : 0,
            z    : 0,
            size : 1
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.scene    = this.options.scene;

            this.geometry = this.options.geometry;
            this.material = this.options.material;
            this.mesh     = null;
            
            this.x        = this.options.x;
            this.y        = this.options.y;
            this.z        = this.options.z;
            this.size     = this.options.size;
            
            this.create();
        },

        /**
         * START
         */
        create: function()
        {
            this.mesh            = new THREE.Mesh(this.geometry,this.material);
            this.mesh.position.x = this.x;
            this.mesh.position.y = this.y;
            this.mesh.position.z = this.z;
            this.scene.add(this.mesh);
        },

        /**
         * UPDATE
         */
        update: function(ticker)
        {
            
        },

        /**
         * REMOVE
         */
        remove: function()
        {
            this.scene.remove(this.mesh);
        }
    });
})(window,GAME);