let ParticlesPainting = require( './ParticlesPainting.js' )

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
        this.handleDragAndDrop()
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
        this.particlesPainting.canvas.addEventListener( 'click', ( event ) =>
        {
            event.preventDefault()

            this.particlesPainting.startRandom()
        } )
    }

    handleDragAndDrop()
    {
        let $container = document.querySelector( '.container' )
        
        // Drag over event
        $container.addEventListener( 'dragover', ( event ) =>
        {
            // Prevent default
            event.stopPropagation()
            event.preventDefault()
        } )
        
        // Drag leave event
        $container.addEventListener( 'dragleave', ( event ) =>
        {
            // Remove class
            $container.classList.remove( 'draging' )
        } )
        
        // Drag enter event
        $container.addEventListener( 'dragenter', ( event ) =>
        {
            // Prevent default
            event.stopPropagation()
            event.preventDefault()

            // Add class
            $container.classList.add( 'draging' )
        } )

        // Drop event
        $container.addEventListener( 'drop', ( event ) =>
        {
            // Prevent default
            event.stopPropagation()
            event.preventDefault()

            // Remove class
            $container.classList.remove( 'draging' )

            // Retrieve files
            let files = event.dataTransfer.files

            if( files.length )
            {
                let file = files[ 0 ]

                if( file.type.match( /image.*/ ) )
                {
                    let reader = new FileReader()
                    
                    reader.onload = ( event ) =>
                    {
                        let image = document.createElement( 'img' )
                        image.src= event.target.result

                        this.particlesPainting.image.setImage( image )
                    }
                    
                    reader.readAsDataURL( file )
                }
            }
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

module.exports = Application
