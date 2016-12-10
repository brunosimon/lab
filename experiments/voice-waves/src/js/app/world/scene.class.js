H.World.Scene = B.Core.Abstract.extend(
{
    construct : function()
    {
        // Set up
        this.registry = new B.Tools.Registry();
        this.registry.set( 'scene', this );
        this.ticker   = new B.Tools.Ticker();
        this.browser  = new B.Tools.Browser();
        this.object   = new THREE.Scene();
        this.registry.set( 'three-scene', this.object );
        this.camera   = new H.World.Camera();
        this.grid     = new H.World.Grid();
        this.renderer = new H.World.Renderer();
        this.floor    = new H.World.Floor();
        // this.light    = new H.World.Lights();

        // Init
        // this.init_dummy();
        this.init_events();
    },

    /**
     * INIT EVENTS
     */
    init_events : function()
    {
        var that = this;

        this.ticker.on( 'tick', function( infos )
        {
            that.frame( infos );
        });
    },

    /**
     * INIT DUMMY
     */
    init_dummy : function()
    {
        this.dummy          = {};
        this.dummy.geometry = new THREE.BoxGeometry( 20, 20, 20 );
        // this.dummy.material = new THREE.MeshBasicMaterial( { color : 0xffffff } );
        // this.dummy.material = new THREE.MeshLambertMaterial( { color : 0xffffff } );
        this.dummy.material = new THREE.ShaderMaterial( {
            wireframe      : false,
            vertexShader   : shader_dummy_vertex,
            fragmentShader : shader_dummy_fragment,
            // uniforms       : THREE.UniformsUtils.clone( THREE.ShaderLib.lambert.uniforms ),
            // transparent    : true,
            // lights         : true
        } );
        this.dummy.mesh     = new THREE.Mesh( this.dummy.geometry, this.dummy.material );

        this.dummy.mesh.position.y = 20;
        this.dummy.mesh.position.x = 0;

        this.object.add( this.dummy.mesh );
    },

    /**
     * FRAME
     */
    frame : function( infos )
    {

    }
} );
