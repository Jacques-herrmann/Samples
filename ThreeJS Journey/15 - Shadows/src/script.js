import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import {Camera} from "three";
import {CameraHelper} from "three";

/** 6.1 Load the Shadow Texture */
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

/**
 * Shadows
 * The dark shadows in the back of the objects are called core shadows, we miss the drop shadows.
 * Shadows have always been a challenge for real-time 3D rendering, and developers must find tricks to display realistic
 * shadows at a reasonable frame rate. Three.js has a built in solution.
 *
 * 1. How its works
 * When you do one render, Three.js will do a render for each light supporting shadows. Those renders will simulate what
 * the light sees as if it was a camera.
 * During this lights renders, a MeshDepthMaterial replaces all meshes materials.
 * The lights renders are stored as textures and we call those shadow maps. They are then used on every materials
 * supposed to receive shadows and projected on the geometry
 *
 * 2. Activate the shadows
 *  - Active the shadow maps on the renderer (*)
 *  - Go through each object and decide if it can cast/receive a shadow with castShadow/receiveShadow (**)
 *  - Activate the shadows on the light with the castShadow (***)
 *
 * !!! Only the following types of lights support shadows : PointLight, DirectionalLight and SpotLight
 *
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)


directionalLight.castShadow = true // (***)

/** 3. Optimizations
 * 3.1 First we need to optimize the render size, we can access the shadow map in the shadow property of each light. By
 * default the shadow map size is 512x512. We can improve it but keep a power of 2 for the mipmapping.
 */
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

/** 3.2 Then use the near and far properties to only render shadow inside our scene. to help us debug, we can use a
 * CameraHelper with the camera used for the shadow map located in the directionalLight.shadow.camera
 */
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

/**  3.3 Reduce the amplitude (size) of the camera. Use the left, right, top and bottom value to do so.
 * The smaller the values, the more precise the shadow will be. If it's too small, the shadow will be cropped
 */
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

/**  3.4 You can control the blur of the shadow blur with the radius property. this technic doesn't use the proximity of the
 *  camera with the object, it's a general and cheap blur
 */
directionalLight.shadow.radius = 10

/** 4. Same with a SpotLight
 * !!! Mixing shadows doesn't look good and there is not much to do about it
 * Using the same technics, we can improve the shadow quality.
 */
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.castShadow = true

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
/** Because we are using a SpotLight, Three.js is using a PerspectiveCamera. We must change the fov property to adapt
 * the amplitude
 */
spotLight.shadow.camera.far = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6


spotLight.position.set(0, 2, 2)
scene.add(spotLight.target)
scene.add(spotLight)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

/** 5. Again with a PointLight
 *
 * Because the point light illuminates in every direction, Three.js will have to render each of the 6 directions to
 * create a cube shadow map. The camera helper you see is the camera's position in the last of those 6 renders (which
 * is downward). Doing all those renders can generate performance issues. Try to avoid having too much PointLight with
 * shadows enabled.
 *
 * We only can tweak the mapSize, near and far properties
 */
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5

pointLight.position.set(-1, 1, 0)
scene.add(pointLight)

const pointLightCameraHepler = new CameraHelper(pointLight.shadow.camera)
pointLightCameraHepler.visible = false
scene.add(pointLightCameraHepler)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true // (**)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)

/** 6.2 Change the plane material
 * Instead of MeshStandardMaterial use a MeshBasicMaterial on the plane material with the bakedShadow.
 * */
// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(5, 5),
//     new THREE.MeshBasicMaterial({
//         map: bakedShadow
//     })
// )
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

plane.receiveShadow = true // (**)

/** 7. Dynamic Baked Shadow
 * To do so, we will use a more simpler baked shadow and move it so it stays under the object.
 * Create a plane slightly above the floor with an alphaMap using the simpleShadow
 */
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.001

scene.add(sphere, plane, sphereShadow)

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

/**  3.5 Use the shadow map algorithm. They are different types of algorithms that can be applied to shado maps:
 *      1. BasicShadowMap : Very performant but lousy quality
 *      2. PCFShadowMap : Less performant but smoother edges (default)
 *      3. PCFSoftShadowMap : Less performant but even softer edges
 *      4. VSMShadowMap : Less performant, more constraints, can have unexpected results
 *
 * !!! The radius doesn't work with the PCFSoftShadowMap
 */
renderer.shadowMap.type = THREE.PCFSoftShadowMap


/** 6. Baked Shadow
 * A good alternative to Three.js shadows is baked shadows. We can integrate shadows in textures that we apply on
 * materials.
 * So let's deactivate all shadows from the renderer.
 *
 * !!! Baked shadow are not dynamic
 * */
// renderer.shadowMap.enabled = true  // (*)



/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    /** 7.1 Move the Sphere and update its Shadow */
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()