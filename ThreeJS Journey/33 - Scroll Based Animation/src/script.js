import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Scroll Based Animation
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#13fbb6',
    lightColor: '#ffffff',
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>{
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })
gui
    .addColor(parameters, 'lightColor')
    .onChange(() =>{
        light.color.set(parameters.lightColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const textureLoader = new THREE.TextureLoader()
const gradient = textureLoader.load('textures/gradients/3.jpg')
gradient.magFilter = THREE.NearestFilter // Disabled textures mix on the material

const objects = []
const objectsDistance = 4
const material = new THREE.MeshToonMaterial( {
    color: parameters.materialColor,
    gradientMap: gradient
})

objects.push(new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
    )
)
objects.push(new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
    )
)
objects.push(new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
    )
)

objects.forEach((obj, o) => {
    obj.position.y = - objectsDistance * o
    obj.position.x = (o % 2) ? - 2 : 2
    scene.add(obj)
})

/**
 * Particles
 */
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i=0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * objects.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const points = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(points)
/**
 * Lights
 */
const light = new THREE.DirectionalLight(parameters.lightColor, 1)
light.position.set(1, 0, 1)
scene.add(light)

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
const cameraGroup = new THREE.Group()
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)
scene.add(cameraGroup)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    if( newSection !== currentSection) {
        currentSection = newSection

        gsap.to(
            objects[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5',
            }
        )
    }

})

/**
 * Cursor
 */
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (ev) => {
    cursor.x = ev.clientX / sizes.height - 0.5
    cursor.y = ev.clientY / sizes.width - 0.5
})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    for(const obj of objects) {
        obj.rotation.x += deltaTime * 0.1
        obj.rotation.y += deltaTime * 0.12
    }

    camera.position.y = - scrollY / sizes.height * objectsDistance
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5

    // Because screens has different refresh speed, the animation won't work the same on each screen
    // To correct that bug, we need to use the time between two tick function
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()