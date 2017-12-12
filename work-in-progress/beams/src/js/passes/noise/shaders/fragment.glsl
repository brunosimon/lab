uniform sampler2D tDiffuse;

uniform float angle;
uniform float scale;
uniform float intensity;

varying vec2 vUv;
varying vec2 vUvPattern;

// float pattern()
// {
//     float s = sin(angle);
//     float c = cos(angle);

//     vec2 point = vec2(c * vUvPattern.x - s * vUvPattern.y, s * vUvPattern.x + c * vUvPattern.y) * scale;

//     return (sin(point.x) * sin(point.y)) * 4.0;
// }

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
    vec4 texel = texture2D(tDiffuse, vUv);
    vec3 color = texel.rgb;

    // #ifdef AVERAGE

    //     color = vec3((color.r + color.g + color.b) / 3.0);

    // #endif

    // color = vec3(color * 10.0 - 5.0 + pattern());
    // color = texel.rgb + (color - texel.rgb) * intensity;

    color.rgb += (rand(vUv) - 0.5) * 0.05;

    gl_FragColor = vec4(color, texel.a);
}