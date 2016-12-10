(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.Snow = APP.CORE.Abstract.extend(
    {
        options :
        {
            count         : 300000,
            multiplier    : 1,
            volume_corner : { x : - 2, y : 0.1, z : - 2 },
            volume_size   : { x : 4, y : 4, z : 4 },
            blending      : 'AdditiveBlending'
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.ticker  = new APP.TOOLS.Ticker();
            this.browser = new APP.TOOLS.Browser();
            this.scene   = this.options.scene;
            this.wind    = new THREE.Vector3( 0, 0, 0 );
            this.spark   = new APP.COMPONENTS.WORLD.Spark();

            this.gravity    = -2;
            this.time_scale = 0.00016;
        },

        /**
         * START
         */
        start: function()
        {
            var that = this;

            this.uniforms   = {};
            this.attributes = {};
            this.material   = null;

            this.uniforms.texture         = { type : 't', value : this.spark.texture };
            this.uniforms.pixelRatio      = { type : 'f', value : 1};
            this.uniforms.volumeCorner    = { type : 'v3', value : new THREE.Vector3( this.options.volume_corner.x, this.options.volume_corner.y, this.options.volume_corner.z ) };
            this.uniforms.volumeSize      = { type : 'v3', value : new THREE.Vector3( this.options.volume_size.x, this.options.volume_size.y, this.options.volume_size.z ) };
            this.uniforms.offset          = { type : 'v3', value : new THREE.Vector3( 0, 0, 0 ) };
            this.uniforms.perlinIntensity = { type : 'f', value : 1.5 };
            this.uniforms.perlinFrequency = { type : 'f', value : 0.5 };
            this.uniforms.time            = { type : 'f', value : 0 };
            this.uniforms.timeScale       = { type : 'f', value : this.time_scale };
            this.uniforms.fadeDistance    = { type : 'f', value : 1 };
            this.uniforms.particleOpacity = { type : 'f', value : 1 };
            this.uniforms.particleScale   = { type : 'f', value : 24 };
            this.uniforms.particlesColor  = { type : 'c', value : new THREE.Color( 0xffffff ) };
            this.uniforms.depthAtenuation = { type : 'i', value : true };

            this.material = new THREE.ShaderMaterial(
            {
                attributes     : this.attributes,
                uniforms       : this.uniforms,
                vertexShader   : document.getElementById( 'snow-vertex-shader' ).textContent,
                fragmentShader : document.getElementById( 'snow-fragment-shader' ).textContent,
                transparent    : true,
                blending       : THREE[this.options.blending],
                depthTest      : false,
                depthWrite     : false,
            });

            this.create_particles();

            // Init Debug
            this.init_debug();

            // Ticker
            this.ticker.on( 'tick' , function()
            {
                that.frame();
            } );
        },

        /**
         * INIT DEBUG
         */
        init_debug: function()
        {
            var that = this;

            this.debug          = {};
            this.debug.instance = new APP.COMPONENTS.Debug();
            this.debug.folder   = this.debug.instance.gui.instance.addFolder( 'Snow' );
            this.debug.folder.open();

            this.debug.blending         = this.debug.folder.add( this.options, 'blending', [ 'NormalBlending', 'AdditiveBlending', 'SubtractiveBlending' ] ).name( 'blending' );
            this.debug.count            = this.debug.folder.add( this.options, 'count', 1, 1000000 ).step( 1 ).name( 'count' );
            this.debug.gravity          = this.debug.folder.add( this, 'gravity', -20, 20 ).step( 0.0001 ).name( 'gravity' );
            this.debug.wind_x           = this.debug.folder.add( this.wind, 'x', -20, 20 ).step( 0.01 ).name( 'wind x' );
            // this.debug.wind_y           = this.debug.folder.add( this.wind, 'y', -20, 20 ).step( 0.01 ).name( 'wind y' );
            this.debug.wind_z           = this.debug.folder.add( this.wind, 'z', -20, 20 ).step( 0.01 ).name( 'wind z' );
            this.debug.perlin_intensity = this.debug.folder.add( this.uniforms.perlinIntensity, 'value', 0, 10 ).step( 0.1 ).name( 'perlin strength' );
            this.debug.perlin_frequency = this.debug.folder.add( this.uniforms.perlinFrequency, 'value', 0, 2 ).step( 0.01 ).name( 'perlin frequence' );
            this.debug.time_scale       = this.debug.folder.add( this, 'time_scale', 0, 0.001 ).step( 0.00001 ).name( 'time scale' );
            this.debug.fade_distance    = this.debug.folder.add( this.uniforms.fadeDistance, 'value', 0, 3 ).step( 0.1 ).name( 'fade distance' );
            this.debug.particle_opacity = this.debug.folder.add( this.uniforms.particleOpacity, 'value', 0, 1 ).step( 0.001 ).name( 'particle opacity' );
            this.debug.particle_scale   = this.debug.folder.add( this.uniforms.particleScale, 'value', 1, 100 ).step( 0.1 ).name( 'particle scale' );
            this.debug.depth_atenuation = this.debug.folder.add( this.uniforms.depthAtenuation, 'value' ).name( 'depth atenuation' );

            this.debug.blending.onChange( function( value )
            {
                that.material.blending = THREE[value];
            } );

            this.debug.time_scale.onChange( function( value )
            {
                that.uniforms.timeScale.value = value;
            } );

            this.debug.count.onFinishChange( function( value )
            {
                that.create_particles();

                that.point_cloud.geometry.verticesNeedUpdate      = true;
                that.point_cloud.geometry.elementsNeedUpdate      = true;
                that.point_cloud.geometry.uvsNeedUpdate           = true;
                that.point_cloud.geometry.normalsNeedUpdate       = true;
                that.point_cloud.geometry.tangentsNeedUpdate      = true;
                that.point_cloud.geometry.colorsNeedUpdate        = true;
                that.point_cloud.geometry.lineDistancesNeedUpdate = true;

                that.point_cloud.geometry.dynamic                 = true;

                that.material.needsUpdate                         = true;

                that.point_cloud.matrixWorldNeedsUpdate           = true;
            } );
        },

        /**
         * CREATE PARTICLES
         */
        create_particles: function()
        {
            // Reset
            if(this.point_cloud)
            {
                // this.point_cloud.geometry.dispose();
                this.scene.remove( this.point_cloud );
            }

            this.geometry    = new THREE.Geometry();
            this.point_cloud = new THREE.PointCloud( this.geometry, this.material );

            // Loop
            var count = this.options.count;
            while(count--)
            {
                this.geometry.vertices.push( new THREE.Vector3(
                    Math.random() * this.options.volume_size.x - this.options.volume_size.x / 2,
                    Math.random() * this.options.volume_size.y - this.options.volume_size.y / 2,
                    Math.random() * this.options.volume_size.z - this.options.volume_size.z / 2
                ) );
            }

            this.scene.add( this.point_cloud );
        },

        /**
         * FRAME
         */
        frame: function()
        {
            // Snow
            this.uniforms.time.value = this.ticker.elapsed_time;

            this.uniforms.offset.value.x += this.wind.x * this.ticker.delta * this.time_scale;
            this.uniforms.offset.value.y += this.wind.y * this.ticker.delta * this.time_scale;
            this.uniforms.offset.value.z += this.wind.z * this.ticker.delta * this.time_scale;

            this.uniforms.offset.value.y += this.gravity * this.ticker.delta * this.time_scale;
        },

        /**
         * DESTROY
         */
        destroy: function()
        {
            // Scene
            this.scene.remove( this.point_cloud );

            // Debug
            this.debug.gravity.remove();
            this.debug.wind_x.remove();
            this.debug.wind_y.remove();
            this.debug.wind_z.remove();
            this.debug.perlin_intensity.remove();
            this.debug.perlin_frequency.remove();
            this.debug.time_scale.remove();
            this.debug.fade_distance.remove();
            this.debug.particle_scale.remove();
        }
    });
})();




