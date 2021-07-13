import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth, // Size of the viewport
    height: window.innerHeight
}

/** 1. Resize handler
 * If you try to resize your window, you will see that the canvas size are note updating. To fix that, we have to
 * handle the resize event and resize our canvas to fit the window again.
 * Don't forget to update the aspectRatio of our camera, to do so juste change the aspect property of our camera and
 * call the function updateProjectionMatrix()
 * Finally update the renderer size
 */

window.addEventListener('resize', () => {
    // Update the canvas size
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/** 3. Full Screen
 * We will listen to the double click event on the window, if we already are on full screen we will quit it with
 * document.exitFullscreen and if not we will use the function requestFullscreen to going into.
 * We have to use prefixes version to allow this working on safari
 */
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
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

/** 2. Pixel Ratio
 * At this point, it's possible to see a blurry render adn stairs effect on the edges of the objects, it's because your
 * computer use an aspect ratio greater than 1.
 * The pixel ratio corresponds to how many physical pixels you have on the screen for one pixel unit on the software part.
 * Highest pixel ratios are usually on the weakest devices (mobiles)
 * 2 is just enough as pixel ratio so let's limit it's value to 2.
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