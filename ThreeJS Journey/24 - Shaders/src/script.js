import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import fragmentShader from './shaders/test/fragment.glsl'
import vertexShader from './shaders/test/vertex.glsl'

/**
 * Shaders
 *
 * A shader is one of the main components of WebGL.
 * A shader is a program written in GLSL that is sent to the GPU. They are used to position each vertex of a geometry
 * and to colorize each visible pixel of that geometry. The term 'pixel' isn't accurat because each point in the render
 * doesn't necessarily match each pixel of the scree, and this is why we prefer to use the term 'fragment'.
 *
 * Then we send a lot of data to the shader such as the vertices coordinates, the mesh transformation, information about
 * the camera and its field of view, parameters like the color, the textures, the lights, the fog, etc. The GPU then
 * processes all of this data following the shader instructions, and our geometry appears in the render.
 *
 * There are two type of shaders :
 *      - Vertex Shaders : Used to position the vertices of the geometry. The idea is to send the vertices positions,
 *          the mesh transformations (like its position, rotation and scale), the camera information (position, field of
 *          view, ...). Then the GPU will follow the instructions in the vertex shader to process all of this information
 *          in order to project the vertices on a 2D space that will become our render (canvas).
 *          When using a vertex shader, its code will be applied on every vertex of the geometry. But some data like the
 *          vertex position will change between each vertex (called attribute). Some other data doesn't need to switch
 *          between each vertex like the position of the mesh (called uniform).
 *          The vertex shader happens first. Once the vertices are placed, the GPU knows what pixels of the geometry are
 *          visible and can proceed to the fragment shader.
 *
 *      - Fragment Shaders : Used to color each visible fragment of the geometry.
 *          The same fragment shader will be used for every visible fragment of the geometry. We can send data to it like by
 *          using uniform (like the vertex shader) or we can send data from the vertex shader to the fragment shader (called
 *          varying).
 *          The most straightforward instruction in a fragment shader can be to color all the fragments with the same color.
 *          We get the equivalent of the MeshBasicMaterial if we set only the color property.
 *          Or we can send more data to the shader like a light position. We can then color the fragments according to how
 *          much the face is in front of the light source. We would get the MeshPhongMaterial equivalent (if we had one
 *          light in the scene).
 *
 * We can use ShaderMaterial or a RawShaderMaterial. The ShaderMaterial will have some code automatically added to the
 * shader codes whereas the RawShaderMaterial will have nothing.
 *
 * The shader language is called GLSL (OpenGL Shading Language). There is no console !
 *
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/flag-french.jpg')

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for (let i=0; i<count; i++) {
    randoms[i] = Math.random()
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

// Material

/**
 *  RawShaderMaterial
 *  Common properties like wireframe, side, transparent or flatShading still work. But some others won't work (map,
 *  alphaMap, opacity, color). We need to write these features ourselves.
 *
 * ShaderMaterial is the same but with pre-built uniforms, attributes and precision prepended to the shader codes.
 * No need to define the following uniform and attribute and precision in both shaders :
 *      - uniform mat4 projectionMatrix
 *      - uniform mat4 viewMatrix
 *      - uniform mat4 modelMatrix
 *      - attribute vec3 position
 *      - attribute vec2 uv
 *      - precision mediump float
 *
 */

// const material = new THREE.RawShaderMaterial({
//     vertexShader: vertexShader,
//     fragmentShader: fragmentShader,
//     uniforms: {
//         uFrequency: { value: new THREE.Vector2(10, 5) },
//         uTime: { value: 0 },
//         uColor: { value: new THREE.Color('orange') },
//         uTexture: { value: flagTexture }
//     }
//     // wireframe: true
// })

const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: flagTexture }
    }
    // wireframe: true
})
gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')


// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2/3
scene.add(mesh)

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
camera.position.set(0.25, - 0.25, 1)
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

    //Update material
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()