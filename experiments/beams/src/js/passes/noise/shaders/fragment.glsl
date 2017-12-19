uniform sampler2D tDiffuse;
uniform float uStrength;
uniform float uRandom;

varying vec2 vUv;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture2D(tDiffuse, vUv);

    color.r += (rand(vUv + vec2(uRandom) + vec2(0.0)) - 0.5) * uStrength;
    color.g += (rand(vUv + vec2(uRandom) + vec2(1.0)) - 0.5) * uStrength;
    color.b += (rand(vUv + vec2(uRandom) + vec2(3.0)) - 0.5) * uStrength;

    gl_FragColor = color;
}