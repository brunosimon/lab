(function()
{
    'use strict';

    APP.COMPONENTS.WORLD.PLANET.Gradient_Texture = APP.CORE.Event_Emitter.extend(
    {
        options :
        {
            style :
            {
                width  : 300,
                height : 20,
                top    : 46,
                left   : 0,
                border : '10px solid #222'
            },
            items :
            {
                item_0 : { pos : 0.00, color : '#2d0000' },
                item_1 : { pos : 1.00, color : '#ff0000' },
            },
            debug :
            {
                enable : true,
                name   : 'Gradient',
                open   : false
            }
        },

        /**
         * INIT
         */
        init : function( options )
        {
            this._super( options );

            this.canvas  = document.createElement( 'canvas' );
            this.context = this.canvas.getContext( '2d' );

            this.canvas.width          = this.options.style.width;
            this.canvas.height         = this.options.style.height;
            this.canvas.style.position = 'absolute';
            this.canvas.style.top      = this.options.style.top + 'px';
            this.canvas.style.left     = this.options.style.left + 'px';
            this.canvas.style.border   = this.options.style.border;

            document.body.appendChild( this.canvas );

            this.texture = new THREE.Texture( this.canvas );

            this.update();
            this.init_debug();
        },

        /**
         * UPDATE
         */
        update: function()
        {
            var gradient = this.context.createLinearGradient( 0, 0, this.canvas.width, 0 );

            // Each stop color
            var keys = Object.keys( this.options.items );
            for( var i = 0, len = keys.length; i < len; i++ )
            {
                var key = keys[ i ];
                gradient.addColorStop( this.options.items[ key ].pos, this.options.items[ key ].color );
            }

            this.context.fillStyle = gradient;
            this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
            this.texture.needsUpdate = true;
        },

        /**
         * INIT DEBUG
         */
        init_debug: function()
        {
            if( !this.options.debug.enable )
                return;

            var that = this;

            this.debug = {};
            this.debug.instance = new APP.COMPONENTS.Debug();
            this.debug.instance.gui.texture = this.debug.instance.gui.instance.addFolder( this.options.debug.name );

            if( this.options.open )
                this.debug.instance.gui.texture.open();

            function update()
            {
                that.update();
            }

            // Each stop color
            var keys = Object.keys( this.options.items );
            for( var i = 0, len = keys.length; i < len; i++ )
            {
                var key = keys[ i ];

                this.debug[ key + '_pos' ]   = this.debug.instance.gui.texture.add( this.options.items[ key ], 'pos', 0, 1 ).step( 0.0001 ).name( '-' );
                this.debug[ key + '_color' ] = this.debug.instance.gui.texture.addColor( this.options.items[ key ], 'color' ).name( '-' );
                this.debug[ key + '_pos' ].onChange( update );
                this.debug[ key + '_color' ].onChange( update );
            }
        }
    });
})();
