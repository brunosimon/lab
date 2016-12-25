var Player = Abstract.extend({

    // ---------------------------------------------------------------------------
    // INIT
    // ---------------------------------------------------------------------------
     
    init: function(parent)
    {
        this.parent = parent;
        this.init_params();

        this.parent.parent.on('tic',this.update.bind(this));
    },
    


    // ---------------------------------------------------------------------------
    // PARAMS
    // ---------------------------------------------------------------------------

    init_params: function()
    {
        this.pi  = Math.PI;
        this.pi2 = Math.PI / 2;

        this.game        = this.parent.parent;
        this.controller  = this.game.controller;
        this.display     = this.game.display;
        this.world       = this.parent;

        this.stand       = {};
        this.stand.min   = 120;
        this.stand.max   = 300;
        this.stand.up    = true;
        this.stand.speed = 30;

        this.rotation             = {};
        this.rotation.x           = 0;
        this.rotation.y           = this.pi;
        this.rotation.sensitivity = 300;

        this.position    = {};
        this.position.x  = 0;
        this.position.y  = this.stand.max;
        this.position.z  = 0;

        var that = this;

        this.controller.on('mouse_change',function()
        {
            if(that.display.fullscreen)
            {
                this.rotation.x -= this.controller.mouse.movement_y/this.rotation.sensitivity;
                this.rotation.y -= this.controller.mouse.movement_x/this.rotation.sensitivity;
            }
        }.bind(this));
    },



    // ---------------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------------

    update: function()
    {
        this.update_rotation();
        this.update_position();
    },

    update_rotation: function()
    {
        if(!this.display.pointer_locked)
        {
            this.rotation.x -= this.controller.mouse.ratio_y/30;
            this.rotation.y -= this.controller.mouse.ratio_x/30;
        }

        this.rotation.x = this.rotation.x < - this.pi2 ? this.rotation.x = - this.pi2 :
                          this.rotation.x > this.pi2 ? this.rotation.x = this.pi2 :
                          this.rotation.x;
    },

    update_position: function()
    {
        var player_coordinates = this.parent.engine.get_player_position();

        this.position.x = player_coordinates.x;
        this.position.z = player_coordinates.y;

        //Crounch
        this.position.y += this.controller.keyboard.ctrl ? -this.stand.speed : this.stand.speed;
        this.position.y = this.position.y < this.stand.min ? this.position.y = this.stand.min :
                          this.position.y > this.stand.max ? this.position.y = this.stand.max :
                          this.position.y;
    }
});