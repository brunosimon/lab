uniform vec3 uCursorPosition;

varying vec3 vPosition;
varying vec2 vUv;

void main()
{
    vec4 newPosition = modelMatrix * vec4(position, 1.0);

    vUv = uv;
    vPosition = newPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * newPosition;
}