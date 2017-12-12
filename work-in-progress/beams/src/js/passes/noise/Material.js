import { ShaderMaterial, Uniform, Vector4 } from 'three'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class Material extends ShaderMaterial
{
    constructor(options = {})
    {
        const settings = Object.assign({
            average: false,
            angle: 1.57,
            scale: 1.0,
            intensity: 1.0
        }, options)

        super({
            type: 'DotScreenMaterial',

            uniforms:
            {
                tDiffuse: new Uniform(null),

                angle: new Uniform(settings.angle),
                scale: new Uniform(settings.scale),
                intensity: new Uniform(settings.intensity),

                offsetRepeat: new Uniform(new Vector4(0.5, 0.5, 1.0, 1.0))
            },

            fragmentShader: fragment,
            vertexShader: vertex,

            depthWrite: false,
            depthTest: false
        })

        this.setAverageEnabled(settings.average)
    }

    setAverageEnabled(enabled)
    {
        if(enabled)
        {
            this.defines.AVERAGE = '1'
        }
        else
        {
            delete this.defines.AVERAGE
        }

        this.needsUpdate = true
    }
}