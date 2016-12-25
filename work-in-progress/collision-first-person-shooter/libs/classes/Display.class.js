var Display = Abstract.extend({

    // ---------------------------------------------------------------------------
    // INIT
    // ---------------------------------------------------------------------------
     
    init: function()
    {
        this.init_params();
        this.init_style();
        this.init_interact();
        this.init_fullscreen_pointer_lock();
    },
    


    // ---------------------------------------------------------------------------
    // PARAMS
    // ---------------------------------------------------------------------------

    init_params: function()
    {
        //Elements
        this.body      = document.getElementsByTagName('body')[0];
        this.html      = document.getElementsByTagName('html')[0];
        this.container = document.getElementById('container');

        this.update_width();
        this.update_height();
    },

    update_width: function()
    {
        this.width = window.innerWidth;
    },

    update_height: function()
    {
        this.height = window.innerHeight;
    },
    


    // ---------------------------------------------------------------------------
    // STYLE
    // ---------------------------------------------------------------------------

    init_style: function()
    {
        this.body.setAttribute('style','padding:0;margin:0;width:100%;height:100%;overflow:hidden;');
        this.html.setAttribute('style','padding:0;margin:0;width:100%;height:100%;overflow:hidden;');
        this.container.setAttribute('style','padding:0;margin:0;width:100%;height:100%;overflow:hidden;');
    },
    


    // ---------------------------------------------------------------------------
    // INTERACT
    // ---------------------------------------------------------------------------

    init_interact: function()
    {
        var that = this;

        //SELECT
        this.container.onselectstart = function()
        {
            return false;
        };

        //RESIZE
        window.onresize = function()
        {
            that.update_width();
            that.update_height();
            that.trigger('resize');
        };
    },
    


    // ---------------------------------------------------------------------------
    // LOCK POINTER + FULLSCREEN
    // ---------------------------------------------------------------------------

    init_fullscreen_pointer_lock: function()
    {
        this.fullscreen_change();
        this.pointer_lock_change();

        document.addEventListener('fullscreenchange',this.fullscreen_change.bind(this),false);
        document.addEventListener('mozfullscreenchange',this.fullscreen_change.bind(this),false);
        document.addEventListener('webkitfullscreenchange',this.fullscreen_change.bind(this),false);

        document.addEventListener('pointerlockchange',this.pointer_lock_change.bind(this),false);
        document.addEventListener('mozpointerlockchange',this.pointer_lock_change.bind(this),false);
        document.addEventListener('webkitpointerlockchange',this.pointer_lock_change.bind(this),false);

        document.addEventListener('pointerlockerror',this.pointer_lock_error.bind(this),false);
        document.addEventListener('mozpointerlockerror',this.pointer_lock_error.bind(this),false);
        document.addEventListener('webkitpointerlockerror',this.pointer_lock_error.bind(this),false);
    },

    toggle_lock_pointer_and_fullscreen: function()
    {
        if(this.fullscreen)
            this.leave_lock_pointer_and_fullscreen();
        else
            this.enter_lock_pointer_and_fullscreen();
    },
    
    enter_lock_pointer_and_fullscreen: function()
    {
        this.container.requestFullscreen = this.container.requestFullscreen    ||
                                           this.container.mozRequestFullscreen ||
                                           this.container.mozRequestFullScreen ||
                                           this.container.webkitRequestFullscreen;
        this.container.requestFullscreen();
    },
    
    leave_lock_pointer_and_fullscreen: function()
    {
        document.webkitCancelFullScreen();
        // this.container.cancelFullscreen = document.cancelFullScreen    ||
        //                                   document.mozCancelFullscreen ||
        //                                   document.mozCancelFullScreen ||
        //                                   document.webkitCancelFullScreen;
        // this.container.cancelFullscreen();
    },

    fullscreen_change: function()
    {
        if(document.webkitFullscreenElement === this.container ||
           document.mozFullscreenElement    === this.container ||
           document.mozFullScreenElement    === this.container )
        {
            this.container.requestPointerLock = this.container.requestPointerLock    ||
                                                this.container.mozRequestPointerLock ||
                                                this.container.webkitRequestPointerLock;
            
            this.fullscreen = true;
            this.trigger('fullscreen_change');
            this.trigger('fullscreen_enter');
            this.container.requestPointerLock();
        }
        else
        {
            this.fullscreen = false;
            this.trigger('fullscreen_change');
            this.trigger('fullscreen_leave');
        }
    },

    pointer_lock_change: function()
    {
        if (document.mozPointerLockElement    === this.container ||
            document.webkitPointerLockElement === this.container )
        {
            this.pointer_locked = true;
            this.trigger('pointer_lock_change');
            this.trigger('pointer_lock_enter');
        }
        else
        {
            this.pointer_locked = false;
            this.trigger('pointer_lock_change');
            this.trigger('pointer_lock_leave');
        }
    },

    pointer_lock_error: function()
    {
        this.trigger('pointer_lock_error');
    }
});