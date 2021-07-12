import './style.css'
import * as THREE from 'three'
import {Vector3} from "three";

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

// - 5 Transform Objects
// We have four properties to transform objects (position, scale, rotation adn quaternion).
// All are possessed by the Object3D class in ThreeJS.

// 5.1 Position
mesh.position.x = 0.7
mesh.position.y = - 0.6
mesh.position.z = 1
// is equivalent to mesh.position.set(0.7, -0.6, 1)

// Position inherit from Vector3 class which has many useful methods (see the documentation)
console.log(mesh.position.length());
console.log(mesh.position.distanceTo(new Vector3(1, 1, 1))); // Works with camera.position
// mesh.position.normalize() // Reduce the vector position until the length equal 1.

// 5.2 Scale
mesh.scale.x = 2
mesh.scale.y = 0.5
mesh.scale.z = 0.5
// is equivalent to mesh.scale.set(2, 0.5, 0.5)

// 5.3 Rotation (with rotation or quaternion, one updating the other)
// 5.3.1 rotation properties
// rotation also has x, y and z properties but it's an Euler, to rotate your object just modifying the axis you want to turn around
mesh.rotation.y = Math.PI // The unit is radians, to use degrees simply convert your degrees value to radian with this formula: value * Math.PI / 180

// Be careful, when you rotate on multiple axis, another rotation on another axis may not doing what you expect.
// This is called gimbal lock
// To deal with it you can reorder you axis by using the related method
mesh.rotation.reorder('YXZ')
mesh.rotation.y = Math.PI * 0.25
mesh.rotation.x = Math.PI * 0.25

// 5.3.2 Quaternion, the second solution
// It also expresses a rotation but in a more mathematical way, see documentation for more detail

// 5.4 Axis Helper
// There is a great class named AxesHelper to help you positioning your objects.
// This class display a colored line for each axis.
const axisHelper = new THREE.AxisHelper(2)
scene.add(axisHelper)

scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// 5.5 Orient the camera to our object with lookAt
camera.lookAt(mesh.position) //  you can use any Vector3 value

// 5.6 To move multiple objects in the same time, put your object in the same Group and move the group
const group = new THREE.Group()
group.position.y = -0.1
group.scale.x = 0.4
group.scale.y = 0.4
group.scale.z = 0.4
group.rotation.y = 1
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = -2
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = 2
group.add(cube1)
group.add(cube2)
group.add(cube3)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
