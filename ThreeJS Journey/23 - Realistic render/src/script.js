import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Realistic render
 *
 * Many things can participate in a wrong looking model.
 */

/**
 * Loaders
 *
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    '/models/hamburger.glb',
    // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.position.set(0, -4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)
        gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name("Rotation")
        updateAllMaterials()
    }
)

// Debug
const debugObject = {}
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test sphere
 */
const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
)
scene.add(testSphere)

// Cube Loader
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg'
    ]
)
scene.background = environmentMap
/**
 * Textures encoding
 *
 * The environment map colors are wrong. The problem is that the renderer outputEncoding is THREE.sRGBEncoding but the
 * environment map texture is by default THREE.LinearEncoding.
 * All textures that we can see directly - like the map - should have THREE.sRGBEncoding as encoding and all other
 * textures - such as normalMap - should have THREE.LinearEncoding.
 *
 * Fortunately, the GLTLoader implemented this rule, and all the textures loaded from it will have the right encoding
 * automatically.
 */
environmentMap.encoding = THREE.sRGBEncoding

scene.environment = environmentMap

debugObject.envMapIntensity = 5
/**
 * We can apply the environment map to the materials with envMap and we need to traverse the object to update each material
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.01).onChange(updateAllMaterials)

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

gui.add(directionaLight, 'intensity').min(0).max(10).step(0.01).name('LightIntensity')
gui.add(directionaLight.position, 'x').min(-5).max(5).step(0.01).name('LightX')
gui.add(directionaLight.position, 'y').min(-5).max(5).step(0.01).name('LightY')
gui.add(directionaLight.position, 'z').min(-5).max(5).step(0.01).name('LightZ')

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

/**
 * Antialiasing
 *
 * We call aliasing an artifact that might appear in some situations where we can see a stair-like effect, usually on
 * the edge of geometries.
 * This is due to the renderer having to choose if the geometry is in the pixel or not.
 *
 * One easy solution would be to increase our render's resolution to the double and each pixel color will automatically
 * be averaged from the 4 pixels rendered.
 * This is called super sampling (SSAA) or fullscreen sampling (FSAA), it's easy and efficient one but not performant.
 *
 * An other solution named multi sampling (MSAA) will also render multiple values per pixel (usually 4) like for the
 * super sampling but only on the geometries' edges.
 * The values of the pixel are then averaged to get the final pixel value.
 *
 * Most recent GPU can perform this multi sampling anti-aliasing, and Three.js handles the setup automatically.
 * Just activate the antialiasing when creating the renderer.
 *
 * Screens with a pixel ratio above 1 don't really need antialias.
 * The best solution would be to activate the antialias only for screens with a pixel ratio below 2 and we will achieve
 * that in a future lesson.
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
/**
 * Output Encoding
 * The outputEncoding property controls the output render encoding. The default outputEncoding is THREE.LinearEncoding
 * and we should use THREE.sRGBEncoding.
 * Another possible value is THREE.gammaEncoding which let us play with the gammaFactor that would act a little like the
 * brightness.
 * The Gamma Encoding is a way of storing colors while optimizing how bright and dark values are stored according to
 * human eye sensitivity. When we use sRGBEncoding, it's like using the GammaEncoding with a default gamma factor of 2.2
 * which is the common value.
 *
 */
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Tone Mapping
 * The tone mapping intends to convert High Dynamic Range (HDR) values to Low Dynamic Range (LDR) values.
 * HDR is much more than the following interpretation, but you can see that like images where the color values can go
 * beyond 1.
 * Our assets are not HDR, but the tone mapping effect can have a realistic result as if the camera was poorly adjusted.
 *
 * We can also control the tone mapping exposure. You can see that like how much light we let in and the algorithm will
 * handle it its way
 */
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
}).onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping) // HACK, value are convert to string instead of number
    updateAllMaterials()
})
gui.add(renderer, 'toneMappingExposure').min(1).max(10).step(0.01)

/**
 * Shadows
 * Toggle the shadows on WebGLRenderer and change the shadow type to THREE.PCFSoftShadowMap
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()
