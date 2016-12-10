class App

    # Constructor
    constructor: ->

        @init_attractions()
        @init_particles()
        @init_canvas()
        @init_events()

    # Init attractions
    init_attractions: ->

        @attractions = []

        for i in [0...10]
            @attractions.push new Attraction

    # Init particles
    init_particles: ->

        @particles = []

        for i in [0...1000]
            @particles.push new Particle(@attractions)

    # Init canvas
    init_canvas: ->

        @canvas = new Canvas(@particles,@attractions)

    # Init events
    init_events: ->

        time         = {}
        time.ref     = +new Date
        time.elapsed = 0

        frame = =>

            # RAF
            window.requestAnimationFrame frame

            # Time
            current_time = +new Date
            time.elapsed = (current_time - time.ref) / 1000
            time.ref     = current_time

            # update canvas
            @canvas.update()

            # update particles
            for particle in @particles
                particle.update(time.elapsed)

        frame()


app = new App
