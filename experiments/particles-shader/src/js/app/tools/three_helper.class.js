(function()
{
    "use strict";

    APP.TOOLS.THREE_Helper = APP.CORE.Abstract.extend(
    {
        /**
         * SINGLETON
         */
        staticInstantiate:function()
        {
            if( APP.TOOLS.THREE_Helper.prototype.instance === null )
                return null;
            else
                return APP.TOOLS.THREE_Helper.prototype.instance;
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            this.cache = {};

            APP.TOOLS.THREE_Helper.prototype.instance = this;
        },

        /* CREATE BOX */
        create_box: function( x, y, z, width, height, depth, color, destination )
        {
            // Material
            var material = this.get( 'material-' + color );
            if( !material )
                material = this.set( 'material-' + color, new THREE.MeshLambertMaterial( { color : color, shading : THREE.FlatShading } ) );

            // Geometry
            var geometry = this.get( 'geometry-' + width + '-' + height + '-' + depth );
            if( !geometry )
                geometry = this.set( 'geometry-' + width + '-' + height + '-' + depth, new THREE.BoxGeometry( width, height, depth ) );

            // Mesh
            var mesh     = new THREE.Mesh( geometry, material );

            mesh.position.set( x, y, z );

            destination.add( mesh );

            return mesh;
        },

        /* CREATE PYRAMID */
        create_pyramid: function( x, y, z, width, height, color, destination )
        {
            var material = new THREE.MeshLambertMaterial( { color : color, shading : THREE.FlatShading } ),
                geometry = new THREE.CylinderGeometry( 0, width, height, 4, false ),
                mesh     = new THREE.Mesh( geometry, material );

            mesh.position.set( x, y, z );
            mesh.rotation.y = Math.PI / 4;

            destination.add( mesh );

            return mesh;
        },

        /**
         * GET
         */
        get: function( key )
        {
            if( this.cache[ key ] )
                return this.cache[ key ];

            return false;
        },

        /**
         * SET
         */
        set: function( key, value )
        {
            this.cache[ key ] = value;

            return value;
        }
    });
})();
