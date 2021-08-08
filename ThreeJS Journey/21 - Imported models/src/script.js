import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

/**
 * Imported models
 *
 * To create complex shapes, we better use a dedicated 3D software.
 * They are many 3D model formats, each one responding to a problem :
 *      - data
 *      - weight
 *      - compression
 *      - compatibility
 *      - copyright
 *      - ...
 *
 * Popular formats are : OBJ, FBX, STL, PLY, COLLADA, 3DS, GLTF
 * One format is becoming a standard and should cover most of our needs (GLTF) :
 * - GLTransmission Format
 * - Mode by the Khronos Group (OpenGL, WebGL, Vulkan, Collada and many members like AMD, Nvidia, Apple,Google,...)
 * - Supports different sets of data like geometries, materials, cameras, lights, scene graph, animations, skeletons,
 *   morphing etc.
 * - Various formats like json, binary, embed textures.
 * - Becoming the standard when it comes to real-time and most 3D softwares, games engines and libraries support it.
 *
 * You don't have to use GLTF in all cases. Questions the data you need, the weight of the file, how much time to
 * decompress it, etc.
 *
 * The GLTF team provides various models for testing : https://github.com/KhronosGroup/glTF-Sample-Models
 *
 * A GLTF file can have different formats :
 *      - gtTF (default): Multiple file.
 *          * A JSON that contains cameras, lights, scenes, materials, objects transformations, but no geometries nor
 *            textures.
 *          * A binary file that actually contains data like the geometries (vertices positions, UV coordinates, normals,
 *            colors, etc.
 *          * An image corresponding to the texture
 *        By loading the .gltf file, the others files should load automatically
 *      - glTF-Binary : Only one binary file that contains all the data. Usually lighter, it can be easier to load but
 *        harder to alter its data (like texture)
 *      - glTF-Draco : Like the glTF default format but the buffer data is compressed using the Draco algorithm.
 *      - glTF-Embedded : One file like the glTF-Binary format, JSON format. Heavier
 *
 * It's a matter of how you want to handle the assets. If you want to be able to alter files, you better go for the
 * glTF-default. Loading multiple file can be faster. If having one file is better for you, you better go for
 * glTF-Binary.
 * Anyway you must decide if you want to use the Draco compression or not.
 *
 * 
 * 2. Draco Version 
 * Draco version can be much lighter than the default version. 
 * Compression is applied to the buffer data (typically the geometry)
 * Draco is not exclusive to glTF but they got popular at the same time and implementation went faster with glTF exporters.
 * Google develops the algorithm under open-source license
 * 
 * We need to provide a DRACOLoader instance to our GLTFLoader. The decoder is also available in Web Assembly, and it can 
 * run in a worker to improve performances significantly. Three.js already povided the code in the exemples and copy it into
 * the static folder.
 * 
 * Draco compression is not a win-win situation.
 * The geometries are lighter but the user has to load the DRACOLoader class and the decoder.
 * It also take time and resources for your computer to decode a compressed file.
 * You'll have to adapt accordingly to the project.
 * 
 * 3. Animations
 * The loded gltf object contains a animations property composed of multiple AnimationClip.
 * We need to create a AnimationMixer. 
 * An AnimationMixer is like a player associated with an object that can contain one or many AnimationClips.
 * 
 */


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 * 
 * There are multiple ways of addings a model to our scene
 *      - Add the whole scene in our scene
 *      - Add the children of the scene to our scene and ignore the cameras
 *      - Filter the children before adding them to the scene
 *      - Add only the Mesh and end up with a model with a wrong scale, position and rotation
 *      - Open the file in a 3D software, clen it and export it again
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const glTFLoader = new GLTFLoader()
glTFLoader.setDRACOLoader(dracoLoader)

let mixer = null

glTFLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    ///models/Duck/glTF-Draco/Duck.gltf',
    //'/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])

        action.play()

        console.log(gltf)
        // scene.add(gltf.scene.children[0])

        /* Because loading an object to the scene remove it from the loaded file, we need can't use a simple for loop.
         * We need to duplicate the children array in order to have an unaltered independent array.
         */

        // const children = [...gltf.scene.children]    
        // for (const child of children) {
        //    scene.add(child)
        //}

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
    },
)


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
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
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if (mixer) mixer.update(deltaTime)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()