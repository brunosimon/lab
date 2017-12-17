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
        this.controlKit = _options.controlKit
        
        this.range = {}
        this.range.x = { start: - 1.5, amplitude: 5 }
        this.range.z = { start: - 0.5, amplitude: - 3, fadeAmplitude: 0.75 }

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

        // Texture
        this.gradient.texture = new THREE.Texture(this.gradient.canvas)

        // Colors
        const colors = [
            '#24151c',
            '#ba235b',
            '#ffab36',
            '#ffedde'
        ]

        // Controlkit
        const group = this.controlKit._panels[0].addGroup({
            label: 'Beam gradient',
            enable: false
        })

        const onColorsChange = () =>
        {
            const gradientStyle = this.gradient.context.createLinearGradient(0, 0, this.gradient.canvas.width, 0)
            for(const colorsKey in colors)
            {
                gradientStyle.addColorStop(colorsKey / colors.length, colors[colorsKey])
            }

            this.gradient.context.fillStyle = gradientStyle
            this.gradient.context.fillRect(0, 0, this.gradient.canvas.width, this.gradient.canvas.height)

            this.gradient.texture.needsUpdate = true
        }
        onColorsChange()
        
        group.addColor(colors, '0', { label: 'step 0', colorMode: 'hex', onChange: onColorsChange })
        group.addColor(colors, '1', { label: 'step 1', colorMode: 'hex', onChange: onColorsChange })
        group.addColor(colors, '2', { label: 'step 2', colorMode: 'hex', onChange: onColorsChange })
        group.addColor(colors, '3', { label: 'step 3', colorMode: 'hex', onChange: onColorsChange })
    }

    /**
     * Set items
     */
    setItems()
    {
        this.count = 25

        this.scale = {}
        this.scale.value = 0.2
        this.scale.random = 0.3

        this.perlin = {}
        this.perlin.scale = [0.4, 0.02]
        this.perlin.speed = 0.1

        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
        this.items = []
        // this.beams.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })

        for(let i = 0; i < this.count; i++)
        {
            const material = this.getMaterial()

            const mesh = new THREE.Mesh(this.geometry, material)
            mesh.position.x = this.range.x.start + this.range.x.amplitude * Math.random()
            mesh.position.z = this.range.z.start + this.range.z.amplitude * Math.random()
            mesh.scale.y = 10

            this.container.add(mesh)

            this.items.push(mesh)
        }

        // Time tick
        this.time.on('tick', () =>
        {
            // Each mesh
            for(const mesh of this.items)
            {
                mesh.material.uniforms.uTime.value = this.time.elapsed

                mesh.position.z += this.time.delta * 0.0002

                // Reset position
                if(mesh.position.z > this.range.z.start)
                {
                    mesh.position.x = this.range.x.start + this.range.x.amplitude * Math.random()
                    mesh.position.z = this.range.z.start + this.range.z.amplitude
                }

                // Alpha depending on position
                let alpha = 1.0
                const distanceToEnd = Math.abs(mesh.position.z - this.range.z.start)
                if(distanceToEnd < this.range.z.fadeAmplitude)
                {
                    alpha = distanceToEnd / this.range.z.fadeAmplitude
                }
                
                const distanceToStart = Math.abs(mesh.position.z - this.range.z.amplitude - this.range.z.start)
                if(distanceToStart < this.range.z.fadeAmplitude)
                {
                    alpha = distanceToStart / this.range.z.fadeAmplitude
                }

                mesh.material.uniforms.uAlpha.value = alpha
            }
        })

        // Controlkit scale
        const scaleGroup = this.controlKit._panels[0].addGroup({
            label: 'Beam scale',
            enable: false
        })

        const onScaleChange = () =>
        {
            for(const mesh of this.items)
            {
                mesh.scale.x = this.scale.value + Math.random() * this.scale.random
            }
        }
        onScaleChange()
        
        scaleGroup.addNumberInput(this.scale, 'value', { label: 'value', step: 0.01, onChange: onScaleChange })
        scaleGroup.addNumberInput(this.scale, 'random', { label: 'random', step: 0.01, onChange: onScaleChange })

        // Controlkit material
        const materialGroup = this.controlKit._panels[0].addGroup({
            label: 'Beam material',
            enable: false
        })

        const onMaterialChange = () =>
        {
            for(const mesh of this.items)
            {
                mesh.material.uniforms.uPerlinScale.value = this.perlin.scale
                mesh.material.uniforms.uPerlinSpeed.value = this.perlin.speed
            }
        }
        onMaterialChange()
        
        materialGroup.addPad(this.perlin, 'scale', { label: 'perlin scale', onChange: onMaterialChange })
        materialGroup.addNumberInput(this.perlin, 'speed', { label: 'perlin speed', step: 0.01, onChange: onMaterialChange })
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
                uPerlinSpeed: { type: 'f', value: this.perlin.speed },
                uPerlinScale: { type: 'v2', value: this.perlin.scale },
                uAlpha: { type: 'f' , value: 1 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending
        })
    }
}
