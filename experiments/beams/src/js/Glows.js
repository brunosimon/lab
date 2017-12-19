import * as THREE from 'three'

export default class Beams
{
    constructor(_options)
    {
        this.container = new THREE.Object3D()

        this.time = _options.time
        this.controlKit = _options.controlKit
        
        this.range = {}
        this.range.x = { start: - 2.5, amplitude: 5 }
        this.range.y = { start: - 2.5, amplitude: 5 }
        this.range.z = { start: - 0.5, amplitude: - 3, fadeAmplitude: 0.75 }

        this.setRadialGradient()
        this.setItems()
    }

    setRadialGradient()
    {
        this.gradient = {}

        // Canvas
        this.gradient.canvas = document.createElement('canvas')
        this.gradient.canvas.width = 512
        this.gradient.canvas.height = 512

        // this.gradient.canvas.style.position = 'absolute'
        // this.gradient.canvas.style.top = '0'
        // this.gradient.canvas.style.left = '0'
        // this.gradient.canvas.style.zIndex = '1'
        // this.gradient.canvas.style.background = 'red'
        // document.body.appendChild(this.gradient.canvas)

        // Context
        this.gradient.context = this.gradient.canvas.getContext('2d')

        // Texture
        this.gradient.texture = new THREE.Texture(this.gradient.canvas)

        // // Controlkit
        // const group = this.controlKit._panels[0].addGroup({
        //     label: 'Beam gradient',
        //     enable: false
        // })

        const onColorsChange = () =>
        {
            const gradientStyle = this.gradient.context.createRadialGradient(
                this.gradient.canvas.width * 0.5,
                this.gradient.canvas.height * 0.5,
                0,
                this.gradient.canvas.width * 0.5,
                this.gradient.canvas.height * 0.5,
                this.gradient.canvas.width * 0.5
            )
            gradientStyle.addColorStop(0, '#ffffff')
            gradientStyle.addColorStop(1, '#000000')

            this.gradient.context.fillStyle = gradientStyle
            this.gradient.context.fillRect(0, 0, this.gradient.canvas.width, this.gradient.canvas.height)

            this.gradient.texture.needsUpdate = true
        }
        onColorsChange()
        
        // group.addColor(colors, '0', { label: 'step 0', colorMode: 'hex', onChange: onColorsChange })
        // group.addColor(colors, '1', { label: 'step 1', colorMode: 'hex', onChange: onColorsChange })
        // group.addColor(colors, '2', { label: 'step 2', colorMode: 'hex', onChange: onColorsChange })
        // group.addColor(colors, '3', { label: 'step 3', colorMode: 'hex', onChange: onColorsChange })
    }

    /**
     * Set items
     */
    setItems()
    {
        this.count = 25

        this.alpha = 0.25
        this.color = '#770000'

        this.scale = {}
        this.scale.value = 2
        this.scale.random = 2

        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
        this.items = []

        for(let i = 0; i < this.count; i++)
        {
            const material = this.getMaterial()
            const mesh = new THREE.Mesh(this.geometry, material)
            mesh.position.x = this.range.x.start + this.range.x.amplitude * Math.random()
            mesh.position.z = this.range.z.start + this.range.z.amplitude * Math.random()
            mesh.position.y = this.range.y.start + this.range.y.amplitude * Math.random()

            this.container.add(mesh)

            this.items.push(mesh)
        }

        // Time tick
        this.time.on('tick', () =>
        {
            // Each mesh
            for(const mesh of this.items)
            {
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

                mesh.material.opacity = alpha * this.alpha
            }
        })

        // Controlkit scale
        const scaleGroup = this.controlKit._panels[0].addGroup({
            label: 'Glow scale',
            enable: false
        })

        const onScaleChange = () =>
        {
            for(const mesh of this.items)
            {
                const scale = this.scale.value + Math.random() * this.scale.random
                mesh.scale.x = scale
                mesh.scale.y = scale
            }
        }
        onScaleChange()
        
        scaleGroup.addNumberInput(this.scale, 'value', { label: 'value', step: 0.1, onChange: onScaleChange })
        scaleGroup.addNumberInput(this.scale, 'random', { label: 'random', step: 0.1, onChange: onScaleChange })

        // Controlkit material
        const materialGroup = this.controlKit._panels[0].addGroup({
            label: 'Glows material',
            enable: false
        })

        const onMaterialChange = () =>
        {
            for(const mesh of this.items)
            {
                mesh.material.color.setStyle(this.color)
            }
        }
        onMaterialChange()
        
        materialGroup.addNumberInput(this, 'alpha', { label: 'alpha', step: 0.01 })
        materialGroup.addColor(this, 'color', { label: 'color', onChange: onMaterialChange })
    }

    getMaterial()
    {
        return new THREE.MeshBasicMaterial({ color: this.color, alphaMap: this.gradient.texture, transparent: true })
    }
}
