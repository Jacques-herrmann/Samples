import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

/**
 * 1. Instantiate a Debug UI
 * We need to debug things quickly and easily because it's something that take to long.
 * Fortunately, it exist some useful tool to directly change some properties directly through the running website.
 * You can also create your own library
 *
 * Here is some of the most used library :
 *      1. dat.GUI :
 *      2. control-panel
 *      3. Controlkit
 *      4. Guify
 *      5. Oui
 */
const gui = new dat.GUI()
const parameters = {
    color: 0xff0000,
    spin: () => {
        console.log('spin');
        gsap.to(mesh.rotation, {
            duration: 1,
            y: mesh.rotation.y + Math.PI * 2
        })
    }
}// For part 3

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: parameters.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/** 2. Add Tweaks
 * Once you've create your panel, you can add multiple types of elements to the panel:
 *      1. Range: numbers with minimum and maximum
 *      2. Color: colors in various format
 *      3. Text: simple text
 *      4. Checkbox: for booleans
 *      5. Select: for choice from a list
 *      6. Button: trigger a function
 *      7. Folder: to organize the panel
 *
 * dat.gui will change the type of the tweak according to the type of the property !
 */
gui.add(mesh.position, 'y', -3, 3, 0.01)
gui.add(mesh.position, 'x')
    .min(-3)
    .max(3)
    .step(0.01) // do the same things but on x axis
    .name("elevation") // more parameters

gui.add(mesh, 'visible')
gui.add(material, 'wireframe')

/* 3. Color Tweak
* The only exception is for colors, dat.GUI cannot detect a color because it's not a type. We need to use addColor()
* But we have a problem, we can't access and change the material color directly from the material object.
* We have to create a new parameters object to change it's value with dat.GUI. Then each time the value change, we need
* to update our material color with the new value. To do so, we can use the onChange() method which take a function in
* argument.
*
*/
gui.addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color) // Material.color is a ThreeJS Color
    })

/* 4. Functions
* To trigger  function, we also have to store it inside an object (see l.23) and use it with dat.GUI
*/
gui.add(parameters, 'spin')

/* 5. More tips
*       - You can hide the panel pressing H
*       - To hide the panel on start use gui.hide() and press H two time to display it
*       - To close the panel pass the parameters closed to true inside the dat.GUI constructor
*       - You can change the width by drag an drop or by providing the default width inside the GUI constructor
* */

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()