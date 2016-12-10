class Particle

    constructor: (attractions) ->

        @x           = Math.round( Math.random() * window.innerWidth )
        @y           = Math.round( Math.random() * window.innerHeight )
        @radius      = 5
        @attractions = attractions
        direction    = Math.PI * 2 * Math.random()
        @speed       = {
            x : Math.sin(direction) * 50
            y : Math.cos(direction) * 50
        }
        @old_position = {
            x : @x
            y : @y
        }

    update: (elapsed_time) =>

        @old_position.x = @x
        @old_position.y = @y

        @x += @speed.x * elapsed_time
        @y += @speed.y * elapsed_time

        for attraction in @attractions
            speed = attraction.get_speed(@)
            @x += speed.x
            @y += speed.y

        repositionned = false

        if @x > window.innerWidth + @radius
            repositionned = true
            @x = - @radius
        else if @x < - @radius
            repositionned = true
            @x = window.innerWidth + @radius

        if @y > window.innerHeight + @radius
            repositionned = true
            @y = - @radius
        else if @y < - @radius
            repositionned = true
            @y = window.innerHeight + @radius

        if(repositionned)
            @old_position.x = @x
            @old_position.y = @y

