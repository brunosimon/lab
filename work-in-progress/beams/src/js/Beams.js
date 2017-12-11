import * as THREE from 'three'

import beamVertexShader from '../shaders/beam/vertex.glsl'
import beamFragmentShader from '../shaders/beam/fragment.glsl'
import cnoise3dShader from '../shaders/noises/cnoise3d.glsl'

export default class Beams
{
    constructor(_options)
    {
        this.container = new THREE.Object3D()

        this.time = _options.time

        this.setItems()
    }

    setItems()
    {
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
        this.items = []
        // this.beams.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })

        for(let i = 0; i < 8; i++)
        {
            const material = this.getMaterial()

            const mesh = new THREE.Mesh(this.geometry, material)
            mesh.position.x = (Math.random() - 0.5) * 1
            mesh.position.y = (Math.random() - 0.5) * 1
            mesh.position.z = (Math.random() - 0.5) * 1
            mesh.scale.x = 0.3
            mesh.scale.y = 5

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
                uRandomSeed: { type: 'f', value: Math.random() },
            },
            transparent: true
        })
    }
}