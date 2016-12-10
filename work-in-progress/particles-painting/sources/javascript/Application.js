class Application
{
    constructor( options )
    {
        this.loop    = this.loop.bind( this )
        this.resize  = this.resize.bind( this )
        
        this.time          = {}
        this.time.start    = + new Date()
        this.time.current  = this.time.start
        this.time.inactive = 0
        this.time.active   = 0
        this.time.offset   = 0

        // Start
        this.setParticlesPainting()
        this.handleTabActive()
        this.handleResize()
        this.setStats()
        this.setTweaker()
        this.loop()
    }

    setParticlesPainting()
    {
        // Set up
        this.particlesPainting = new ParticlesPainting( {
            canvas : document.querySelector( '.particles' )
        } )

        // Reset on click
        this.particlesPainting.canvas.addEventListener( 'click', () =>
        {
            this.particlesPainting.startRandom()
        } )
    }

    handleTabActive()
    {
        this.tabActive = true

        window.addEventListener( 'focus', () =>
        {
            this.tabActive = true
        } )

        window.addEventListener( 'blur', () =>
        {
            this.tabActive = false
        } )
    }

    loop()
    {
        window.requestAnimationFrame( this.loop )

        // Update time
        let time = + new Date()
        this.time.offset  = time - this.time.current
        this.time.current = time

        if( this.tabActive )
        {
            this.time.active += this.time.offset
        }
        else
        {
            this.time.inactive += this.time.offset
        }

        if( !this.tabActive )
        {
            return
        }

        // Stats
        this.stats( 'frame' ).end()
        this.stats( 'FPS' ).frame();

        // Update particles
        this.particlesPainting.update( this.time )

        // Stats
        this.stats( 'frame' ).start()
        this.stats().update()
    }

    handleResize()
    {
        window.addEventListener( 'resize', this.resize )

        this.resize()
    }

    resize()
    {
        // Set up
        this.width  = window.innerWidth
        this.height = window.innerHeight

        this.particlesPainting.resize( this.width, this.height )
    }

    setStats()
    {
        this.stats = new rStats( { CSSPath: 'sources/vendors/rstats/' } )
    }

    setTweaker()
    {
        this.tweaker = new dat.GUI()

        this.tweaker.add( this.particlesPainting, 'drawImage' )
                    .name( 'draw image' )
                    .onFinishChange( () =>
                    {
                        this.particlesPainting.reset()
                    } )

        this.tweaker.add( this.particlesPainting, 'attenuation' )
                    .min( 0 )
                    .max( 0.1 )
                    .step( 0.01 )
                    .name( 'attenuation' )
                    .onFinishChange( () =>
                    {
                        this.particlesPainting.reset()
                    } )

        this.tweaker.add( this.particlesPainting, 'density' )
                    .min( 0 )
                    .max( 0.1 )
                    .step( 0.001 )
                    .name( 'density' )
                    .onFinishChange( () =>
                    {
                        this.particlesPainting.reset()
                    } )

        this.tweaker.add( this.particlesPainting, 'maxSpeed' )
                    .min( 0 )
                    .max( 0.1 )
                    .step( 0.001 )
                    .name( 'max speed' )
                    .onFinishChange( () =>
                    {
                        this.particlesPainting.reset()
                    } )

        this.tweaker.add( this.particlesPainting, 'rotationSpeed' )
                    .min( 0 )
                    .max( 0.1 )
                    .step( 0.001 )
                    .name( 'rotation speed' )
                    .onFinishChange( () =>
                    {
                        this.particlesPainting.reset()
                    } )

        this.tweaker.add( this.particlesPainting, 'rotationChangeChances' )
                    .min( 0 )
                    .max( 1 )
                    .step( 0.001 )
                    .name( 'rotation changes' )
                    .onFinishChange( () =>
                    {
                        this.particlesPainting.reset()
                    } )

        this.tweaker.add( this.particlesPainting, 'radius' )
                    .min( 0 )
                    .max( 20 )
                    .step( 1 )
                    .name( 'radius' )
                    .onFinishChange( () =>
                    {
                        this.particlesPainting.reset()
                    } )

        this.tweaker.add( this.particlesPainting, 'reset' )
                    .name( 'reset' )

        this.tweaker.add( this.particlesPainting, 'startRandom' )
                    .name( 'reset random' )
    }
}
