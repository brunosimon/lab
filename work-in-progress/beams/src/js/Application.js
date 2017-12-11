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

        this.setScene()
        this.setBeams()
        this.setRenderer()
    }

    setScene()
    {
        // Scene
        this.scene = new THREE.Scene()

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.camera.position.z = 1
        this.scene.add(this.camera)

        window.addEventListener('mousemove', (event) =>
        {
            this.camera.position.z = event.clientY / this.sizes.height
            this.camera.position.x = (event.clientX / this.sizes.width) - 0.5
        })

        // // Dummy
        // this.dummy = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }))
        // this.scene.add(this.dummy)

        // Resize
        this.sizes.on('resize', () =>
        {
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()
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