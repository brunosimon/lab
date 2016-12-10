(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.Sun = APP.CORE.Event_Emitter.extend(
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

            this.scene  = this.options.scene;
            this.camera = this.options.camera;

            // Sun
            this.light = new THREE.PointLight( new THREE.Color( 0xffffff ), 1.0 );
            this.light.position.set( this.options.x, this.options.y, this.options.z );
            this.scene.add( this.light );

            // lens flares
            var texture  = THREE.ImageUtils.loadTexture( "src/img/sun-lens-flare.png" ),
                geometry = new THREE.PlaneBufferGeometry( 40000, 40000 ),
                material = new THREE.MeshBasicMaterial( { color : 0xffffff } );

            material.map = texture;

            this.lens = new THREE.Mesh( geometry, material );

            this.lens.position.set( this.options.x, this.options.y, this.options.z );
            this.lens.rotation.y = Math.PI;

            this.scene.add( this.lens );
        },

        /**
         * FRAME
         */
        frame : function()
        {
            this.lens.lookAt( this.camera.position );
        }
    });
})();
