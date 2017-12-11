uniform float uTime;
uniform float uRandomSeed;

varying vec3 vPosition;
varying vec2 vUv;

void main()
{
    vec4 color = vec4(1.0);

    float time = uTime + uRandomSeed * 100000.0;

    float noiseA = cnoise(vec3(vUv.x * 10.0, 1.0, time * 0.0005)) + 0.5;
    float noiseB = cnoise(vec3(vUv.x * 100.0, 1.0, time * 0.0005)) + 0.5;
    float noiseC = cnoise(vec3(vUv.x * 200.0, 1.0, time * 0.0005)) + 0.5;
    float noiseFinal = noiseA * noiseB * noiseC + 0.1;

    color.a = noiseFinal;

    // Test
    color.rgb = vec3(noiseFinal);

    gl_FragColor = color;
}