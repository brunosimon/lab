var shader_grid_fragment = [
    'uniform int uDirection;',
    'uniform int uType;',
    'uniform float uBottomFade;',
    'varying float vElevation;',
    'varying vec3 vColor;',
    'varying vec3 vPosition;',
    '',
    'void main()',
    '{',
    '    float alpha = 1.0;',
    '',
    '    if(uType == 2)',
    '    {',
    '        if(uDirection == 1)',
    '        {',
    '          if(mod(vPosition.x, 10.0) > 6.0 || mod(vPosition.x, 10.0) < 4.0)',
    '              alpha = 0.0;',
    '        }',
    '        else',
    '        {',
    '          if(mod(vPosition.y, 10.0) > 6.0 || mod(vPosition.y, 10.0) < 4.0)',
    '              alpha = 0.0;',
    '        }',
    '    }',
    '',
    '    // Bottom fade',
    '    if( uBottomFade > 0.0 )',
    '        alpha *= vElevation / uBottomFade;',
    '',
    '    gl_FragColor = vec4( vColor, alpha );',
    '',
    '}',
].join('\n');
