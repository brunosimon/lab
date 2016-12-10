class Canvas

    constructor: (particles,attractions) ->

        @main        = document.getElementById 'canvas'
        @context     = @main.getContext '2d'
        @particles   = particles
        @attractions = attractions

        @init_resize()

    init_resize: ->

        resize = =>
            @main.width  = window.innerWidth
            @main.height = window.innerHeight

        window.onresize = resize
        resize()


    update: ->

        # Fade
        @context.globalAlpha = 0.05
        @context.fillStyle = '#000000'
        @context.fillRect 0, 0, @main.width, @main.height
        @context.globalAlpha = 1

        # Particles
        @context.fillStyle = '#fff'
        @context.strokeStyle = '#fff'
        @context.lineCap = 'round'
        for particle in @particles
            @context.lineWidth = particle.radius
            @context.beginPath()
            @context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
            @context.fill()
            # @context.moveTo(particle.old_position.x,particle.old_position.y)
            # @context.lineTo(particle.x,particle.y)
            # @context.stroke()

        # # Attractions
        # @context.strokeStyle = '#ffffff'
        # for attraction in @attractions
        #     @context.beginPath()
        #     @context.arc(attraction.x, attraction.y, attraction.radius, 0, Math.PI * 2)
        #     @context.stroke()
