APP.conf =
{
    canvas      : document.getElementById('canvas'),
    pixel_ratio : window.devicePixelRatio,
    clock       : new THREE.Clock(true),
    rS          : new rStats({
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
            },
            render :
            {
                caption : 'Render (ms)',
                average : true
            }
        }
    })
};