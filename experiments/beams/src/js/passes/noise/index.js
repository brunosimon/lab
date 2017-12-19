import { Pass } from '../Pass.js'
// import { Pass } from 'postprocessing'
import Material from './Material.js'

export class NoisePass extends Pass
{
    constructor(options = {})
    {
        super()

        this.name = 'NoisePass'
        this.needsSwap = true
        this.material = new Material(options)
        this.quad.material = this.material
    }

    render(renderer, readBuffer, writeBuffer)
    {
        this.material.uniforms.tDiffuse.value = readBuffer.texture
        renderer.render(this.scene, this.camera, this.renderToScreen ? null : writeBuffer)
    }

    setSize(width, height)
    {
        width = Math.max(1, width)
        height = Math.max(1, height)
    }
}