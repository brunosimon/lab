H.World.Camera = B.Core.Abstract.extend(
{
    options :
    {
        ease : 6,
        mode : 'free',
        rail :
        {
            target_y : 0,
            y        : 120,
            radius   : 300,
            speed    : 0.4
        },
        free :
        {
            y : 120
        }
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.registry   = new B.Tools.Registry();
        this.ticker     = new B.Tools.Ticker();
        this.browser    = new B.Tools.Browser();
        this.mouse      = new B.Tools.Mouse();
        this.object     = new THREE.PerspectiveCamera( 55, this.browser.viewport.width / this.browser.viewport.height, 0.1, 100000 );
        this.target     = new THREE.Vector3( 0, 100, 0 );
        this.distance   = 400;
        this.microphone = this.registry.get( 'microphone' );

        this.rail        = {};
        this.rail.target = new THREE.Vector3( 0, this.options.rail.target_y, 0 );

        this.object.position.z = - this.distance;

        // Save in registry
        this.registry.set( 'camera', this );
        this.registry.set( 'three-camera', this.object );

        // Init
        this.init_events();
        this.init_debug();
    },

    /**
     * INIT EVENTS
     */
    init_events : function(params)
    {
        var that = this;

        // On ticker tick
        this.ticker.on( 'tick', function( infos )
        {
            that.frame( infos );
        });

        // On browser resize
        this.browser.on( 'resize', function( viewport )
        {
            that.object.aspect = viewport.width / viewport.height;
            that.object.updateProjectionMatrix();
        } );

        // On mouse wheel
        this.mouse.on( 'wheel', function( infos )
        {
            // update distance
            that.distance -= infos.delta * 0.1;

            if(that.distance < 30)
                that.distance = 30;
            else if(that.distance > 1000)
                that.distance = 1000;

            // Prevent native scroll
            return false;
        } );

        // Improve mouse
        this.mouse.offset = {x:0,y:0};
        this.mouse.origin = {x:0,y:0};

        // On mouse down
        this.mouse.on( 'down', function( position )
        {
            this.origin.x = position.ratio.x;
            this.origin.y = position.ratio.y;
        } );

        // On mouse down
        this.mouse.on( 'move', function( position )
        {
            if( this.down )
            {
                this.offset.x += position.ratio.x - this.origin.x;
                this.offset.y += position.ratio.y - this.origin.y;

                this.origin.x = position.ratio.x;
                this.origin.y = position.ratio.y;
            }
        } );
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
        var folder = ui.addFolder( 'Camera' );
        folder.open();

        // Mode param
        var mode = folder.add( this.options, 'mode', [ 'free', 'locked' ] );
        mode.name( 'mode' );

        // Ease param
        var ease = folder.add( this.options, 'ease', 1, 40 );
        ease.name( 'ease' );
        ease.step( 1 );

        // // Rail y
        // var rail_y = folder.add( this.options.rail, 'y', 0, 500 );
        // rail_y.name( 'rail y' );
        // rail_y.step( 1 );

        // // Rail y
        // var rail_target_y = folder.add( this.rail.target, 'y', 0, 200 );
        // rail_target_y.name( 'rail target y' );
        // rail_target_y.step( 1 );

        // // Rail radius
        // var rail_radius = folder.add( this.options.rail, 'radius', 0, 500 );
        // rail_radius.name( 'rail radius' );
        // rail_radius.step( 1 );

        // // Rail speed
        // var rail_speed = folder.add( this.options.rail, 'speed', 0, 10 );
        // rail_speed.name( 'rail speed' );
        // rail_speed.step( 0.01 );
    },

    /**
     * FRAME
     */
    frame : function( infos )
    {
        var phi, theta, x, y, z, radius;

        // Free mode
        if( this.options.mode === 'free' )
        {
            var mouse_y = this.mouse.offset.y + 0.1,
                mouse_x = this.mouse.offset.x + 0.25;

            // Limits
            if( mouse_y < 0.01 )
                mouse_y = 0.01;
            else if( mouse_y > 0.5 )
                mouse_y = 0.5;

            // Calculate XYZ position on sphere position
            phi   = - ( mouse_y - 1 ) * Math.PI;
            theta = - ( mouse_x - 0.5 ) * Math.PI;

            radius = this.distance;

            x = - radius * Math.cos( phi ) * Math.cos( theta );
            y =   radius * Math.sin( phi );
            z =   radius * Math.cos( phi ) * Math.sin( theta );

            // Update position
            this.object.position.x += ( x - this.object.position.x ) / this.options.ease;
            this.object.position.y += ( y - this.object.position.y ) / this.options.ease;
            this.object.position.z += ( z - this.object.position.z ) / this.options.ease;

            // Look at target
            this.object.lookAt( this.target );
        }

        // Rail mode
        else if( this.options.mode === 'rail' )
        {
            // Calculate XYZ position on sphere position
            phi   = 0.25;
            theta = infos.elapsed * 0.0001 * this.options.rail.speed * Math.PI;

            radius = this.options.rail.radius;

            // Update with microphone
            radius += this.microphone.values.volume.maxed * 300;

            x = - radius * Math.cos( phi ) * Math.cos( theta );
            y =   this.options.rail.y;
            z =   radius * Math.cos( phi ) * Math.sin( theta );

            // Update position
            this.object.position.x += ( x - this.object.position.x ) / this.options.ease;
            this.object.position.y += ( y - this.object.position.y ) / this.options.ease;
            this.object.position.z += ( z - this.object.position.z ) / this.options.ease;

            // Update with microphone
            this.rail.target.y = this.options.rail.target_y + this.microphone.values.volume.maxed * 200;

            // Look at target
            this.object.lookAt( this.rail.target );
        }

        // Locked mode
        else if( this.options.mode === 'locked' )
        {
            // Update position
            this.object.position.x = 300;
            this.object.position.y = 140;
            this.object.position.z = 300;

            // Look at target
            this.object.lookAt( new THREE.Vector3( 0, 100, 0 ) );
        }

    }
} );
