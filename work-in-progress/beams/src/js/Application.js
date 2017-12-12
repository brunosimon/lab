import * as THREE from 'three'

import Time from './Time.js'
import Sizes from './Sizes.js'
import Beams from './Beams.js'

export default class Application
{
    constructor()
    {
        this.time = new Time()
        this.sizes = new Sizes()

        this.setCursor()
        this.setScene()
        this.setBeams()
        this.setRenderer()
    }

    setCursor()
    {
        this.cursor = {}
        this.cursor.x = 0
        this.cursor.y = 0
        this.cursor.target = {}
        this.cursor.target.x = 0
        this.cursor.target.y = 0

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
        this.camera.position.z = 1
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
            this.camera.position.z = this.cursor.y / this.sizes.width
            this.camera.position.x = this.cursor.x / this.sizes.height - 0.5
        })
    }

    setBeams()
    {
        this.beams = new Beams({
            time: this.time
        })
        this.scene.add(this.beams.container)
    }

    setRenderer()
    {
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0x0a0720)
        this.renderer.domElement.classList.add('main')
        document.body.appendChild(this.renderer.domElement)

        // Resize
        const resize = () =>
        {
            this.renderer.setSize(this.sizes.width, this.sizes.height)
        }
        this.sizes.on('resize', resize)
        resize()

        // Tick
        this.time.on('tick', () =>
        {
            this.renderer.render(this.scene, this.camera)
        })
    }
}
