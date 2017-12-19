uniform float uTime;
uniform float uRandomSeed;
uniform float uPerlinSpeed;
uniform vec2 uPerlinScale;
uniform sampler2D uGradient;
uniform float uAlpha;

varying vec2 vUv;

void main()
{
    vec4 color = vec4(1.0);

    // Noise
    float noiseTime = uTime + uRandomSeed * 100000.0;

    float noiseA = (cnoise(vec3(vUv.x * uPerlinScale.x * 10.0, vUv.y * uPerlinScale.y * 10.0 - noiseTime * 0.005 * uPerlinSpeed, 0.0)) + 0.5) * 1.0;
    float noiseB = (cnoise(vec3(vUv.x * uPerlinScale.x * 100.0, vUv.y * uPerlinScale.y * 100.0 - noiseTime * 0.005 * uPerlinSpeed, 0.0)) + 0.5) * 1.0;

    float limit = 0.25;

    noiseA = noiseA < limit ? 0.0 : noiseA;
    noiseB = noiseB < limit ? 0.0 : noiseB;

    float noiseFinal = noiseA * noiseB + 0.1;
    noiseFinal = clamp(noiseFinal, 0.0, 1.0);

    // Gradient
    float gradientX = (noiseFinal - limit) * (1.0 + limit);
    color.rgb = vec3(texture2D(uGradient, vec2(gradientX, 0.0)));

    // Alpha
    color.a = clamp(noiseFinal, 0.0, 1.0) * uAlpha;

    // Test
    // color.rgb = vec3(noiseFinal);
    // color.rgb = vec3(noiseA);
    // color.rgb = vec3(noiseB);
    // color.rgb = vec3(noiseC);

    gl_FragColor = color;
}
