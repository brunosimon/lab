class ParticlesImage
{
    constructor( options )
    {
        // Set up
        this.canvas         = options.canvas
        this.context        = options.context
        this.loadedCallback = options.loadedCallback

        this.loaded       = false
        this.image        = null
        this.qualityRatio = 0.1
        this.ratio        = 1
        this.padding      = 50

        if( options.src )
        {
            this.load( options.src )
        }
    }

    load( src )
    {
        this.loaded = false
        let image  = new Image()

        image.addEventListener( 'load', () =>
        {
            this.loaded = true

            this.setImage( image )
        } )

        image.src = src
    }

    setImage( image )
    {
        this.image = image

        this.setCoordinates()
        this.setImageData()

        this.getColorAtPoint( 200, 4 )

        this.loadedCallback.apply( this )
    }

    getColorAtPoint( x, y )
    {
        if( !this.loaded )
            return { r: 0, g:0, b: 0, a:1 }

        // Apply quality ratio
        x = Math.floor( x * this.qualityRatio * this.ratio )
        y = Math.floor( y * this.qualityRatio * this.ratio )

        let index = Math.floor( this.imageData.width * y + x ) * 4,
            r     = this.imageData.data[ index ],
            g     = this.imageData.data[ index + 1 ],
            b     = this.imageData.data[ index + 2 ],
            a     = this.imageData.data[ index + 3 ]

        return { r, g, b, a }
    }

    setCoordinates()
    {
        let widthRatio  = this.image.width / ( this.canvas.width - this.padding * 2 ),
            heightRatio = this.image.height / ( this.canvas.height - this.padding * 2 )
        
        this.ratio = 1

        if( widthRatio > 1 || heightRatio > 1 )
        {
            this.ratio = widthRatio > heightRatio ? widthRatio : heightRatio
        }

        this.width  = this.image.width / this.ratio
        this.height = this.image.height / this.ratio
        this.x      = Math.round( this.canvas.width * 0.5 - this.width * 0.5 )
        this.y      = Math.round( this.canvas.height * 0.5 - this.height * 0.5 )
    }

    setImageData()
    {
        // Set image coordinates with quality ratio
        let x      = 0,
            y      = 0,
            width  = this.width * this.ratio * this.qualityRatio,
            height = this.height * this.ratio * this.qualityRatio

        // Save previous image data on canvas
        let previousImageData = this.context.getImageData( x, y, width, height )

        // Set and save new image data
        this.context.drawImage( this.image, x, y, width, height )
        let newImageData = this.context.getImageData( x, y, width, height )

        // Put back previous canvas data
        this.context.putImageData( previousImageData, x, y )

        this.imageData = newImageData
    }

    draw()
    {
        this.context.drawImage( this.image, this.x, this.y, this.width, this.height )
    }
}

module.exports = ParticlesImage
