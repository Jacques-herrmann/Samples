import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {BufferGeometry} from "three";

/**
 * Particles
 *
 * Particles can be used to create stars, smoke, rain, dust, fire, etc...
 * Each particle is composed of a plane (two triangles) always facing the camera
 *
 * Creating particles is like creating a Mesh, we need :
 *      - A geometry (BufferGeometry)
 *      - A material (Points Material)
 *      - A Points instance (instead of a Mesh)
 *
 *
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/11.png')

/** 1. Create the particles */
// const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32)

const particlesGeometry = new BufferGeometry()
const count = 20000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i=0; i<count*3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1, // Size of the particles
    sizeAttenuation: true, // Specify if the distance particles should be smaller than close particles
    // color: '#259c2a',
    // map: particleTexture,
    transparent: true,
    alphaMap: particleTexture,
    vertexColors: true
})
/** !!! Because the particles are drawn in the same order as they are created, WebGL doesn't really know which one is in
 * front of the other. There are multiple ways of fixing this.
 *
 *      - 1. Alpha Test : The alphaTest is a value between 0 and 1 that enables WebGL to know when not to render the
 *          pixel according to that pixel's transparency. By default, the value is 0 meaning that the pixel will be
 *          rendered anyway.
 * */

// particlesMaterial.alphaTest = 0.001

/**     - 2. depthTest : When drawing, the WebGL tests if what's being drawn is closer than what's already drawn. This
 *          is called depth testing and can be deactivated with alphaTest.
 *          !!! This method might create bugs if you have other objects in your scene or particles with different colors
 *          See the cube ! (**)
 * */

// particlesMaterial.depthTest = false

/**     - 3. depthWrite : The depth of what's being drawn is stored in what we call a depth buffer. Instead of not
 *          testing if the particle is closer than what's in this depth buffer, we can tell the WebGL not to write
 *          particles in that depth buffer with depthTest
 * */

particlesMaterial.depthWrite = false


/**     - 4. Blending : The WebGL currently draws pixels one on top of the other. With the blending property, we can
 *          tell the WebGL to add the color of the pixel to the color of the pixel already drawn
 *
 *          !!! This effect will impact the performances
 * */
particlesMaterial.blending = THREE.AdditiveBlending

/** 2. Create the point */
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// (**) Testing cube
// const cube = new THREE.Mesh(
//     new THREE.BoxBufferGeometry(),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

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
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Updates particles
    // particles.rotation.y = elapsedTime * 0.2

    // !!! You should avoid this technic because updating the whole attribute on each frame is bad for performances.
    // Use a custom shader instead !
    for (let i=0; i<count; i++) {
        const i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()