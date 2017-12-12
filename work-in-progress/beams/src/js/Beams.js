import * as THREE from 'three'

import beamVertexShader from './shaders/beam/vertex.glsl'
import beamFragmentShader from './shaders/beam/fragment.glsl'
import cnoise3dShader from './shaders/noises/cnoise3d.glsl'

export default class Beams
{
    constructor(_options)
    {
        this.container = new THREE.Object3D()

        this.time = _options.time

        this.setGradient()
        this.setItems()
    }

    setGradient()
    {
        this.gradient = {}

        // Canvas
        this.gradient.canvas = document.createElement('canvas')
        this.gradient.canvas.width = 128
        this.gradient.canvas.height = 1

        // Context
        this.gradient.context = this.gradient.canvas.getContext('2d')

        const gradientStyle = this.gradient.context.createLinearGradient(0, 0, this.gradient.canvas.width, 0)
        const colorStops = [
            '#0a0720',
            // '#260918',
            // '#7f152b',
            '#9b2222',
            '#3e2675',
            '#efe7f3'
        ]
        for(const colorStopsKey in colorStops)
        {
            gradientStyle.addColorStop(colorStopsKey / colorStops.length, colorStops[colorStopsKey])
        }

        this.gradient.context.fillStyle = gradientStyle
        this.gradient.context.fillRect(0, 0, this.gradient.canvas.width, this.gradient.canvas.height)

        // texture
        this.gradient.texture = new THREE.Texture(this.gradient.canvas)
        this.gradient.texture.needsUpdate = true
    }

    setItems()
    {
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
        this.items = []
        // this.beams.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })

        for(let i = 0; i < 25; i++)
        {
            const material = this.getMaterial()

            const mesh = new THREE.Mesh(this.geometry, material)
            mesh.position.x = (Math.random() - 0.5) * 3
            mesh.position.y = (Math.random() - 0.5) * 3
            mesh.position.z = (Math.random() - 0.5) * 3
            mesh.scale.x = 0.2 + Math.random() * 0.3
            mesh.scale.y = 10

            this.container.add(mesh)

            this.items.push(mesh)
        }

        this.time.on('tick', () =>
        {
            for(const mesh of this.items)
            {
                mesh.material.uniforms.uTime.value = this.time.elapsed
            }
        })
    }

    getMaterial()
    {
        return new THREE.ShaderMaterial({
            vertexShader: beamVertexShader,
            fragmentShader: `${cnoise3dShader} ${beamFragmentShader}`,
            uniforms:
            {
                uTime: { type: 'f', value: 0.0 },
                uGradient: { type: 't', value: this.gradient.texture },
                uRandomSeed: { type: 'f', value: Math.random() },
            },
            transparent: true,
            blending: THREE.AdditiveBlending
        })
    }
}
