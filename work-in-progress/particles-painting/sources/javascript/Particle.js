class Particle
{
    constructor( options )
    {
        // Set up
        this.canvas                = options.canvas
        this.context               = options.context
        this.x                     = options.x
        this.y                     = options.y
        this.speed                 = options.speed
        this.rotationSpeed         = options.rotationSpeed
        this.rotationChangeChances = options.rotationChangeChances
        this.rotationDirection     = 1
        this.orientation           = options.orientation
        this.color                 = options.color
        this.radius                = options.radius
        this.fillStyle             = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`
    }

    update( time )
    {
        // Change to change orientation
        this.rotationDirection *= Math.random() < this.rotationChangeChances ? - 1 : 1

        // Update orientation
        this.orientation += this.rotationDirection * time.offset * this.rotationSpeed

        // Update position
        this.x += Math.sin( this.orientation ) * this.speed * time.offset
        this.y += Math.cos( this.orientation ) * this.speed * time.offset

        // Draw
        this.context.fillStyle = this.fillStyle
        this.context.beginPath()
        this.context.arc( this.x, this.y, this.radius, 0, Math.PI * 2 )
        this.context.fill()
    }
}
