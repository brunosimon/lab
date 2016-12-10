<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Vault</title>
    <link href='http://fonts.googleapis.com/css?family=Rationale' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="src/css/reset.css">
    <link rel="stylesheet" href="src/css/style.css">
    <link type="image/x-icon" href="favicon.ico" rel="icon"/>
    <link type="image/x-icon" href="favicon.ico" rel="shortcut icon"/>
</head>
<body>
    <canvas id="app"></canvas>

    <div class="ui">
        <div class="pointer"></div>
        <div class="loading-popin">
            <div class="title">loading</div>
            <div class="part">
                <div class="label">[<span class="percent">0</span>%]</div>
                <div class="bar">
                    <div class="progress"></div>
                </div>
            </div>
        </div>
        <div class="instructions-popin">
            <div class="inner">
                <div class="instruction camera"><i></i>Click and drag to rotate the camera</div>
                <div class="instruction fullscreen"><i></i>Press F key to go fullscreen</div>
                <div class="instruction move"><i></i>Use arrow keys to move</div>
                <a href="#" class="start">OK</a>
            </div>
        </div>
        <div class="quality-popin">
            <div class="title">Quality</div>
            <div class="qualities">
                <a href="#" class="low">LOW</a>
                <a href="#" class="high">HIGH</a>
            </div>
        </div>
        <div class="label">
            <i>?</i>
            <span class="text">Instructions</span>
        </div>
    </div>

    <!--
        By OutsideOfSociety
        Checkout here : http://oos.moxiecode.com
    -->
    <script type="x-shader/x-vertex" id="vertexshader">

        attribute float size;
        attribute float time;
        attribute vec3 customColor;
        uniform float globalTime;

        varying vec3 vColor;
        varying float fAlpha;

        void main() {

            vColor = customColor;

            vec3 pos = position;

            // time
            float localTime = time + globalTime;
            float modTime = mod( localTime, 1.0 );
            float accTime = modTime * modTime;

            pos.x += cos(modTime*8.0 + (position.z))*70.0;
            pos.z += sin(modTime*6.0 + (position.x))*100.0;

            fAlpha = (pos.z)/1800.0;

            vec3 animated = vec3( pos.x, pos.y * accTime, pos.z );

            vec4 mvPosition = modelViewMatrix * vec4( animated, 1.0 );

            gl_PointSize = min(150.0, size * ( 150.0 / length( mvPosition.xyz ) ) );

            gl_Position = projectionMatrix * mvPosition;

        }

    </script>

    <script type="x-shader/x-fragment" id="fragmentshader">

        uniform vec3 color;
        uniform sampler2D texture;

        varying vec3 vColor;
        varying float fAlpha;

        void main() {

            gl_FragColor = vec4( color * vColor, fAlpha );
            gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );

        }

    </script>

    <script src="src/js/libs/three/three.min.js"></script>
    <script src="src/js/libs/three/shaders/DotScreenShader.js"></script>
    <script src="src/js/libs/three/shaders/CopyShader.js"></script>
    <script src="src/js/libs/three/shaders/FXAAShader.js"></script>
    <script src="src/js/libs/three/shaders/FocusShader.js"></script>
    <script src="src/js/libs/three/shaders/RGBShiftShader.js"></script>
    <script src="src/js/libs/three/postprocessing/MaskPass.js"></script>
    <script src="src/js/libs/three/postprocessing/DotScreenPass.js"></script>
    <script src="src/js/libs/three/postprocessing/ShaderPass.js"></script>
    <script src="src/js/libs/three/postprocessing/RenderPass.js"></script>
    <script src="src/js/libs/three/postprocessing/EffectComposer.js"></script>

    <script src="src/js/libs/zepto.min.js"></script>
    <script src="src/js/libs/tweenlite/TweenLite.min.js"></script>
    <script src="src/js/libs/tweenlite/plugins/CSSPlugin.min.js"></script>
    <script src="src/js/libs/box2d.js"></script>
    <script src="src/js/libs/dat.gui.min.js"></script>
    <script src="src/js/libs/stats.min.js"></script>
    <script src="src/js/libs/request-animation-frame.js"></script>
    <script src="src/js/libs/underscore.js"></script>
    <script src="src/js/libs/class.class.js"></script>

    <script src="src/js/app/abstract.class.js"></script>
    <script src="src/js/app/app.class.js"></script>
    <script src="src/js/app/renderer.class.js"></script>
    <script src="src/js/app/world.class.js"></script>
    <script src="src/js/app/screen.class.js"></script>
    <script src="src/js/app/collision.class.js"></script>
    <script src="src/js/app/models.class.js"></script>
    <script src="src/js/app/lights.class.js"></script>
    <script src="src/js/app/particles.class.js"></script>
    <script src="src/js/app/player.class.js"></script>
    <script src="src/js/app/camera.class.js"></script>
    <script src="src/js/app/skybox.class.js"></script>
    <script src="src/js/app/controller.class.js"></script>
    <script src="src/js/app/keyboard.class.js"></script>
    <script src="src/js/app/mouse.class.js"></script>
    <script src="src/js/app/ticker.class.js"></script>
    <script src="src/js/app/ui.class.js"></script>
    <script src="src/js/app/sound_system.class.js"></script>

    <script type="text/javascript">

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-49805367-5', 'svalbardglobalseedvault.com');
        ga('send', 'pageview');


        var app = new APP.App({
            canvas           : document.getElementById('app'),
            collision_canvas : document.getElementById('collision-debug'),
            origin           : '<?php echo !empty($_GET['origin']) ? $_GET['origin'] : 'default'; ?>'
        });

    </script>
</body>
</html>
