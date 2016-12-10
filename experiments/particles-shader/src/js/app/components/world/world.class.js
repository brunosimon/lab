(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.World = APP.CORE.Event_Emitter.extend(
    {
        options :
        {
            camera :
            {
                ease : 0.1
            },
            elves :
            {
                count    : 40,
                distance : 0.7
            }
        },

        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.COMPONENTS.WORLD.World.prototype.instance === null )
                return null;
            else
                return APP.COMPONENTS.WORLD.World.prototype.instance;
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.ticker       = new APP.TOOLS.Ticker();
            this.browser      = new APP.TOOLS.Browser();
            this.mouse        = new APP.TOOLS.Mouse();
            this.canvas       = document.getElementById( 'three-canvas' );

            APP.COMPONENTS.WORLD.World.prototype.instance = this;
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            // Scene
            this.scene  = new THREE.Scene();

            // Camera
            this.camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 100000 );
            this.center = new THREE.Vector3( 0, 2, 0 );
            this.camera.position.set( 4, 2, 4 );
            this.camera.speed = { x : 0, y : 0, z : 0 };

            // Sky
            this.sky = new APP.COMPONENTS.WORLD.Sky( { scene : this.scene } );
            this.sky.start();

            // Resize
            this.browser.on( 'resize' ,function()
            {
                // Canvas
                that.canvas.width  = that.browser.width;
                that.canvas.height = that.browser.height;

                // Camera
                that.camera.aspect = that.browser.width / that.browser.height;
                that.camera.updateProjectionMatrix();
            } );

            // Mouse wheel
            this.distance = 4;
            this.mouse.on( 'wheel', function()
            {
                that.distance += - that.mouse.wheel.delta / 200;

                if(that.distance < 0.6)
                    that.distance = 0.6;
                else if(that.distance > 10)
                    that.distance = 10;
            } );

            // Renderer
            this.renderer = new APP.COMPONENTS.WORLD.Renderer( { canvas : this.canvas } );
            this.renderer.start( this.scene, this.camera );

            // Ticker
            this.ticker.on( 'tick' , function()
            {
                that.frame();
            } );

            // Snow
            this.init_snow();
        },

        /**
         * INIT SNOW
         */
        init_snow: function()
        {
            if( this.snow )
                this.snow.destroy();

            var bounds = {
                min :
                {
                    x : -1,
                    y : 0.1,
                    z : -1
                },
                max :
                {
                    x : 1,
                    y : 4,
                    z : 1
                }
            };

            this.snow = new APP.COMPONENTS.WORLD.Snow( {
                scene : this.scene
            } );
            this.snow.start();
        },

        /**
         * FRAME
         */
        frame: function()
        {
            this.camera.position.x += ( Math.sin( this.mouse.ratio.x * 4.6 - 2.3 ) * this.distance - this.camera.position.x ) / 10;
            this.camera.position.z += ( Math.cos( this.mouse.ratio.x * 4.6 - 2.3 ) * this.distance - this.camera.position.z ) / 10;
            this.camera.position.y += ( this.center.y / 2 - (this.mouse.ratio.y - 1) * this.distance - this.camera.position.y ) / 10;

            this.camera.lookAt( this.center );
        }
    });
})();




