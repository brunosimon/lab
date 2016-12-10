(function(window)
{
    'use strict';

    APP.UI.World = Abstract.extend(
    {
        options:
        {
        },

        /**
         * INIT
         */
        init: function(options)
        {
            this._super(options);

            this.scene    = new THREE.Scene();
            this.camera   = new APP.UI.Camera({ratio:APP.conf.canvas.width/APP.conf.canvas.height});
            this.renderer = new APP.UI.Renderer({camera:this.camera.instance,scene:this.scene});
            this.terrain  = new APP.UI.Terrain({scene:this.scene});
        },

        /**
         * START
         */
        start: function()
        {
            this.camera.start();
            this.renderer.start();
        },

        /**
         * RESIZE
         */
        resize: function(browser)
        {
            this.camera.resize(window.innerWidth/window.innerHeight);
            this.renderer.resize(window.innerWidth,window.innerHeight);
        },

        /**
         * UPDATE
         */
        update: function()
        {
            this.camera.update();
            this.renderer.render();
            this.terrain.update();
        }
    });
})(window);

