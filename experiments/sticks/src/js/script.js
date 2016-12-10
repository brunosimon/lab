var container       = document.querySelectorAll('.sticks-container'),
    frag            = document.createDocumentFragment()
    sticks          = [],
    stick_container = null,
    i               = null,
    len             = null,
    rows            = null,
    lines           = null,
    transform       = null,
    x               = null,
    y               = null,
    a               = null,
    h               = null
    win             =
    {
        width  : window.innerWidth,
        height : window.innerHeight
    },
    mouse =
    {
        x : 0,
        y : 0
    },
    conf =
    {
        distance_between : 50,
        length           : 20,
        thickness        : 2,
        multiplier       : 1,
        offset           : 40,
        angle            : 0.4,
        centers_visible  : false,
        animation_auto   : false
    };

/**
 * STATS
 */
var rS = new rStats({
    CSSPath : 'src/css/',
    values  :
    {
        raf :
        {
            caption : 'RAF (ms)',
            over    : 25,
            average : true
        },
        fps :
        {
            caption : 'Framerate (FPS)',
            below   : 50,
            average : true
        }
    }
});

/**
 * GUI
 */
var gui    = new dat.GUI(),
    values =
    {
        distance_between : gui.add(conf,'distance_between',20,100).step(1),
        length           : gui.add(conf,'length',1,100).step(1),
        thickness        : gui.add(conf,'thickness',1,10).step(1),
        multiplier       : gui.add(conf,'multiplier',1,10).step(0.1),
        offset           : gui.add(conf,'offset',-100,100).step(1),
        angle            : gui.add(conf,'angle',-1,1).step(0.1),
        centers_visible  : gui.add(conf,'centers_visible'),
        animation_auto   : gui.add(conf,'animation_auto')
    };

values.distance_between.onFinishChange(function(value)
{
    create_dom();
});

values.length.onFinishChange(function(value)
{
    i   = 0;
    len = sticks.length;
    for(; i < rows * lines; i++)
    {
        stick_container = sticks[i];
        stick           = stick_container.childNodes[0];

        // CSS
        stick.style.width  = conf.thickness + 'px';
        stick.style.height = conf.length + 'px';
        stick.style.top    = Math.round(- conf.length / 2) + 'px';
        stick.style.left   = Math.round(- conf.thickness / 2) + 'px';
    }
});

values.thickness.onFinishChange(function(value)
{
    i   = 0;
    len = sticks.length;
    for(; i < rows * lines; i++)
    {
        stick_container = sticks[i];
        stick           = stick_container.childNodes[0];

        // CSS
        stick.style.width  = conf.thickness + 'px';
        stick.style.height = conf.length + 'px';
        stick.style.top    = Math.round(- conf.length / 2) + 'px';
        stick.style.left   = Math.round(- conf.thickness / 2) + 'px';
    }
});

values.centers_visible.onFinishChange(function(value)
{
    if(conf.centers_visible)
        container[0].classList.add('centers-visible');
    else
        container[0].classList.remove('centers-visible');
});

/**
 * CREATE DOM
 */
function create_dom()
{
    sticks = [];
    container[0].innerHTML = '';

    // Calculate rows/lines
    rows  = Math.floor(win.width / conf.distance_between);
    lines = Math.floor(win.height / conf.distance_between);
    i     = 0;

    for(; i < rows * lines; i++)
    {
        // Create stick container element
        stick_container = document.createElement('span');
        stick_container.classList.add('stick-container');

        // Container CSS
        x = (i % rows) * conf.distance_between + conf.distance_between / 2;
        y = Math.floor(i / rows) * conf.distance_between + conf.distance_between / 2;

        transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
        stick_container.style.webkitTransform = transform;
        stick_container.style.mozTransform    = transform;
        stick_container.style.oTransform      = transform;
        stick_container.style.transform       = transform;

        // Create stick
        stick = document.createElement('span');
        stick_container.appendChild(stick);

        // Stick CSS
        stick.style.width  = conf.thickness + 'px';
        stick.style.height = conf.length + 'px';
        stick.style.top    = Math.round(- conf.length / 2) + 'px';
        stick.style.left   = Math.round(- conf.thickness / 2) + 'px';

        // Add to fragment
        frag.appendChild(stick_container);

        // Add to sticks array
        sticks.push(stick_container);
    }

    container[0].appendChild(frag);
}
create_dom();

/**
 * EVENTS
 */
window.onresize = function()
{
    win.width  = window.innerWidth;
    win.height = window.innerHeight;

    create_dom();
};

window.onmousemove = function(e)
{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};

/**
 * RAF
 */
var loop = function()
{
    window.requestAnimationFrame(loop);

    // Stats
    rS('raf').tick();
    rS('fps').frame();
    rS().update();

    // Animation auto
    if(conf.animation_auto)
    {
        mouse.x = Math.sin(+(new Date()) / 1000) * win.width / 4 + win.width / 2;
        mouse.y = Math.sin(+(new Date()) / 500) * win.height / 4 + win.height / 2;
    }

    // Update stickes
    i   = 0;
    len = sticks.length;
    for(; i < rows * lines; i++)
    {
        stick_container = sticks[i];
        stick           = stick_container.childNodes[0];

        x = (i % rows) * conf.distance_between + conf.distance_between / 2;
        y = Math.floor(i / rows) * conf.distance_between + conf.distance_between / 2;
        a = Math.atan2(mouse.y - y, mouse.x - x) * conf.multiplier - Math.PI * (conf.angle + 0.5);
        h = Math.sqrt(Math.pow(mouse.y - y,2) + Math.pow(mouse.x - x,2));

        transform = 'rotate(' + a + 'rad) translateY(' + (conf.offset) + 'px)';
        // transform = 'rotate(' + a + 'rad) translateX(50px)';
        stick.style.webkitTransform = transform;
        stick.style.mozTransform    = transform;
        stick.style.oTransform      = transform;
        stick.style.transform       = transform;
    }

};
loop();
