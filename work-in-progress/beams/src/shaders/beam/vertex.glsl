uniform vec3 uCursorPosition;

varying vec2 vUv;

void main()
{
    vec4 newPosition = modelMatrix * vec4(position, 1.0);

    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * newPosition;
}