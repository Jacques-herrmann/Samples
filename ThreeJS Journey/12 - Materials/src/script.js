import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const heightTexture = textureLoader.load("/textures/door/height.jpg")
const normalTexture = textureLoader.load("/textures/door/normal.jpg")
const ambientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')

const cubeEnvironmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
])

// Debug
const gui = new dat.GUI()

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
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)

/* 7. MeshToonMaterial: similar to MeshLambertMaterial but cartoonish. To add more steps to the coloration, you can use
* the gradientMap property and use the gradientTexture
*/
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture
// !!! We see a gradient instead of a clear separation because the gradient is small and the magFilter try to fix it
// with the mipmapping. Set the minFilter and magFilter to THREE.NearestFilter, we can also deactivate the mipmapping
// with gradientTexture.generateMipmaps = false
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false

/* 8. MeshStandardMaterial: use physically based rendering principles (PBR). Like the two precedent one, it supports
* light but with more realistic algorithm and better parameters like roughness ans metalness.
* We have access to the aoMap (ambient occlusion map), it will add shadows where the texture is dark. We can made a
* second set of UV named uv2.
* */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.65
material.metalness = 0.45
// material.map = doorTexture
material.envMap = cubeEnvironmentMapTexture

gui.add(material, "metalness").min(0).max(1).step(0.0001)
gui.add(material, "roughness").min(0).max(1).step(0.0001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    material
)
sphere.position.y = 4
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.5, 64, 120),
    material
)
/* We have access to the aoMap (ambient occlusion map), it will add shadows where the texture is dark. We can made a
* second set of UV named uv2. In our case, It's the same coordinates as the default UV so we are going to re-use it
* */
// sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
// plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
// torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
// material.aoMap = ambientOcclusionTexture
// material.aoMapIntensity = 1

// gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001)

/* Using Height Texture to create relief */
// material.displacementMap = heightTexture
// material.displacementScale = 0.05
// gui.add(material, 'displacementScale').min(0).max(1.5).step(0.0001)

/* Using metalness and roughness texture instead of specifying uniforms
* Don't forget to comment the lines that change this uniforms before using texture*/
// material.metalnessMap = metalnessTexture
// material.roughnessMap = roughnessTexture

/* Using normalMap to fake the normals orientation and add details on the surface regardless of the subdivision */
// material.normalMap = normalTexture
// material.normalScale.set(0.5, 0.5)

/* Using the alphaMap , don't forget to set material transparent property to true*/
// material.transparent = true
// material.alphaMap = alphaTexture

/* Other Materials :
*        - MeshPhysicalMaterial: same as MeshStandardMaterial but with support of a clear coat effect
*        - PointMaterial: Used to create particles
*        -  ShaderMaterial and RawShaderMaterial: used to create your own material
* */

/* 12. Environment Map: it's an image of what is surrounding the scene, it can be used for reflexion or refraction but
* also for general lightning.
* Environment maps are supported by multiple materials but we are going to use MeshStandardMaterial
* Three.js only supports cube environment maps.
* To load a cube texture, we must use the CubeTextureLoader instead of the TextureLoader
*
* Take a look at HDRHaven website to find an hundred of awesome HDRIs (High Dynamic Range Imaging)
* HDRI is one image for all cube faces
* To convert HDRI to cubs map, use this online tool : https://matheowis.github.io/HDRI-to-CubeMap/
* */





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
    sphere.rotation.y = elapsedTime * 0.1
    plane.rotation.y = elapsedTime * 0.1
    torus.rotation.y = elapsedTime * 0.2

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()