var Game = Abstract.extend({

    // ---------------------------------------------------------------------------
    // INIT
    // ---------------------------------------------------------------------------
     
    init: function()
    {
        this.init_params();
        this.init_display();
        this.init_controller();
        this.init_world();
        this.init_ticker();
    },
    


    // ---------------------------------------------------------------------------
    // PARAMS
    // ---------------------------------------------------------------------------

    init_params: function()
    {
        
    },
    


    // ---------------------------------------------------------------------------
    // DISPLAY
    // ---------------------------------------------------------------------------

    init_display: function()
    {
        this.display = new Display();
    },
    


    // ---------------------------------------------------------------------------
    // WORLD
    // ---------------------------------------------------------------------------

    init_world: function()
    {
        this.world = new World(this);
    },


    // ---------------------------------------------------------------------------
    // CONTROLLER
    // ---------------------------------------------------------------------------

    init_controller: function()
    {
        this.controller = new FirstPersonController(this);

        //keydown
        this.controller.on('key_down',function()
        {
            //F Down => Fullscreen
            if(this.controller.is_key_down(70))
                this.display.toggle_lock_pointer_and_fullscreen();
            
        }.bind(this));
    },
    


    // ---------------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------------

    update: function()
    {
        var date = new Date();
        this.delta = date - this.last_date;
        this.last_date = date;

        //Pointer free
        if(!this.display.pointer_locked && Math.abs(this.controller.mouse.ratio_y) + Math.abs(this.controller.mouse.ratio_x) > 0.05)
        {
            
        }
    },
    


    // ---------------------------------------------------------------------------
    // TICKER
    // ---------------------------------------------------------------------------

    init_ticker: function()
    {
        this.last_date = new Date();
        this.delta     = 0;
        this.tic();
    },

    tic: function()
    {
        this.update();

        this.trigger('tic');

        if(window.requestAnimationFrame)
            window.requestAnimationFrame(this.tic.bind(this));
        else if(window.webkitRequestAnimationFrame)
            window.webkitRequestAnimationFrame(this.tic.bind(this));
        else if(window.mozRequestAnimationFrame)
            window.mozRequestAnimationFrame(this.tic.bind(this));
        else if(window.oRequestAnimationFrame)
            window.oRequestAnimationFrame(this.tic.bind(this));
        else if(window.msRequestAnimationFrame)
            window.msRequestAnimationFrame(this.tic.bind(this));
        else
            window.setTimeout(this.tic.bind(this),1000/60);
    }
});