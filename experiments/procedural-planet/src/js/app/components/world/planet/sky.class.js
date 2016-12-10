(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.PLANET.Sky = APP.CORE.Event_Emitter.extend(
    {
        options :
        {

        },

        /**
         * INIT
         */
        init : function( options )
        {
            var that = this;

            this._super( options );

            this.scene             = this.options.scene;
            this.sun_light         = this.options.sun_light;
            this.generate_uniforms = this.options.generate_uniforms;

            // Geometry
            this.geometry = new THREE.SphereGeometry( 110, 200, 200 );

            // Material
            this.material = new THREE.ShaderMaterial( {
                uniforms       : this.generate_uniforms(),
                vertexShader   : document.getElementById( 'sky-vertex-shader' ).textContent,
                fragmentShader : document.getElementById( 'sky-fragment-shader' ).textContent
            } );
            this.material.side        = THREE.BackSide;
            this.material.transparent = true;
            this.material.blending    = THREE.AdditiveBlending;

            // Mesh
            this.mesh = new THREE.Mesh( this.geometry, this.material );

            // Add to scene
            this.scene.add( this.mesh );
        }
    });
})();
