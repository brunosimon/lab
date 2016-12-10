class ParticlesPainting
{
    constructor( options )
    {
        // Set up
        this.width                 = window.innerWidth
        this.height                = window.innerHeight
        this.tweaker               = options.tweaker
        this.canvas                = options.canvas
        this.context               = this.canvas.getContext( '2d' )
        this.particles             = []
        this.drawImage             = true
        this.attenuation           = 0
        this.density               = 0.01
        this.maxSpeed              = 0.015
        this.rotationSpeed         = 0.01
        this.rotationChangeChances = 0.1
        this.radius                = 2
        this.image                 = new ParticlesImage( {
            canvas        : this.canvas,
            context       : this.context,
            loadedCallback: () =>
            {
                this.clear()

                if( this.drawImage )
                {
                    this.image.draw()
                }

                this.setParticles()
            }
        } )

        this.startRandom()
    }

    // start( src )
    // {
    //     this.image.load( src )
    // }

    reset()
    {
        this.image.load( this.image.image.src )
    }

    startRandom()
    {
        let randomIndex = Math.floor( Math.random() * 7 ),
            src         = `sources/images/image-${randomIndex}.jpg`

        this.image.load( src )
    }

    resize( width, height )
    {
        // Set up
        this.width  = width
        this.height = height

        // Update canvas
        this.canvas.width  = this.width
        this.canvas.height = this.height

        // Clear
        this.clear()

        // Restart with same image
        this.reset()
    }

    setParticles()
    {
        // Reset particles
        this.particles = []

        // Calculate particles count
        let pixels         = this.image.width * this.image.height,
            particlesCount = pixels * this.density

        // Create multiple particles
        for( let i = 0; i < particlesCount; i++ )
        {
            // Create particle
            let x = Math.ceil( this.image.width * Math.random() ),
                y = Math.ceil( this.image.height * Math.random() )

            let particle = new Particle( {
                canvas               : this.canvas,
                context              : this.context,
                x                    : this.image.x + x,
                y                    : this.image.y + y,
                speed                : this.maxSpeed * Math.random(),
                rotationSpeed        : this.rotationSpeed,
                rotationChangeChances: this.rotationChangeChances,
                radius               : this.radius,
                orientation          : Math.PI * 2 * Math.random(),
                color                : this.image.getColorAtPoint( x, y )
            } )

            // Save
            this.particles.push( particle )
        }
    }

    clear()
    {
        // Full clear
        // this.context.clearRect( 0, 0, this.width, this.height )

        // Color clear
        this.context.fillStyle = 'rgba(0, 0, 0, 1)'
        this.context.fillRect( 0, 0, this.width, this.height )
    }

    update( time )
    {
        // Clear
        if( this.attenuation )
        {
            this.context.fillStyle = 'rgba(0, 0, 0, ' + this.attenuation + ')'
            this.context.fillRect( 0, 0, this.width, this.height )
        }

        // Update each particle
        for( let particle of this.particles )
        {
            particle.update( time )
        }
    }
}
