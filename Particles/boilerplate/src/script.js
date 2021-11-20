import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Particles
 */
const parameters = {}
parameters.count = 20000
parameters.size = 0.005

parameters.randomness = 0.5
parameters.particlesSize = 3
parameters.color = '#ff6030'

let geometry = null
let material = null
let points = null

const generate = () =>
{
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count)

    const particlesColor = new THREE.Color(parameters.color)

    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        // Position

        const randomX = (0.5 - Math.random()) * 10
        const randomY = (0.5 - Math.random()) * 5
        const randomZ = (0.5 - Math.random()) * 10

        positions[i3    ] = randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = randomZ

        // Color
        colors[i3    ] = particlesColor.r
        colors[i3 + 1] = particlesColor.g
        colors[i3 + 2] = particlesColor.b

        scales[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    /**
     * Material
     */
    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uSize: { value: parameters.particlesSize * renderer.getPixelRatio() },
            uTime: { value: 0 },
        }
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generate)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generate)
gui.add(parameters, 'particlesSize').min(1).max(50).step(0.001).onFinishChange(generate)
gui.addColor(parameters, 'color').onFinishChange(generate)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2.5
camera.position.y = 1.5
camera.position.z = 2.5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const mesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(),
    new THREE.MeshBasicMaterial({ color: "red" })
)
// scene.add(mesh)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    material.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

generate()
tick()