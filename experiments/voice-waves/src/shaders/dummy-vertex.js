var shader_dummy_vertex = [
    'void main()',
    '{',
    '    vec3 new_position = position;',
    '    new_position.x += 50.0;',
    '    gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position,1.0);',
    '}',
].join('\n');
