import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * 7 - Cameras
 *
 * Camera class is an abstract class, you're not supposed to use it directly. They are five type of camera :
 *      1. Array Camera : allow to render the scene from multiple camera on specific areas of the render
 *      2. Stereo Camera : render the scene through two cameras that mimic the eyes to create a parallax effect
 *         (VR, red/blue glasses,...)
 *      3. Cube Camera: do 6 renders, each one facing a different direction, can render the surrounding for things
 *         like environment map, reflection or shadow map
 *      4. Orthographic Camera: use to create the render of the scene but without perspective
 *      5. Perspective Camera: render the scene with perspective.
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
/* 1. Perspective Camera
* They are four parameters to create a perspective camera:
* - Field Of View : It's the vertical vision angle (in degrees), also called fov | usually between 45 and 75
* - Aspect Ratio : The width or the render divided by the height of the render
* - Near: How close the camera can see, any object or part of the object close will not show up
* - Far: How far the camera can see, any object or part of the object further will not show up
*
* !! Do not use extreme value for near and far parameters to prevent z-fighting issues.
*
* 2. Orthographic Camera
* It's different from the Perspective Camera by it's lack of perspective, object has the same size regardless of their
* distance to the camera.
* Here instead of providing the Field of view, we provide how far the camera can see in each direction (left, right,
* top and bottom). then the near and far parameter
*/

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

// With this configuration, the cube look looks flat.
// It's because we are rendering a square area into a rectangle canvas. We need to use the canvas aspect ratio.
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

/* 3.1 Custom Control
* We want to move the camera when we move the cursor. So we need the get the mouse position every time.
* The value returned by ev.clientX and ev.clientY are in pixel and it's better to adjust them (between -0.5 and 0.5).
* Finally update the camera position in the tick function with the cursor coordinates
*/
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (ev) => {
    cursor.x = ev.clientX / sizes.width - 0.5 // Adjust between -0.5 and 0.5
    cursor.y = - (ev.clientY / sizes.height - 0.5)
})

/* 3.2 Orbit Controls
* A second solution is to use the ThreeJS Build in controls.
* They are multiple possible controls :
*       1. Device Orientation Control: Retrieve the device orientation if your device, OS and browser allow it and rotate
*          the camera accordingly (VR experience)
*       2. Fly Controls: enable moving the camera like if you were on a spaceship (allow rotation on each axes, moving
*          forward and backward)
*       3. First Person Controls: Like fly control but with a fixed up axis
*       4. Pointer Lock Controls: Use the pointer lock JS library. Hard to use and almost only handles the pointer lock
*          and camera position
*       5. Orbit Controls: Similar to the control we made with more features (like zoom)
*       6. TrackBall Controls: Like Orbit Control but without vertical angle limit
*       7. Transform Controls: has nothing to do with camera but you can move object through axis with it
*       8. Drag Controls: has nothing to do with camera but you can drag control object with it
*
* Let's use Orbit Controls
*/
const controls = new OrbitControls(camera, canvas) // And that's it !
// controls.target.y = 2 // To change the target, don't forget to update the control
// controls.update()

// Enabled damping effect (smoother), we need to update the control on the tick function if we want it to work
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = elapsedTime;

    // Move the camera with the cursor position
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    // camera.position.y = cursor.y * 3
    // camera.lookAt(mesh.position)

    // Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()