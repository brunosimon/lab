(function(window,GAME)
{
    'use strict';

    GAME.World = Abstract.extend(
    {
        options:{

        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            this.models = new GAME.Models({block_size:this.options.block_size});
            this.models.start();
            this.models.on('ready',function()
            {
                that.scene       = new THREE.Scene();
                that.renderer    = new THREE.WebGLRenderer({canvas:that.options.canvas});
                that.camera      = new GAME.Camera();
                that.player      = new GAME.Player({controller:that.options.controller});
                that.grid        = new GAME.Grid({scene:that.scene,models:that.models});
                that.environment = new GAME.Environment({scene:that.scene});

                that.renderer.setSize(window.innerWidth, window.innerHeight);

                that.player.start();
                that.grid.start();
                that.environment.start();

                that.trigger('ready');
            });
        },

        /**
         * UPDATE
         */
        update: function(ticker)
        {
            var limits = this.grid.get_limits(this.player.position.x,this.player.position.y,this.player.position.z,this.player.size.radius,this.player.size.height);

            //Temporary floor limit
            if(!limits.y.min)
                limits.y.min = 0;

            this.environment.update(ticker);
            this.player.update(ticker,limits);
            this.camera.update(this.player);
            this.renderer.render(this.scene,this.camera.three);
        }
    });
})(window,GAME);
