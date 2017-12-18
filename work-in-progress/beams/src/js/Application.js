import * as THREE from 'three'
import { EffectComposer, RenderPass, BloomPass, BlurPass, SavePass, ShaderPass, CombineMaterial } from 'postprocessing'
import ControlKit from 'controlkit'

import Time from './Time.js'
import Sizes from './Sizes.js'
import Beams from './Beams.js'
import Glows from './Glows.js'

import { NoisePass } from './passes/noise/'

export default class Application
{
    constructor()
    {
        this.time = new Time()
        this.sizes = new Sizes()

        this.setControlKit()
        this.setAmbiantSound()
        this.setCursor()
        this.setScene()
        this.setBeams()
        this.setGlows()
        this.setRenderer()
    }

    setControlKit()
    {
        this.controlKit = new ControlKit()
        this.controlKit.addPanel({ width: 300, enable: false })
    }

    setAmbiantSound()
    {
        this.ambiantSound = document.createElement('audio')
        this.ambiantSound.loop = true
        this.ambiantSound.autoplay = true
        this.ambiantSound.volume = 0.7
        this.ambiantSound.src = '/static/audio/ambiant.mp3'

        // Controlkit
        const group = this.controlKit._panels[0].addGroup({
            label: 'Audio',
            enable: false
        })
        group.addNumberInput(this.ambiantSound, 'volume', { step: 0.01 })
    }

    setCursor()
    {
        this.cursor = {}
        this.cursor.x = 0.5
        this.cursor.y = 0.5
        this.cursor.target = {}
        this.cursor.target.x = 0.5
        this.cursor.target.y = 0.5

        window.addEventListener('mousemove', (event) =>
        {
            this.cursor.target.x = event.clientX
            this.cursor.target.y = event.clientY
        })

        this.time.on('tick', () =>
        {
            this.cursor.x += (this.cursor.target.x - this.cursor.x) * 0.005 * this.time.delta
            this.cursor.y += (this.cursor.target.y - this.cursor.y) * 0.005 * this.time.delta
        })
    }

    setScene()
    {
        // Scene
        this.scene = new THREE.Scene()

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.camera.position.z = 0
        this.scene.add(this.camera)

        // Resize
        this.sizes.on('resize', () =>
        {
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()
        })

        // Time tick
        this.time.on('tick', () =>
        {
            const positionX = this.cursor.x / this.sizes.height - 0.5

            let speed = positionX - this.camera.position.x
            speed = Math.max(speed, - 0.02)
            speed = Math.min(speed, 0.02)

            const rotation = - speed * 5
            
            this.camera.position.x = positionX
            this.camera.rotation.z += (rotation - this.camera.rotation.z) * 0.01 * this.time.delta
        })
    }

    setBeams()
    {
        this.beams = new Beams({
            time: this.time,
            controlKit: this.controlKit
        })
        this.scene.add(this.beams.container)
    }

    setGlows()
    {
        this.glows = new Glows({
            time: this.time,
            controlKit: this.controlKit
        })
        this.scene.add(this.glows.container)
    }

    setRenderer()
    {
        this.clearColor = '#110217'

        // Renderer
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(this.clearColor)
        this.renderer.domElement.classList.add('main')
        document.body.appendChild(this.renderer.domElement)

        // Composer
        this.composer = new EffectComposer(this.renderer)

        // Render pass
        const renderPass = new RenderPass(this.scene, this.camera)
        renderPass.renderToScreen = false
        this.composer.addPass(renderPass)

        // Bloom pass
        const bloomPass = new BloomPass({ intensity: 2 })
        bloomPass.renderToScreen = false
        this.composer.addPass(bloomPass)

        // Save pass
        const savePass = new SavePass()
        savePass.renderToScreen = false
        this.composer.addPass(savePass)

        // Blur pass
        const blurPass = new BlurPass({
            resolutionScale: 1.2
        })
        blurPass.renderToScreen = false
        this.composer.addPass(blurPass)

        // Combine pass (to fade between normal and blur pass)
        const combinePass = new ShaderPass(new CombineMaterial(), 'texture1')
        combinePass.material.uniforms.texture2.value = savePass.renderTarget.texture;
        combinePass.material.uniforms.opacity1.value = 0.0;
        combinePass.material.uniforms.opacity2.value = 1.0;
        this.composer.addPass(combinePass)
        const combineOptions = {}
        combineOptions.target = 0
        combineOptions.value = 0
        combineOptions.active = true

        this.time.on('tick', () =>
        {
            if(combineOptions.active)
            {
                if(Math.sin(this.time.elapsed * 0.001) * Math.sin(this.time.elapsed * 0.0023) * Math.sin(this.time.elapsed * 0.00654) > 0.2)
                {
                    combineOptions.target = 1
                }
                else
                {
                    combineOptions.target = 0
                }

                combineOptions.value += (combineOptions.target - combinePass.material.uniforms.opacity1.value) * 0.01 * this.time.delta

                combinePass.material.uniforms.opacity1.value = Math.round(combineOptions.value * 100) / 100
                combinePass.material.uniforms.opacity2.value = 1 - combinePass.material.uniforms.opacity1.value
            }
            else
            {
                combinePass.material.uniforms.opacity1.value = 0
                combinePass.material.uniforms.opacity2.value = 1 - combinePass.material.uniforms.opacity1.value
            }
        })

        // Noise pass
        const noisePass = new NoisePass()
        noisePass.renderToScreen = true
        this.composer.addPass(noisePass)

        this.time.on('tick', () =>
        {
            noisePass.material.uniforms.uRandom.value = Math.random()
        })

        // Resize
        const resize = () =>
        {
            this.renderer.setSize(this.sizes.width, this.sizes.height)
            this.composer.setSize(this.sizes.width, this.sizes.height)
        }
        this.sizes.on('resize', resize)
        resize()

        // Tick
        this.time.on('tick', () =>
        {
            // this.renderer.render(this.scene, this.camera)
            this.composer.render()
        })

        // Controlkit
        const group = this.controlKit._panels[0].addGroup({
            label: 'Render',
            enable: false
        })

        const onRenderChange = () =>
        {
            this.renderer.setClearColor(this.clearColor)

            combinePass.material.uniforms.opacity2.value = 1.0 - combinePass.material.uniforms.opacity1.value

            this.composer.setSize()
        }

        group.addColor(this, 'clearColor', { label: 'clear color', colorMode: 'hex', onChange: onRenderChange })
        
        group.addNumberInput(noisePass.material.uniforms.uStrength, 'value', { label: 'noise strength', step: 0.01 })
        
        group.addNumberInput(bloomPass, 'intensity', { label: 'bloom intensity', step: 0.1 })
        group.addNumberInput(bloomPass, 'distinction', { label: 'bloom distinction', step: 0.1 })

        group.addCheckbox(combineOptions, 'active', { label: 'blur active' })
        group.addNumberInput(blurPass, 'resolutionScale', { label: 'blur scale', step: 0.1, onChange: onRenderChange })
        group.addNumberInput(blurPass, 'kernelSize', { label: 'blur kernel size', step: 1 })
        group.addNumberInput(combinePass.material.uniforms.opacity1, 'value', { label: 'blur intensity', step: 0.1, onChange: onRenderChange })
    }
}
