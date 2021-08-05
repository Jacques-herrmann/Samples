import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Raycaster
 *
 * A Raycaster can cast a ray in a specific direction and test what objects intersect with it.
 *
 * Usage examples :
 *      - Detect if there is a wall in front of the player
 *      - Test if the laser gun hit something
 *      - Test if something is currently under the mouse to simulate mouse events
 *      - Show an alert message if the spaceship is heading toward a planet
 *
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 *
 * We can use the set method to set the origin and the direction. The direction has to be normalized
 */
const raycaster = new THREE.Raycaster()
//
// const rayOrigin = new THREE.Vector3(-3 , 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()
//
// raycaster.set(rayOrigin, rayDirection)

/**
 * There are two options to cast a ray:
 *      - intersectObject -> to test one object
 *      - intersectObjects -> to test an array of objects
 * The result is always an array (even if you are testing only one object) because a ray can go through the same object
 * multiple times.
 *
 * Each item contains useful information :
 *      - distance : distance between the origin of the ray and the collision point
 *      - face : what face of the geometry was hit by the ray
 *      - faceIndex : what index of that face
 *      - object : what object is concerned by the collision
 *      - point : a Vector3 of the exact position of the collision
 *      - uv : the UV coordinates in that geometry
 */

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)
// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

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
 * 2. Hovering with mouse
 *
 * We need the coordinates of the mouse but not in pixels. We need a value that goes from -1 to +1 in horizontal and
 * vertical axes
 */
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (_event) => {
    mouse.x = _event.clientX / sizes.width * 2 - 1
    mouse.y = - (_event.clientY / sizes.height) * 2 + 1
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

/**
 * 3. mouseEnter and mouseLeave events
 *
 * We will create a "witness" variable containing the currently hovered object.
 * If an object intersects, but there was'nt one before, a mouseenter happened
 * If no objects intersects, but there was one before, a mouseleave happened
 *
 */
let currentIntersect = null

/**
 * 4. Click event
 */
window.addEventListener('click', (_event) => {
    if (currentIntersect) {
        console.log('click on a sphere')
        switch(currentIntersect.object)
        {
            case object1:
                console.log('click on object 1')
                break

            case object2:
                console.log('click on object 2')
                break

            case object3:
                console.log('click on object 3')
                break
        }
    }
})

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.5) * 1.5
    object2.position.y = Math.cos(elapsedTime * 0.8) * 2
    object3.position.y = Math.sin(elapsedTime) * 1.8

    /**
     * If we want to test things while they are moving, we have to do the test on each frame.
     */
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // rayDirection.normalize()
    //
    // raycaster.set(rayOrigin, rayDirection)
    //

    /** 2 */
    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    // console.log(intersects);
    for (const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }
    for (const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }

    /** 3 */
    if (intersects.length) { // Something being hovered
        if (currentIntersect === null) {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect) {
            console.log('mouse leave')
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