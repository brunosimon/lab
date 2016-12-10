var boxes_container = document.querySelectorAll('.boxes-container'),
    frag            = document.createDocumentFragment(),
    faces           = ['top','bottom','left','right','front','back'],
    boxes           = [],
    box             = null,
    span            = null,
    width           = 0,
    depth           = 0,
    t               = 0,
    x               = null,
    y               = null,
    conf            =
    {
        speed     : 4,
        amplitude : 100,
        frequency : 8,
        size      : 40,
        lines     : 9,
        rows      : 9,
        rotation  : true,
        algorithm : 'symetric sin'
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
        speed     : gui.add(conf,'speed',-20,20).step(1),
        amplitude : gui.add(conf,'amplitude',0,300).step(1),
        frequency : gui.add(conf,'frequency',0,20).step(1),
        size      : gui.add(conf,'size',1,100).step(2),
        lines     : gui.add(conf,'lines',1,21).step(1),
        rows      : gui.add(conf,'rows',1,21).step(1),
        algorithm : gui.add(conf,'algorithm',['symetric sin','symetric tan','sin','tan']),
        rotation  : gui.add(conf,'rotation')
    };

values.lines.onChange(function(value)
{
    create_dom();
});

values.rows.onChange(function(value)
{
    create_dom();
});

values.size.onChange(function(value)
{
    create_dom();
});

values.rotation.onChange(function(value)
{
    if(value)
        boxes_container[0].classList.add('rotation');
    else
        boxes_container[0].classList.remove('rotation');
});


/**
 * CREATE DOM
 */
function create_dom()
{
    width = conf.size * conf.lines;
    depth = conf.size * conf.rows;

    boxes = [];
    boxes_container[0].innerHTML = '';

    var half_size       = Math.round(conf.size / 2),
        transform_value = null;

    for(i = 0; i < conf.lines * conf.rows; i++)
    {
        // Create box element
        box = document.createElement('span');
        box.classList.add('box');

        // Each face
        faces.forEach(function(face)
        {
            // Create face element
            span = document.createElement('span');

            // Apply style
            switch(face)
            {
                case 'bottom':
                    transform_value       = 'rotateX(-90deg) rotateY(0deg) translateZ(' + half_size + 'px) translate3d(0,0,0)';
                    span.style.background = '#6f0000';
                    break;
                case 'top':
                    transform_value       = 'rotateX(90deg) rotateY(0deg) translateZ(' + half_size + 'px) translate3d(0,0,0)';
                    span.style.background = '#ff3535';
                    break;
                case 'left':
                    transform_value       = 'rotateX(0deg) rotateY(90deg) translateZ(' + half_size + 'px) translate3d(0,0,0)';
                    span.style.background = '#af0000';
                    break;
                case 'right':
                    transform_value       = 'rotateX(0deg) rotateY(-90deg) translateZ(' + half_size + 'px) translate3d(0,0,0)';
                    span.style.background = '#ff4545';
                    break;
                case 'front':
                    transform_value       = 'rotateX(0deg) rotateY(0deg) translateZ(' + half_size + 'px) translate3d(0,0,0)';
                    span.style.background = '#da0000';
                    break;
                case 'back':
                    transform_value       = 'rotateX(0deg) rotateY(180deg) translateZ(' + half_size + 'px) translate3d(0,0,0)';
                    span.style.background = '#da0000';
                    break;
            }

            span.style.webkitTransform = transform_value;
            span.style.mozTransform    = transform_value;
            span.style.oTransform      = transform_value;
            span.style.transform       = transform_value;
            span.style.width           = conf.size + 'px';
            span.style.height          = conf.size + 'px';

            box.appendChild(span);
        });

        boxes.push(box);
        frag.appendChild(box);
    }

    boxes_container[0].appendChild(frag);
}
create_dom();

/**
 * EVENTS
 */
var win = {
    width  : window.innerWidth,
    height : window.innerHeight,
};

window.onresize = function()
{
    win.width  = window.innerWidth;
    win.height = window.innerHeight;
};

window.onmousemove = function(e)
{
    if(!conf.rotation)
        boxes_container[0].style.transform = 'rotateX(-' + ((e.clientY / win.height) * 360 + 180) + 'deg) rotateY(' + (e.clientX / win.width) * 360 + 'deg)';
};

/**
 * RAF
 */
var loop = function()
{
    window.requestAnimationFrame(loop);

    rS('raf').tick();
    rS('fps').frame();

    rS().update();

    t -= conf.speed;

    var transform_value = null;

    for(i = 0; i < conf.lines * conf.rows; i++)
    {
        x   = i % conf.rows;
        z   = Math.floor(i / conf.rows);

        switch(conf.algorithm)
        {
            case 'symetric sin':
                y = Math.sin(t / 100 + (Math.abs(x - Math.floor(conf.rows / 2)) + Math.abs(z - Math.floor(conf.lines / 2))) / (20 / conf.frequency) ) * conf.amplitude;
                break;

            case 'symetric tan':
                y = Math.tan(t / 100 + (Math.abs(x - Math.floor(conf.rows / 2)) + Math.abs(z - Math.floor(conf.lines / 2))) / (20 / conf.frequency) ) * conf.amplitude;
                break;

            case 'sin':
                y = Math.sin(t / 100 + (x - Math.floor(conf.rows / 2)) / (20 / conf.frequency) ) * conf.amplitude;
                break;

            case 'tan':
                y = Math.tan(t / 100 + (x - Math.floor(conf.rows / 2)) / (20 / conf.frequency) ) * conf.amplitude;
                break;
        }


        box = boxes[i];

        y = Math.round(y);

        x = x * conf.size - width / 2;
        z = z * conf.size - depth / 2;

        transform_value = 'translateX(' + x + 'px) translateZ(' + z + 'px) translateY(' + y + 'px)';

        box.style.webkitTransform = transform_value;
        box.style.mozTransform    = transform_value;
        box.style.oTransform      = transform_value;
        box.style.transform       = transform_value;
    }
};
loop();
