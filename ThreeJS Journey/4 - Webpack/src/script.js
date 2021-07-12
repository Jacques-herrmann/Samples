import './style.css';
import * as THREE from 'three';

console.log(THREE);
const sizes = {
    width: 800,
    height: 600
};
// We need at least four element to create a scene :

// 1. A Scene: It's like a container, we will put object, camera and light in it
const scene = new THREE.Scene();

// 2. Some Objects: Can be many things, imported models, particles, lights,...
// To create a geometric object, we need to create a Mesh, it's a combination of a geometry (shape) and a material
// and add it to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 3. A Camera
// For a Perspective Camera, we have at least two parameters:
// - the Field Of View, it's like the value of the zoom. Here we will use a fov of 75 degree but usually use 45.
// - the Aspect Ratio, it's the width divided by the height of the render
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
// By default the camera position is on 0, 0, 0 so inside our cube. Let's move it !
camera.position.z = 3;
scene.add(camera);

// 4. A Renderer
// The renderer render the scene throw the camera view into a canvas HTML element.
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
// Resizing the renderer resize the canvas element
renderer.setSize(sizes.width, sizes.height);
// Use the render function to create a snapshot of the scene (like a photo)
renderer.render(scene, camera);