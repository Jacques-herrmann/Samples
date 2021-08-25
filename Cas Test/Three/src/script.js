import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Mesh } from 'three'

// Debug
const debugObject = {}
const gui = new dat.GUI()
const target = gui.addFolder("target")
const lights = gui.addFolder("lights")
target.open()
lights.open()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test sphere
 */
const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({color: "blue"})
)
testSphere.position.set(9, 2, 30)
target.add(testSphere.position, 'x').min(-5).max(15).step(0.5)
target.add(testSphere.position, 'y').min(-5).max(15).step(0.5)
target.add(testSphere.position, 'z').min(10).max(50).step(1)
scene.add(testSphere)

// Cube Loader
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMaps = []
envMaps.push(cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg'
    ]
))
envMaps.push(cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
    ]
))

let envMapsIndex = 0

scene.background = envMaps[envMapsIndex]
scene.environment = envMaps[envMapsIndex]

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('0xffffff', 0.3)
// scene.add(ambientLight)

const directionaLight = new THREE.DirectionalLight('0xffffff', 3)
directionaLight.position.set(0.25, 3, -2.25)
directionaLight.castShadow = true
directionaLight.shadow.camera.far = 15
directionaLight.shadow.normalBias = 0.05
directionaLight.shadow.mapSize.set(1024, 1024)
scene.add(directionaLight)

// const directionLightCameraHelper = new THREE.CameraHelper(directionaLight.shadow.camera)
// scene.add(directionLightCameraHelper)

lights.add(directionaLight, 'intensity').min(0).max(10).step(0.01).name('LightIntensity')
lights.add(directionaLight.position, 'x').min(-5).max(5).step(0.01).name('LightX')
lights.add(directionaLight.position, 'y').min(-5).max(5).step(0.01).name('LightY')
lights.add(directionaLight.position, 'z').min(-5).max(5).step(0.01).name('LightZ')

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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true

/**
 * Shadows
 * 
 */
renderer.shadowMap.enabled = true


/**
 * Raycaster
 *
 */
 const raycaster = new THREE.Raycaster()
 
let currentIntersect = null

/**
 * Events
 */
 const mouse = new THREE.Vector2()

 window.addEventListener('mousemove', (_event) => {
     mouse.x = _event.clientX / sizes.width * 2 - 1
     mouse.y = - (_event.clientY / sizes.height) * 2 + 1
 })

 window.addEventListener('click', (_event) => {
    if (currentIntersect) {
        console.log('Change EnvironmentMap')
        envMapsIndex = envMapsIndex + 1 === envMaps.length ? 0 :envMapsIndex + 1
        
        scene.background = envMaps[envMapsIndex]
        scene.environment = envMaps[envMapsIndex]

    }
})


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects([testSphere])

    if (intersects.length) {
        if (currentIntersect === null) {
            document.body.style.cursor = "pointer"
        }
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect) {
            document.body.style.cursor = "auto"
        }
        currentIntersect = null
        
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()
