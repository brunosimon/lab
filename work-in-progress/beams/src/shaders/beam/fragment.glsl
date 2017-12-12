uniform float uTime;
uniform float uRandomSeed;
uniform sampler2D uGradient;

varying vec2 vUv;

void main()
{
    vec4 color = vec4(1.0);

    // Noise
    float noiseTime = uTime + uRandomSeed * 100000.0;

    float noiseA = (cnoise(vec3(vUv.x * 10.0, vUv.y * 0.2 - noiseTime * 0.0005, 0.0)) + 0.5) * 1.0;
    float noiseB = (cnoise(vec3(vUv.x * 100.0, vUv.y * 2.0 - noiseTime * 0.0005, 0.0)) + 0.5) * 1.0;

    noiseA = noiseA < 0.5 ? 0.0 : noiseA;
    noiseB = noiseB < 0.5 ? 0.0 : noiseB;

    float noiseFinal = noiseA * noiseB + 0.1;
    noiseFinal = clamp(noiseFinal, 0.0, 1.0);

    // Gradient
    float gradientX = (noiseFinal - 0.5) * (1.0 / 0.5);
    color.rgb = vec3(texture2D(uGradient, vec2(gradientX, 0.0)));

    // Alpha
    color.a = noiseFinal;

    // Test
    // color.rgb = vec3(noiseFinal);
    // color.rgb = vec3(noiseA);
    // color.rgb = vec3(noiseB);
    // color.rgb = vec3(noiseC);

    gl_FragColor = color;
}
