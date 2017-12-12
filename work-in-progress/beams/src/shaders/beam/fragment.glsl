uniform float uTime;
uniform float uRandomSeed;
uniform sampler2D uGradient;

varying vec3 vPosition;
varying vec2 vUv;

void main()
{
    vec4 color = vec4(1.0);

    float time = uTime + uRandomSeed * 100000.0;

    float noiseA = (cnoise(vec3(vUv.x * 10.0, vUv.y * 0.2 - time * 0.0005, 0.0)) + 0.5) * 1.5;
    float noiseB = (cnoise(vec3(vUv.x * 100.0, vUv.y * 2.0 - time * 0.0005, 0.0)) + 0.5) * 1.0;
    float noiseC = (cnoise(vec3(vUv.x * 200.0, vUv.y * 4.0 - time * 0.0005, 0.0)) + 0.5) * 1.0;
    float noiseFinal = noiseA * noiseB * noiseC + 0.1;

    color.a = noiseFinal;

    // Test
    // color.rgb = vec3(noiseFinal);
    color.rgb = vec3(texture2D(uGradient, vec2(clamp(noiseFinal, 0.0, 1.0), 0.0)));

    gl_FragColor = color;
}
