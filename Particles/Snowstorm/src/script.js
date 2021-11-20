import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'
import terrainVertexShader from './shaders/terrain/vertex.glsl'
import terrainFragmentShader from './shaders/terrain/fragment.glsl'
import GUI from 'lil-gui'
import { sphericalToCartesian } from "./utils";

/**
 * Base
 */
// Debug
const gui = new GUI()

const fogFolder = gui.addFolder("Fog")
const terrainFolder = gui.addFolder("Terrain")
const particlesFolder = gui.addFolder("Particles")

const parameters = {}
parameters.count = 5000
parameters.size = 0.005
parameters.maxHeight = 10
parameters.radius = 20
parameters.minY = - 2.0
parameters.fallingSpeed = 3.0
parameters.windSpeed = 1.0

parameters.randomness = 0.5
parameters.particlesSize = 5
parameters.color = '#9fa1c6'

parameters.background = '#bdbfe5'
parameters.fogColor = '#ffffff'
parameters.fogDensity = 0.0025

parameters.terrainColorA = '#615e68'
parameters.terrainColorB = '#bdbfe5'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(parameters.background)
scene.fog = new THREE.Fog(parameters.fogColor, 0.1, parameters.fogDensity)

fogFolder.add(parameters, 'fogDensity').min(0).max(1).step(0.0001).name('Density')
fogFolder.addColor(parameters, 'fogColor').name('Color').onFinishChange(() => {
    scene.fog = new THREE.Fog(parameters.fogColor, 0.1, parameters.fogDensity)
})

gui.addColor(parameters, 'background').onFinishChange(() => {
    scene.background = new THREE.Color(parameters.background)
})
/**
 * Terrain
 */
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 100, 100),
    new THREE.ShaderMaterial({
        vertexShader: terrainVertexShader,
        fragmentShader: terrainFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(parameters.terrainColorA) },
            uColorB: { value: new THREE.Color(parameters.terrainColorB) },
        }
    })
)
ground.rotateX(- Math.PI / 2)
ground.position.y = - 4

scene.add(ground)
terrainFolder.addColor(parameters, 'terrainColorA').onFinishChange(() => {
    console.log(ground);
    ground.material.uniforms.uColorA.value = new THREE.Color(parameters.terrainColorA)
})
terrainFolder.addColor(parameters, 'terrainColorB').onFinishChange(() => {
    ground.material.uniforms.uColorB.value = new THREE.Color(parameters.terrainColorB)
})

/**
 * Particles
 */

let geometry = null
let pMaterial = null
let points = null

const generate = () =>
{
    if(points !== null)
    {
        geometry.dispose()
        pMaterial.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count)
    const fallingRandomness = new Float32Array(parameters.count)

    const particlesColor = new THREE.Color(parameters.color)

    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        // Position

        const randomAngle = Math.random() * 360
        const randomRadius = Math.random() * parameters.radius
        const height = - 2 + Math.random() * parameters.maxHeight
        const sphericalCoordinate = sphericalToCartesian(randomRadius, 0, randomAngle)

        positions[i3    ] = sphericalCoordinate.x
        positions[i3 + 1] = height
        positions[i3 + 2] = sphericalCoordinate.z

        // Color
        colors[i3    ] = particlesColor.r
        colors[i3 + 1] = particlesColor.g
        colors[i3 + 2] = particlesColor.b

        scales[i] = Math.random() * 10
        fallingRandomness[i] = Math.random() * 3
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(fallingRandomness, 1))

    /**
     * Material
     */
    pMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        // blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: particlesVertexShader,
        fragmentShader: particlesFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: parameters.particlesSize * renderer.getPixelRatio() },
            uMaxHeight: { value: parameters.maxHeight },
            uMinY: { value: parameters.minY },
            uRadius: { value: parameters.radius },
            uFallingSpeed: { value: parameters.fallingSpeed },
            uWindSpeed: { value: parameters.windSpeed },
        }
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, pMaterial)
    scene.add(points)
}

particlesFolder.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generate)
particlesFolder.add(parameters, 'minY').min(-10).max(10).step(1).onFinishChange(generate)
particlesFolder.add(parameters, 'maxHeight').min(0).max(20).step(0.5).onFinishChange(generate)
particlesFolder.add(parameters, 'particlesSize').min(1).max(50).step(0.001).onFinishChange(generate)
particlesFolder.add(parameters, 'radius').min(1).max(50).step(1).onFinishChange(generate)
particlesFolder.add(parameters, 'fallingSpeed').min(0).max(10).step(0.01).onFinishChange(generate)
particlesFolder.add(parameters, 'windSpeed').min(0).max(6).step(0.001).onFinishChange(generate)
particlesFolder.addColor(parameters, 'color').onFinishChange(generate)

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
camera.position.x = -5
camera.position.y = 1.5
camera.position.z = 5
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

    pMaterial.uniforms.uTime.value = elapsedTime;
    ground.material.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // console.log(points);
    // points.rotation.y += 0.003

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

generate()
tick()