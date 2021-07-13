import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Geometries
 * Geometries are composed by vertices (coordinates in 3D space) and faces (triangles that join those vertices to
 * create a surface). We use geometries to create meshes, but you can also use geometries to form particles.
 * Each vertex (singular of vertices) will correspond to a particle. We can store more data than the position in the
 * vertices. A good example would be to talk about the UV coordinates or the normals.
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object

/* 1. Built In Geometries
* All the following geometries inherit from BufferGeometry. this class has many built in methods like translate,
* rotate and normalize,... All will moved the vertices of the geometry.
* Here the main geometry type (all have examples) :
*       1. BoxGeometry: a simple box like we use before
*       2. PlaneGeometry: a rectangle plane
*       3. CircleGeometry: a disc or a portion of a disc (like a pie chart).
*       4. ConeGeometry: a cone or a portion of a cone. You can open or close the base of the cone.
*       5. CylinderGeometry: a cylinder. You can open or close the ends of the cylinder and you can change the radius
*          of each end.
*       6. RingGeometry: a flat ring or portion of a flat circle.
*       7. TorusGeometry: a ring that has a thickness (like a donut) or portion of a ring.
*       8. TorusKnotGeometry: some sort of knot geometry.
*       9. DodecahedronGeometry: a 12 faces sphere. You can add details for a rounder sphere.
*       10. OctahedronGeometry: a 8 faces sphere. You can add details for a rounder sphere.
*       11. TetrahedronGeometry: a 4 faces sphere (it won't be much of a sphere if you don't increase details).
*           You can add details for a rounder sphere.
*       12. IcosahedronGeometry: a sphere composed of triangles that have roughly the same size.
*       13. SphereGeometry: the most popular type of sphere where faces looks like quads (quads are just a combination
*           of two triangles).
*       14. ShapeGeometry: a shape based on a path.
*       15. TubeGeometry: a tube following a path.
*       16. ExtrudeGeometry: an extrusion based on a path. You can add and control the bevel.
*       17. LatheGeometry: a vase or portion of a vase (more like a revolution).
*       18. TextGeometry: a 3D text. You'll have to provide the font in typeface json format.
*
* By combining this geometry, we can create pretty complex shapes
* Let's begin with a Box example. A Box Geometry has 6 parameters (width, height, depth and widthSegments,
*  heightSegments, depthSegment). The last three define how many subdivisions (triangles) should compose the relative
* face. A value of one (default) will divide the face by 2 while a subdivision of 2 will create 8 triangles per face.
*/
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

/* 2. Create our own Buffer Geometry
* To store buffer geometry data we will use a Float32Array. It's a typed array who can only store floats, have a fixed
* length and it's easier to handle for a computer.
*
* We can convert that Array to a BufferAttribute like that:
*       const positionsArray = new Float32Array([
*           0, 0, 0, // First vertex
*           0, 1, 0, // Second vertex
*           1, 0, 0  // Third vertex
*       ])
*       const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
* 3 corresponds to how much values compose one vertex
*
* Then wa can add this BufferAttribute to our BufferGeometry with :
*       setAttribute('position', positionsAttribute)
*
* 'position' is the name that will be used in the shaders
*
*/

const bufferGeometry = new THREE.BufferGeometry()
const count = 500
const positionsArray = new Float32Array(count * 3 * 3) // * 3 vertices * 3 coordinates
for (let i = 0; i <= count * 3 * 3; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 4 // -0.5 center the object (position between -0.5 and 0.5)
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
bufferGeometry.setAttribute('position', positionsAttribute)

/* 3. Index
* Some geometry have faces that share common vertices
* When creating a BufferGeometry we can specify a bunch of vertices and then the indices to create the face and re-use
* vertices multiple times.
* This method is hard to use but allow to increase the performances because less information is send to the GPU.
* Take a look to the documentation
* */


const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true // Wireframe show the division of the geometry
})
const mesh = new THREE.Mesh(bufferGeometry, material)
scene.add(mesh)

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
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