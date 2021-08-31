import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import gsap from 'gsap'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

const textureLoader = new THREE.TextureLoader()
const firstTexture = textureLoader.load("/textures/1.jpg")
const secondTexture = textureLoader.load("/textures/2.jpg")

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Geometry
const geometry = new THREE.PlaneGeometry(6, 3, 512, 512)

let mouse = new THREE.Vector2(0, 0)

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        tCurrentView: { value: firstTexture },
        tNextView: { value: secondTexture },
        uCenter: { value: mouse},
        mixer: { value: 0},
    }
})

// gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')


// Mesh
const shaderMesh = new THREE.Mesh(geometry, material)
// shaderMesh.rotation.x = - Math.PI * 0.5
scene.add(shaderMesh)

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
camera.position.set(0, 0,2)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let currentIndex = 0

window.addEventListener('click', (ev) => {
    if (! currentIndex) {
        mouse.x = ev.clientX / window.innerWidth
        mouse.y =  1 - ev.clientY / window.innerHeight
        
        console.log(mouse)
        gsap.to(material.uniforms.mixer, {
            value: 1,
            duration: 5,
            onComplete: () => {
                material.needsUpdate = true;
                currentIndex = 1
            }
        })
    } 
    else {
        material.uniforms.mixer.value = 0;
        mouse.x = 0.5
        mouse.y = 0.5
        currentIndex = 0
    }
    
})

const tick = () =>
{

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()