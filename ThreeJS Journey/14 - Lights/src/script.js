import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 * There are multiple type of light:
 *      - 1. Ambient Light : applies omnidirectional lightning, used to simulate light bouncing
 *      - 2. Directional Light : applies a sun-like effect as if the sun rays were traveling in parallel
 *      - 3. Hemisphere Light : similar to the AmbientLight but with a different color from the sky than the color from
 *          the ground.
 *      - 4. PointLight : like a lighter, the light starts at an infinitely small point and spreads uniformly in
 *          every directions. By default the light intensity doesn't fade. We can control the fade distance and how fast it
 *          fades with distance and decay
 *      - 5. RectAreaLight : works like the big rectangle lights you can see on the photoshoot set. It's a mix between
 *          a directional light and a diffuse light. (only work with MeshStandardMaterial and MeshPhysicalMaterial)
 *      - 6. SpotLight : like a flashlight, it's a cone of light starting at a point and oriented in a direction. To
 *          rotate it, we need to add its target property to the scene and move it (it's an object 3D). Don't forget to
 *          add the target to the scene !
 *
 * Lights can cost a lot when it comes to performances. We need to try to add as few lights as possible and try to use
 * the lights that cost less
 *
 * 1. Light Cost :
 * AmbientLight|HemisphereLight < DirectionalLight|PointLight < SpotLight|RectAreaLight
 *
 * 2. Baking :
 * It is possible to bake the light into the texture, this can be done in a 3D software. The drawback is that we cannot
 * move the light anymore and we have to load huge textures
 *
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 0.5, 3, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

const rectareaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectareaLight.position.set(-1.5, 0, 1.5)
rectareaLight.lookAt(new THREE.Vector3())
scene.add(rectareaLight)

const spotLight = new THREE.SpotLight(0x78ff0, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
scene.add(spotLight.target)
spotLight.target.position.x = - 0.75

/** 3. Helpers:
 * To assist us with positioning the lights, we can use helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight) // no size here
scene.add(spotLightHelper)
window.requestAnimationFrame(() => {
    spotLightHelper.update() // we also need to call the update method after moving the target (may be a bug)
})

const rectareaLightHelper = new RectAreaLightHelper(rectareaLight)
scene.add(rectareaLightHelper)


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()