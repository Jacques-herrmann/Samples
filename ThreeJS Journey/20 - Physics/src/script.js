import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import CANNON from 'cannon'
import * as dat from 'dat.gui'

/**
 * Physics
 *
 * Here we are going to create a Three.JS world AND a physic world (invisible) base on a physic library.
 *
 * When we add an object to the Three.js world, we also add one in the physics world.
 * On each frame, we let the physics world update itself and we update the Three.js world accordingly.
 *
 * There are many libraries and we need to decide if we want a 3D library or a 2D library. Some 3D interactions might be
 * reduced to 2D physics (pool game, pinball).
 * There are many 3D physics libraries :
 *      - Ammo.js
 *      - Cannon.js
 *      - Oimo.js
 *
 * And 2D Physics libraries :
 *      - Matter.js
 *      - P2.js
 *      - Planck.js
 *      - Box2D.js
 *
 */

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Button to create Sphere
 */
const debugObject = {}
debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
debugObject.createBox = () => {
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
debugObject.reset = () => {
    for (const object of objectsToUpdate) {
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        scene.remove(object.mesh)
    }
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sound
 */
const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * 1. Create a Physics World
 */
const world = new CANNON.World()

/**
 * When testing the collisions between objects, a naive approach to test every Body against avery other Body. This is
 * bad for performances. We call this step the broadphase and we can use a different broadphase for better performances.
 *      - NaiveBroadphase (default) : test avery Bodies against other Bodies
 *      - GridBroadphase : quadrilles the world and only tests Bodies against other Bodies in the same grid box or the
 *          neighbors' grid boxes
 *      - SAPBroadphase (Sweep And Prune) : tests Bodies on arbitrary axes during multiple steps
 *
 * It's recommended to use the last one but using it can eventually generate bugs if Bodies are moving very fast.
 *
 * Event if we use an improved broadphase algorithm, all the Bodies are tested, event those not moving anymore. When the
 * Body speed gets really slow the Body can fall asleep and won't be tested unless a sufficient force is applied.
 */
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true

world.gravity.set(0, - 9.82, 0)

/**
 * Material
 *
 * We can change the friction and bouncing behavior by setting a Material.
 * A Material is just a reference and we should create one for each type of material in the scene (plastic, concrete,
 * jelly, ...)
 *
 * We can create a ContactMaterial which is the combination of two Materials and how they should collide.
 * The first two parameters are the Materials.
 * The third parameter is an object containing collision properties like friction (how much does it rub) and restitution
 * (how much does it bounce).
 * The default value for both is 0.3
 *
 */
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial, // It's possible to have multiple material
    {
        friction: 0.1, // default 0.3
        restitution: 0.7 // default 0.3
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectsToUpdate = []
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

const createFloor = () => {
    // Three.js Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
            color: '#777777',
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture
        })
    )
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    scene.add(floor)

    // Cannon Floor
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({
        // material: defaultMaterial,
        mass: 0,
        shape: floorShape,
    })
    // Don't forget to rotate the floor like in Three.js
    // We Cannon.js we can only use Quaternion and we can use the setFromAxisAngle method. The first parameters is the
    // rotation axis and the second parameter is the angle
    floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(-1, 0, 0),
        Math.PI * 0.5
    )
    world.addBody(floorBody)
}
const createSphere = (radius, position) => {
    // Three.js Sphere
    const mesh = new THREE.Mesh(sphereGeometry, material)
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon Sphere
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        // material: defaultMaterial,
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape
    })
    body.position.copy(position)

    /**
     * Events
     * We can listen to events on Body like 'colide', 'sleep' or 'wakeup'.
     */
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}
const createBox = (height, width, depth, position) => {
    // Three.js Box
    const mesh = new THREE.Mesh(boxGeometry, material)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon Box
    const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)

    /**
     * Events
     * We can listen to events on Body like 'colide', 'sleep' or 'wakeup'.
     */
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

createFloor()

/**
 * Apply Forces
 *
 * There are several way to apply a force on a Body
 *      - applyForce : apply a force from a specified point in space (not necessarily on the Body's surface) like the
 *        wind, a small push on a domino or a strong force on an angry bird
 *      - applyImpulse : like applyForce but instead of adding to the force, will add to the velocity
 *      - applyLocalForce : same as applyForce but the coordinates are local to the Body (0, 0, 0 would be the center of
 *        the Body)
 *      - applyLocalImpulse : same as applyImpulse but the coordinates are local to the Body
 * Because using "force" methods will result in velocity changes, let's not use "impulse" methods.
 */
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    /**
     * Wind simulation
     */
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    /**
     * Update Physics World
     *
     * The CANNON World step function need 3 parameters :
     *      - A fixed time step (we want 60 fps so 1 / 60)
     *      - How much time passed since the last step (We need to subtract elapsedTime from the previous frame to the
     *        current elapsedTime
     *      - How much iterations the world can apply to catch up with a potential delay
     */
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    world.step(1 / 60, deltaTime, 3)
    // console.log(sphereBody.position.y)

    /**
     * Update the Three.js World with the Physical World position
     */
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()

