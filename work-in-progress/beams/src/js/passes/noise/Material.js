import { ShaderMaterial, Uniform, Vector4 } from 'three'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class Material extends ShaderMaterial
{
    constructor(options = {})
    {
        const settings = Object.assign({
            uStrength: 0.1,
            uRandom: 0
        }, options)

        super({
            type: 'DotScreenMaterial',

            uniforms:
            {
                tDiffuse: new Uniform(null),
                uStrength: new Uniform(settings.uStrength),
                uRandom: new Uniform(settings.uRandom),
            },

            fragmentShader: fragment,
            vertexShader: vertex,

            depthWrite: false,
            depthTest: false
        })
    }
}