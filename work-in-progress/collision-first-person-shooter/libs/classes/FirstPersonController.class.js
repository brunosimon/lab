var FirstPersonController = Abstract.extend({

    // ---------------------------------------------------------------------------
    // INIT
    // ---------------------------------------------------------------------------
     
    init: function(parent)
    {
        this.parent = parent;
        this.init_params();
        this.init_mouse();
        this.init_keyboard();
    },
    


    // ---------------------------------------------------------------------------
    // PARAMS
    // ---------------------------------------------------------------------------

    init_params: function()
    {
        this.display = this.parent.display;

        this.mouse            = {};
        this.mouse.x          = this.display.width/2;
        this.mouse.y          = this.display.height/2;
        this.mouse.ratio_x    = 0;
        this.mouse.ratio_y    = 0;
        this.mouse.movement_x = 0;
        this.mouse.movement_y = 0;
    },
    


    // ---------------------------------------------------------------------------
    // MOUSE
    // ---------------------------------------------------------------------------

    init_mouse: function()
    {
        var that = this;

        window.addEventListener('mousemove',function(e)
        {
            //Movement
            this.mouse.movement_x = e.movementX       ||
                                    e.mozMovementX    ||
                                    e.webkitMovementX ||
                                    0,
            this.mouse.movement_y = e.movementY       ||
                                    e.mozMovementY    ||
                                    e.webkitMovementY ||
                                    0;

            //Position
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            //Ratio
            this.mouse.ratio_x = (this.mouse.x / this.display.width) * 2 - 1;
            this.mouse.ratio_y = (this.mouse.y / this.display.height) * 2 - 1;

            this.trigger('mouse_change');

        }.bind(this),false);
    },
    


    // ---------------------------------------------------------------------------
    // KEYBOARD
    // ---------------------------------------------------------------------------

    init_keyboard: function()
    {
        var that = this;

        this.keyboard           = {};
        this.keyboard.up        = false;
        this.keyboard.down      = false;
        this.keyboard.left      = false;
        this.keyboard.right     = false;
        this.keyboard.ctrl      = false;
        this.keyboard.keys_down = [];

        //Keydown
        window.addEventListener('keydown',function(e)
        {
            var key_code  = e.keyCode,
                key_index = _.indexOf(this.keyboard.keys_down,key_code);

            if(key_index === -1)
                this.keyboard.keys_down.push(key_code);
            
            this.trigger('key_down');

            return false;
        }.bind(this),false);

        //Keyup
        window.addEventListener('keyup',function(e)
        {
            var key_code  = e.keyCode,
                key_index = _.indexOf(this.keyboard.keys_down,key_code);

            if(key_index !== -1)
                this.keyboard.keys_down.splice(key_index,1);
            
            this.trigger('key_up');

            return false;
        }.bind(this),false);

        this.display.on('fullscreen_change',function()
        {
            this.empty_keys_down();
        }.bind(this));

        this.on('key_down key_up fullscreen_change',function()
        {
            this.update_directions_keys();
        }.bind(this));
    },

    is_key_down: function(key_code)
    {
        var key_index = _.indexOf(this.keyboard.keys_down,key_code);
        return key_index === -1 ? false : true;
    },

    empty_keys_down: function()
    {
        this.keyboard.keys_down = [];
    },

    update_directions_keys: function()
    {
        this.keyboard.up    = this.is_key_down(90) || this.is_key_down(38) ? true : false; //UP
        this.keyboard.right = this.is_key_down(68) || this.is_key_down(39) ? true : false; //RIGHT
        this.keyboard.down  = this.is_key_down(83) || this.is_key_down(40) ? true : false; //DOWN
        this.keyboard.left  = this.is_key_down(81) || this.is_key_down(37) ? true : false; //LEFT
        this.keyboard.ctrl  = this.is_key_down(17) || this.is_key_down(17) ? true : false; //CTRL
    },
    


    // ---------------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------------

    update: function()
    {

    }
});