H.World.Grid = B.Core.Abstract.extend(
{
    options :
    {
        demo_mode                       : { active : false },
        bottom_fade                     : 4,
        elevation_multiplier            : 1,
        elevation_offset                : -4,
        perlin_elevation                : 0.05,
        color_saturation                : 0.8,
        color_convergence               : 0.45,
        color_convergence_frequency_min : 30,
        color_convergence_frequency_max : 70
    },

    construct : function( options )
    {
        this._super( options );

        // Set up
        this.registry   = new B.Tools.Registry();
        this.ticker     = new B.Tools.Ticker();
        this.scene      = this.registry.get( 'scene' );
        this.microphone = this.registry.get( 'microphone' );
        this.stats      = this.registry.get( 'stats' );
        this.width      = 400;
        this.depth      = 400;
        this.count      = 60;

        this.line           = {};
        this.line.type      = 'strips';
        this.line.thickness = 0.08;
        this.line.materials = {};
        this.line.materials.basic    = new THREE.MeshBasicMaterial( { color : 0xffffff, wireframe : false } );
        this.line.materials.lambert  = new THREE.MeshLambertMaterial( { color : 0xffffff, wireframe : false } );
        this.line.materials.shader_x = new THREE.ShaderMaterial( {
            wireframe      : false,
            vertexShader   : shader_grid_vertex,
            fragmentShader : shader_grid_fragment,
            transparent    : true,
            side           : THREE.DoubleSide,
            uniforms       :
            {
                uDirection :
                {
                    type  : 'i',
                    value : 1
                },
                uType :
                {
                    type  : 'i',
                    value : this.line.type === 'strips' ? 1 : 2
                },
                uTime :
                {
                    type  : 'f',
                    value : 0
                },
                uBottomFade :
                {
                    type : 'f',
                    value : this.options.bottom_fade
                },
                uElevationMultiplier :
                {
                    type : 'f',
                    value : this.options.elevation_multiplier
                },
                uElevationOffset :
                {
                    type : 'f',
                    value : this.options.elevation_offset
                },
                uPerlinElevation :
                {
                    type : 'f',
                    value : this.options.perlin_elevation
                },
                uColorSaturation :
                {
                    type : 'f',
                    value : this.options.color_saturation
                },
                uFrequency1 :
                {
                    type  : 'f',
                    value : 0
                },
                uFrequency2 :
                {
                    type  : 'f',
                    value : 0
                },
                uFrequency3 :
                {
                    type  : 'f',
                    value : 0
                },
                uFrequency4 :
                {
                    type  : 'f',
                    value : 0
                },
                uVolume :
                {
                    type  : 'f',
                    value : 0
                },
                uTimeDomain :
                {
                    type  : 'f',
                    value : 0
                },
                uStripsWidth :
                {
                    type  : 'f',
                    value : 0
                },
                uStripsColor :
                {
                    type  : 'c',
                    value : 0
                },
                uStripsColorConvergence :
                {
                    type  : 'f',
                    value : 0
                }
            },
        } );
        this.line.materials.shader_z = new THREE.ShaderMaterial( {
            wireframe      : false,
            vertexShader   : shader_grid_vertex,
            fragmentShader : shader_grid_fragment,
            transparent    : true,
            side           : THREE.DoubleSide,
            uniforms       :
            {
                uDirection :
                {
                    type  : 'i',
                    value : 2
                },
                uType :
                {
                    type  : 'i',
                    value : this.line.type === 'strips' ? 1 : 2
                },
                uTime :
                {
                    type  : 'f',
                    value : 0
                },
                uBottomFade :
                {
                    type : 'f',
                    value : this.options.bottom_fade
                },
                uElevationMultiplier :
                {
                    type : 'f',
                    value : this.options.elevation_multiplier
                },
                uElevationOffset :
                {
                    type : 'f',
                    value : this.options.elevation_offset
                },
                uPerlinElevation :
                {
                    type : 'f',
                    value : this.options.perlin_elevation
                },
                uColorSaturation :
                {
                    type : 'f',
                    value : this.options.color_saturation
                },
                uFrequency1 :
                {
                    type  : 'f',
                    value : 0
                },
                uFrequency2 :
                {
                    type  : 'f',
                    value : 0
                },
                uFrequency3 :
                {
                    type  : 'f',
                    value : 0
                },
                uFrequency4 :
                {
                    type  : 'f',
                    value : 0
                },
                uVolume :
                {
                    type  : 'f',
                    value : 0
                },
                uTimeDomain :
                {
                    type  : 'f',
                    value : 0
                },
                uStripsWidth :
                {
                    type  : 'f',
                    value : 0
                },
                uStripsColor :
                {
                    type  : 'c',
                    value : 0
                },
                uStripsColorConvergence :
                {
                    type  : 'f',
                    value : 0
                }
            },
        } );

        if( this.line.type === 'strips' )
            this.line.geometry  = new THREE.PlaneBufferGeometry( 1, this.depth, 1, 100 );
        else if( this.line.type === 'planes' )
            this.line.geometry  = new THREE.PlaneBufferGeometry( this.depth, this.depth, 100, 100 );

        this.object = new THREE.Object3D();
        // this.object.position.y -= 10;
        // this.object.rotation.x += Math.PI * 0.1;

        // Create strips
        if( this.line.type === 'strips' )
        {
            var i    = 0,
                line = null;
            for(i = 0; i < this.count; i++)
            {
                line = this.get_strip( i, 'x' );

                if( i !== 0 && i !== this.count )
                    this.object.add( line.mesh );
            }

            for(i = 0; i < this.count; i++)
            {
                line = this.get_strip( i, 'z' );

                if( i !== 0 && i !== this.count )
                    this.object.add( line.mesh );
            }
        }
        else
        {
            // Create meshs
            var plane_x = this.get_plane( 'x' );
                plane_z = this.get_plane( 'z' );

            this.object.add( plane_x.mesh );
            this.object.add( plane_z.mesh );
        }

        this.scene.object.add( this.object );

        this.init_events();
        this.init_debug();
    },

    /**
     * GET STRIP
     */
    get_plane: function( direction )
    {
        // Create mesh
        var mesh = new THREE.Mesh( this.line.geometry, this.line.materials[ 'shader_' + direction ] );

        // Position and rotate
        mesh.position.y = 0.001;
        mesh.rotation.x = - Math.PI * 0.5;

        return {
            mesh : mesh
        };
    },

    /**
     * GET STRIP
     */
    get_strip: function( index, direction )
    {
        // Create mesh
        var mesh = new THREE.Mesh( this.line.geometry, this.line.materials[ 'shader_' + direction ] );

        // Position and rotate
        mesh.position.y = 0.001;
        mesh.rotation.x = - Math.PI * 0.5;

        if( direction === 'x' )
        {
            // mesh.position.y = this.line.thickness * 0.5;
            mesh.position.x = index * ( this.width / this.count ) - this.width * 0.5;
        }
        else if( direction === 'z' )
        {
            // mesh.position.y = this.line.thickness * 0.5;
            mesh.position.z = index * ( this.width / this.count ) - this.width * 0.5;
            mesh.rotation.z = Math.PI * 0.5;
        }

        return {
            mesh : mesh
        };
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
        var folder = ui.addFolder( 'Grid' );
        folder.open();

        // Demo mode
        var demo_mode = folder.add( this.options.demo_mode, 'active' );
        demo_mode.name( 'demo mode' );
        demo_mode.onChange( function( value )
        {

        } );

        // Bottom fade
        var bottom_fade = folder.add( this.options, 'bottom_fade', 0, 200 );
        bottom_fade.name( 'bottom fade' );

        bottom_fade.onChange( function( value )
        {
            that.line.materials.shader_x.uniforms.uBottomFade.value = value;
            that.line.materials.shader_z.uniforms.uBottomFade.value = value;
        } );

        // Elevation multiplier
        var elevation_multiplier = folder.add( this.options, 'elevation_multiplier', 0, 5 ).step( 0.01 );
        elevation_multiplier.name( 'elevation mult.' );

        elevation_multiplier.onChange( function( value )
        {
            that.line.materials.shader_x.uniforms.uElevationMultiplier.value = value;
            that.line.materials.shader_z.uniforms.uElevationMultiplier.value = value;
        } );

        // Elevation offset
        var elevation_offset = folder.add( this.options, 'elevation_offset', -200, 200 ).step( 1 );
        elevation_offset.name( 'elevation offset' );

        elevation_offset.onChange( function( value )
        {
            that.line.materials.shader_x.uniforms.uElevationOffset.value = value;
            that.line.materials.shader_z.uniforms.uElevationOffset.value = value;
        } );

        // Perlin elevation
        var perlin_elevation = folder.add( this.options, 'perlin_elevation', -1, 1 ).step( 0.01 );
        perlin_elevation.name( 'perlin elevation' );

        perlin_elevation.onChange( function( value )
        {
            that.line.materials.shader_x.uniforms.uPerlinElevation.value = value;
            that.line.materials.shader_z.uniforms.uPerlinElevation.value = value;
        } );

        // Color saturation
        var color_saturation = folder.add( this.options, 'color_saturation', 0, 2 ).step( 0.01 ).listen();
        color_saturation.name( 'color saturation' );

        color_saturation.onChange( function( value )
        {
            that.line.materials.shader_x.uniforms.uColorSaturation.value = value;
            that.line.materials.shader_z.uniforms.uColorSaturation.value = value;
        } );

        // // Color convergence
        // var color_convergence = folder.add( this.options, 'color_convergence', 0, 1 ).step( 0.01 );
        // color_convergence.name( 'convergence' );

        // // Color convergence frequency min
        // var color_convergence_frequency_min = folder.add( this.options, 'color_convergence_frequency_min', 0, 100 ).step( 1 );
        // color_convergence_frequency_min.name( 'conv. freq. min.' );

        // // Color convergence frequency max
        // var color_convergence_frequency_max = folder.add( this.options, 'color_convergence_frequency_max', 0, 100 ).step( 1 );
        // color_convergence_frequency_max.name( 'conv. freq. max.' );
    },

    /**
     * FRAME
     */
    frame : function( infos )
    {
        this.line.materials.shader_x.uniforms.uTime.value = this.microphone.time;
        this.line.materials.shader_z.uniforms.uTime.value = this.microphone.time;

        // Demo mode
        if( this.options.demo_mode.active )
        {
            this.line.materials.shader_x.uniforms.uFrequency1.value = Math.sin( infos.elapsed / 2100 ) / 20;
            this.line.materials.shader_z.uniforms.uFrequency1.value = Math.sin( infos.elapsed / 2100 ) / 20;
            this.line.materials.shader_x.uniforms.uFrequency2.value = Math.sin( infos.elapsed / 2100 + 1 ) / 25;
            this.line.materials.shader_z.uniforms.uFrequency2.value = Math.sin( infos.elapsed / 2100 + 1 ) / 25;
            this.line.materials.shader_x.uniforms.uFrequency3.value = Math.sin( infos.elapsed / 2100 + 2 ) / 30;
            this.line.materials.shader_z.uniforms.uFrequency3.value = Math.sin( infos.elapsed / 2100 + 2 ) / 30;
            this.line.materials.shader_x.uniforms.uFrequency4.value = Math.sin( infos.elapsed / 2100 + 3 ) / 40;
            this.line.materials.shader_z.uniforms.uFrequency4.value = Math.sin( infos.elapsed / 2100 + 3 ) / 40;
            this.line.materials.shader_x.uniforms.uTimeDomain.value = Math.sin( infos.elapsed / 1900 ) / 20 + Math.cos( infos.elapsed / 800 ) / 30 + 0.1;
            this.line.materials.shader_z.uniforms.uTimeDomain.value = Math.sin( infos.elapsed / 1900 ) / 20 + Math.cos( infos.elapsed / 800 ) / 30 + 0.1;
            this.line.materials.shader_x.uniforms.uVolume.value = ( Math.sin( infos.elapsed / 2000 ) + Math.cos( infos.elapsed / 600 ) + Math.cos( infos.elapsed / 250 ) + 3 ) / 3 + 0;
            this.line.materials.shader_z.uniforms.uVolume.value = ( Math.sin( infos.elapsed / 2000 ) + Math.cos( infos.elapsed / 600 ) + Math.cos( infos.elapsed / 250 ) + 3 ) / 3 + 0;
            this.line.materials.shader_x.uniforms.uElevationMultiplier.value = 1;
            this.line.materials.shader_z.uniforms.uElevationMultiplier.value = 1;
        }

        // Default mode (microphone)
        else
        {
            this.line.materials.shader_x.uniforms.uFrequency1.value = this.microphone.values.frequencies[ 0 ].smoothed / 4000;
            this.line.materials.shader_z.uniforms.uFrequency1.value = this.microphone.values.frequencies[ 0 ].smoothed / 4000;
            this.line.materials.shader_x.uniforms.uFrequency2.value = this.microphone.values.frequencies[ 1 ].smoothed / 4000;
            this.line.materials.shader_z.uniforms.uFrequency2.value = this.microphone.values.frequencies[ 1 ].smoothed / 4000;
            this.line.materials.shader_x.uniforms.uFrequency3.value = this.microphone.values.frequencies[ 2 ].smoothed / 4000;
            this.line.materials.shader_z.uniforms.uFrequency3.value = this.microphone.values.frequencies[ 2 ].smoothed / 4000;
            this.line.materials.shader_x.uniforms.uFrequency4.value = this.microphone.values.frequencies[ 3 ].smoothed / 4000;
            this.line.materials.shader_z.uniforms.uFrequency4.value = this.microphone.values.frequencies[ 3 ].smoothed / 4000;
            this.line.materials.shader_x.uniforms.uTimeDomain.value = Math.log( this.microphone.values.time_domain.smoothed ) / 50;
            this.line.materials.shader_z.uniforms.uTimeDomain.value = Math.log( this.microphone.values.time_domain.smoothed ) / 50;
            this.line.materials.shader_x.uniforms.uVolume.value = this.microphone.values.volume.smoothed * 0.04;
            this.line.materials.shader_z.uniforms.uVolume.value = this.microphone.values.volume.smoothed * 0.04;
            this.line.materials.shader_x.uniforms.uElevationMultiplier.value = this.options.elevation_multiplier;
            this.line.materials.shader_z.uniforms.uElevationMultiplier.value = this.options.elevation_multiplier;
            this.line.materials.shader_x.uniforms.uStripsWidth.value = this.microphone.values.volume.value * 5 + 0.2;
            this.line.materials.shader_z.uniforms.uStripsWidth.value = this.microphone.values.volume.value * 5 + 0.2;

            var color   = new THREE.Color(),
                average = this.microphone.values.frequency.average,
                max_hue = 1;

            average = ( average - this.options.color_convergence_frequency_min ) / ( this.options.color_convergence_frequency_max - this.options.color_convergence_frequency_min ) * max_hue;

            if( this.microphone.mode === 'recording' )
                this.stats.update_info( 'frequency average adapted', average );

            if( average < 0 )
                average = 0;
            else if( average > max_hue )
                average = max_hue;

            average = 1 - average;

            if( this.microphone.mode === 'recording' )
                this.stats.update_info( 'frequency average hue color', average );

            color.setHSL( average, 1, 0.5 );

            if( this.microphone.mode === 'recording' )
                this.stats.update_info( 'frequency average hexa color', color.getHexString() );

            var convergence = this.microphone.recording.progress * this.options.color_convergence;

            this.line.materials.shader_x.uniforms.uStripsColor.value = color;
            this.line.materials.shader_z.uniforms.uStripsColor.value = color;
            this.line.materials.shader_x.uniforms.uStripsColorConvergence.value = convergence;
            this.line.materials.shader_z.uniforms.uStripsColorConvergence.value = convergence;
        }
    }
} );
