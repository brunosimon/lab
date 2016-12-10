(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.Sky = APP.CORE.Abstract.extend(
    {
        options :
        {
            scene        : null,
            bottom_color : 0x0c0034,
            top_color    : 0xd7007e,
            min_clamp    : -1,
            max_clamp    : 1,
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.scene = this.options.scene;
        },

        /**
         * START
         */
        start: function()
        {
            // Sphere
            this.uniforms = {
                topColor    : { type : 'c', value : new THREE.Color( this.options.top_color ) },
                bottomColor : { type : 'c', value : new THREE.Color( this.options.bottom_color ) },
                offset      : { type : 'f', value : -5000 },
                multiplier  : { type : 'f', value : 10000 },
                minClamp    : { type : 'f', value : this.options.min_clamp },
                maxClamp    : { type : 'f', value : this.options.max_clamp }
            };
            this.sky_geometry = new THREE.SphereGeometry( 10000, 32, 16 );
            this.sky_material = new THREE.ShaderMaterial( {
                vertexShader   : document.getElementById( 'gradient-vertex-shader' ).textContent,
                fragmentShader : document.getElementById( 'gradient-fragment-shader' ).textContent,
                uniforms       : this.uniforms,
                side           : THREE.BackSide
            } );
            this.sky = new THREE.Mesh( this.sky_geometry, this.sky_material );

            this.scene.add( this.sky );

            // Init Debug
            this.init_debug();
        },

        /**
         * INIT DEBUG
         */
        init_debug: function()
        {
            var that = this;

            this.debug          = {};
            this.debug.instance = new APP.COMPONENTS.Debug();
            this.debug.folder   = this.debug.instance.gui.instance.addFolder( 'Sky' );

            this.debug.top_color    = this.debug.folder.addColor( this.options, 'top_color' ).name( 'top color' );
            this.debug.bottom_color = this.debug.folder.addColor( this.options, 'bottom_color' ).name( 'bottom color' );
            this.debug.offset       = this.debug.folder.add( this.uniforms.offset, 'value', -20000, 20000 ).step( 10 ).name( 'offset' );
            this.debug.multiplier   = this.debug.folder.add( this.uniforms.multiplier, 'value', 0, 40000 ).step( 10 ).name( 'multiplier' );
            this.debug.min_clamp    = this.debug.folder.add( this.uniforms.minClamp, 'value', -2, 2 ).step( 0.1 ).name( 'min clamp' );
            this.debug.max_clamp    = this.debug.folder.add( this.uniforms.maxClamp, 'value', -2, 2 ).step( 0.1 ).name( 'max clamp' );


            this.debug.top_color.onChange( function( value )
            {
                that.uniforms.topColor.value = new THREE.Color( value );
            } );

            this.debug.bottom_color.onChange( function( value )
            {
                that.uniforms.bottomColor.value = new THREE.Color( value );
            } );
        }
    });
})();




