class Attraction

    constructor: ->

        @radius = 50 + Math.round( Math.random() * 200 )
        @x = @radius + Math.round( Math.random() * (window.innerWidth - @radius * 2))
        @y = @radius + Math.round( Math.random() * (window.innerHeight - @radius * 2))
        # @x = Math.round( window.innerWidth / 2 )
        # @y = Math.round( window.innerHeight / 2 )
        @strength = 1
        # @direction = Math.random() > 0.5 ? 1 : -1
        @direction = -1

    get_speed: (particle) ->

        x         = particle.x - @x
        y         = particle.y - @y
        angle     = Math.atan2(x,y)
        tan_angle = angle += Math.PI * 0.5 * @direction
        distance  = Math.sqrt(Math.pow(x,2),Math.pow(y,2))

        speed = {
            x : 0
            y : 0
        }

        if distance > @radius
            speed

        else
            strength = (1 - (distance / @radius)) * @strength
            speed.x = Math.sin(tan_angle) * strength
            speed.y = Math.cos(tan_angle) * strength
            speed
