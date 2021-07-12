import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animation
// requestAnimationFrame is a function that call another provided function on the next frame, the same function is call on each new frame
// The problem here is that the number of call per second for this function depend on the screen you use.
// To fix it we need to know how much time it's been since the last tick

// 1 - Using Date.now()
//
// let time = Date.now()
//
// const tick = () => {
//     // Time
//     const currentTime = Date.now()
//     const deltaTime = currentTime - time
//     time = currentTime
//     console.log(deltaTime);
//
//     // Update objects
//     mesh.rotation.x += 0.001 * deltaTime
//     mesh.rotation.y += 0.001 * deltaTime
//
//     // Render on each frame
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
// }

// 2 - Using the Clock class
// const clock = new THREE.Clock()
//
// const tick = () => {
//     // Time
//     const elapsedTime = clock.getElapsedTime() // For one rotation per second multiply by Pi * 2
//     // !!! Do not use getDelta for that !!!
//     console.log(elapsedTime);
//
//     // Update objects
//     camera.position.x = Math.sin(elapsedTime)
//     camera.position.y = Math.cos(elapsedTime)
//     camera.lookAt(mesh.position)
//
//     // Render on each frame
//     renderer.render(scene, camera)
//     window.requestAnimationFrame(tick)
// }

// 3 - Using a library like GSAP
// Greensock has is own clock, no need to update it in our tick function
gsap.to(mesh.position, {
    duration: 1,
    delay: 1,
    x: 2
})
gsap.to(mesh.position, {
    duration: 1,
    delay: 1,
    y: 2
})
const tick = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()