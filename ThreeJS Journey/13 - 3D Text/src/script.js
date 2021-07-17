import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * 3D Text
 * To create 3D Text we need to have a facetype font. You can convert one of the font already in your computer with some
 * tool like http://gero3.github.io/facetype.js/
 * We can also use font provided by ThreeJS (check the /node_module/three/examples/fonts/ folder)
 * To load the font we will use the FontLoader class
 *
 * !!! Creating a text geometry is long an hard for the computer. Avoid doing it too many times and keep geometry as
 * low as possible by reducing the curveSegment and bevelSegment.
 * You can see the segment details by enabling the material wireframe property.
 */
const fontLoader = new THREE.FontLoader()
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')

fontLoader.load('/font/gentilis_regular.typeface.json', (font) => {
    const textGeometry = new THREE.TextGeometry('JHN', {
        font,
        size: 0.5,
        height: 0.2,
        curveSegment: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegment: 3
    })
    /** 2. Move the text to center
     * Instead of moving the mesh, we are to move the whole geometry with translate
     * There are multiple solution to do that :
     *      2.1 Using the bounding: The bounding is an information associated with the geometry that tells what space is
     *          taken by that geometry. It can be a box or a sphere (default). It helps Three.js calculate if the object is
     *          on the screen (frustum culling).
     * */
    textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - textGeometry.boundingBox.max.x * 0.5,
    //     - textGeometry.boundingBox.max.y * 0.5,
    //     - textGeometry.boundingBox.max.y * 0.5,
    // )
    // To have the exact center because of the bevel, we need to consider it in our translation, checkout it's size by
    // logging textGeometry.boundingBox (max x and min x must have the same value)

    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.08) * 0.5,
    //     - (textGeometry.boundingBox.max.y - 0.15) * 0.5,
    //     - (textGeometry.boundingBox.max.y - 0.035) * 0.5,
    // )
    console.log(textGeometry.boundingBox)


    /**     2.2 Using the center method --'
     * */
    textGeometry.center()

    // const textMaterial = new THREE.MeshBasicMaterial()
    // textMaterial.wireframe = true

    /** 3. Using MeshMatcapMaterial
     * */
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)

    /** 4. Adding Others Object
     * */
    console.time('donuts')
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    // const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    for (let i=0; i<100; i++) {
        const donut = new THREE.Mesh(donutGeometry, material)

        donut.position.x = (Math.random() - 0.5) * 20
        donut.position.y = (Math.random() - 0.5) * 20
        donut.position.z = (Math.random() - 0.5) * 20

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = Math.random() * 2
        donut.scale.set(scale, scale, scale)

        scene.add(donut)
    }
    /** 5. Optimize
     * - Move the donutGeometry and the donutMaterial off the loop
     * - Use the sale material for the text and the donuts
     * */
    console.timeEnd('donuts')
})


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()