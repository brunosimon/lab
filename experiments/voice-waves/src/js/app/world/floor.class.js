H.World.Floor = B.Core.Abstract.extend(
{
    options :
    {
        grid :
        {
            active    : false,
            count     : 40,
            thickness : 0.4,
            color     : '#252525',
            space     : 40
        }
    },

    construct : function()
    {
        var that = this;

        // Set up
        this.registry = new B.Tools.Registry();
        this.browser  = new B.Tools.Browser();
        this.object   = new THREE.Object3D();
        this.scene    = this.registry.get( 'scene' );
        this.renderer = this.registry.get( 'renderer' );
        this.camera   = this.registry.get( 'camera' );

        // Create 3D object
        this.geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
        // this.material = new THREE.MeshBasicMaterial( { color : 0xff0000 } );
        this.material = new THREE.MeshBasicMaterial( { color : 0x777777 } );
        this.mirror   = new THREE.Mirror( this.renderer.instance, this.camera.object, { clipBias: 0.003, textureWidth: 1024, textureHeight: 1024, color: 0x222222 } );
        this.mesh     = new THREE.Mesh( this.geometry, this.mirror.material );
        this.mesh.add( this.mirror );

        this.mesh.rotation.x = - Math.PI * 0.5;

        this.scene.object.add( this.mesh );

        this.browser.on( 'resize', function( viewport )
        {
            that.mirror.mirrorCamera.aspect = viewport.width / viewport.height;
            that.mirror.mirrorCamera.updateProjectionMatrix();
        } );

        // test grid
        this.init_grid();
        this.init_debug();
    },

    /**
     * INIT GRID
     */
    init_grid : function()
    {
        this.grid = {};

        this.create_grid();
    },

    /**
     * CREATE GRID
     */
    create_grid : function()
    {
        // Remove
        if( this.grid.object )
            this.scene.object.remove( this.grid.object );

        if( !this.options.grid.active )
            return;

        this.grid.object = new THREE.Object3D();
        this.scene.object.add( this.grid.object );

        var distance = this.options.grid.count * this.options.grid.space,
            geometry = new THREE.PlaneBufferGeometry( distance, this.options.grid.thickness ),
            color    = new THREE.Color( this.options.grid.color ),
            material = new THREE.MeshBasicMaterial( { color : new THREE.Color( color.getHex() ) } ),
            mesh     = null,
            x        = null,
            z        = null;

        for( var i = 0; i < this.options.grid.count; i++ )
        {
            x = 0;
            z = - distance / 2 + distance * i / this.options.grid.count;

            mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = x;
            mesh.position.z = z;
            mesh.position.y = 0.1;
            mesh.rotation.x = - Math.PI * 0.5;

            this.grid.object.add( mesh );
        }

        for( i = 0; i < this.options.grid.count; i++ )
        {
            x = - distance / 2 + distance * i / this.options.grid.count;
            z = 0;

            mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = x;
            mesh.position.z = z;
            mesh.position.y = 0.1;
            mesh.rotation.z = - Math.PI * 0.5;
            mesh.rotation.x = - Math.PI * 0.5;

            this.grid.object.add( mesh );
        }
    },

    /**
     * INIT DEBUG
     */
    init_debug : function()
    {
        // Set up
        var that = this,
            ui   = this.registry.get( 'dat-gui' );

        // Folder
        var folder = ui.addFolder( 'Floor' );
        folder.open();

        // Callback
        var change = function( value )
        {
            that.create_grid();
        };

        // Active
        var active = folder.add( this.options.grid, 'active' );
        active.name( 'active' );
        active.onFinishChange( change );

        // Count
        var count = folder.add( this.options.grid, 'count', 0, 200 );
        count.name( 'count' );
        count.step( 1 );
        count.onFinishChange( change );

        // Thickness
        var thickness = folder.add( this.options.grid, 'thickness', 0, 10 );
        thickness.name( 'thickness' );
        thickness.step( 0.01 );
        thickness.onFinishChange( change );

        // Space
        var space = folder.add( this.options.grid, 'space', 0, 400 );
        space.name( 'space' );
        space.step( 1 );
        space.onFinishChange( change );

        // Color
        var color = folder.addColor( this.options.grid, 'color' );
        color.name( 'color' );
        color.onChange( change );
    }
} );
