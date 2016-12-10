(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.Spark = APP.CORE.Abstract.extend(
    {
        options :
        {
            preview_size : 120,
            texture_size : 20,
            disk_scale   : 0.4,
            disk_color   : '#ffcc28',
            glow_scale   : 0.4,
            glow_color   : '#ff0077'
        },

        /**
         * INIT
         */
        init: function( options )
        {
            this._super( options );

            // Create preview canvas
            this.canvas      = document.createElement( 'canvas' );
            this.context     = this.canvas.getContext( '2d' );

            this.canvas.width            = this.options.preview_size;
            this.canvas.height           = this.options.preview_size;

            this.canvas.style.top        = '46px';
            this.canvas.style.background = '#222';

            document.body.appendChild( this.canvas );

            // Create min canvas
            this.min_canvas  = document.createElement( 'canvas' );
            this.min_context = this.min_canvas.getContext( '2d' );

            this.min_canvas.width            = this.options.texture_size;
            this.min_canvas.height           = this.options.texture_size;
            this.min_canvas.style.top        = '46px';
            this.min_canvas.style.left       = this.options.preview_size + 'px';
            this.min_canvas.style.background = '#222';

            document.body.appendChild( this.min_canvas );

            // Texture
            this.texture = new THREE.Texture( this.min_canvas );

            // Draw
            this.draw();

            this.init_debug();
        },

        /**
         * DRAW
         */
        draw: function(params)
        {
            var that   = this,
                center = Math.round(this.options.preview_size) * 0.5;

            // Preview
            this.context.clearRect( 0, 0, this.options.preview_size, this.options.preview_size );
            this.context.fillStyle   = this.options.disk_color;
            this.context.shadowColor = this.options.glow_color;
            this.context.shadowBlur  = Math.round( this.options.preview_size * this.options.glow_scale );
            this.context.beginPath();
            this.context.arc( center, center, this.options.preview_size * this.options.disk_scale * 0.5, 0, Math.PI * 2 );
            this.context.fill();

            // Texture
            this.min_context.clearRect( 0, 0, this.options.texture_size, this.options.texture_size );
            this.min_context.drawImage( this.canvas, 0, 0, this.min_canvas.width, this.min_canvas.height );

            this.texture.needsUpdate = true;
        },

        /**
         * INIT DEBUG
         */
        init_debug: function()
        {
            var that   = this;
            this.debug = {};

            this.debug.instance = new APP.COMPONENTS.Debug();
            this.debug.folder   = this.debug.instance.gui.instance.addFolder( 'Snow flake' );
            this.debug.folder.open();

            this.debug.texture_size = this.debug.folder.add( this.options, 'texture_size', 10, 120 ).step( 1 ).name( 'texture size' );
            this.debug.disk_scale   = this.debug.folder.add( this.options, 'disk_scale', 0, 1 ).step( 0.001 ).name( 'disk scale' );
            this.debug.disk_color   = this.debug.folder.addColor( this.options, 'disk_color' ).name( 'disk color' );
            this.debug.glow_scale   = this.debug.folder.add( this.options, 'glow_scale', 0, 1 ).step( 0.001 ).name( 'glow scale' );
            this.debug.glow_color   = this.debug.folder.addColor( this.options, 'glow_color' ).name( 'glow color' );

            function change()
            {
                that.draw();
            }

            this.debug.disk_scale.onChange( change );
            this.debug.disk_color.onChange( change );
            this.debug.glow_scale.onChange( change );
            this.debug.glow_color.onChange( change );
            this.debug.texture_size.onChange( function( value )
            {
                that.min_canvas.width  = value;
                that.min_canvas.height = value;

                that.draw();
            } );
        }
    });
})();




