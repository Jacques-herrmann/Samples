import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const textureLoader = new THREE.TextureLoader()
const doorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const heightTexture = textureLoader.load("/textures/door/height.jpg")
const normalTexture = textureLoader.load("/textures/door/normal.jpg")
const ambientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * 12 - Materials
 * Materials are used to put a color on each visible pixel of the geometries. The algorithms are written in programs
 * called shaders.
 * There are a lot of different material:
 */

/* 1. MeshBasicMaterial: the most basic material */
// const material = new THREE.MeshBasicMaterial({})
// material.map = doorTexture
// material.color = new THREE.Color('#ff00ff')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = alphaTexture
// material.side = THREE.FrontSide // (default) another values : BackSide, DoubleSide

/* 2. MeshNormalMaterial: display a color that looks like the normal texture, normal are information that contains the
* direction of the outside of the face.
* Usually used to debug normals, but the color looks so great that you can use it for your projects
*
*/
// const material = new THREE.MeshNormalMaterial()
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.flatShading = true

/* 3. MeshMatcapMaterial: display a color by using the normals as a reference to pick the right color on a texture that
* looks like a sphere. Used to create an illusion of lighting without light.
* More matcaps here :
*   - https://github.com/nidorx/matcaps
*   - With a 3D by rendering a sphere in front of the camera in a square image or 2D software
*/
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

/* 4. MeshDepthMaterial: simply color the geometry in white if it's close to the near and in black if it's close to the
* far value of the camera. Used to create fog or preprocessing
*/
//const material = new THREE.MeshDepthMaterial()

/* -- The following material will need light to be seen. Let's create it ! -- */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/* 5. MeshLambertMaterial: react to light, nothing will be showed without light. Have new properties related to the
* lights, it's performant but we can see strange patterns on the geometry
*/
// const material = new THREE.MeshLambertMaterial()

/* 6. MeshPhongMaterial: similar to the MeshLambertMaterial, but the strange patterns are less visible, and you can
* also see the light reflection.
* We can control the light reflection with shininess and the color of this reflection with specular
*/
const material = new THREE.MeshPhongMaterial()
material.shininess = 100
material.specular = new THREE.Color(0x1188ff)

/* 7. MeshToonMaterial:
*/


const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 16, 16),
    material
)
plane.position.y = 4
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.5, 16, 16),
    material
)

scene.add(sphere, plane, torus)
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
camera.position.z = 8
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

/* Update the material
* */


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Rotate object
    sphere.rotation.y = elapsedTime * 1
    plane.rotation.y = elapsedTime * 1
    torus.rotation.y = elapsedTime * 2

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()