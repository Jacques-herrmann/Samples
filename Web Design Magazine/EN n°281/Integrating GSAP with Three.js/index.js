import * as THREE from "three"
import TweeMax from "gsap"

const objects = [];

// Create the Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerWidth, 0.1, 1000);
camera.position.z = 500;
const renderer = new THREE.WebGLRenderer({ antialias: true} );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add some objects
const geometry = new THREE.BoxBufferGeometry(40, 40);
const material = new THREE.MeshNormalMaterial();
for (let i=0; i < 100; i ++) {
    let object = new THREE.Mesh(geometry, material);
    // Move the object
    object.position.x = Math.random() * 1000 - 500;
    object.position.y = Math.random() * 600 - 300;
    object.position.z = Math.random() * 800 - 400;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.x = Math.random() * 2 + 1;
    object.scale.y = Math.random() * 2 + 1;
    object.scale.z = Math.random() * 2 + 1;

    scene.add(object);
    objects.push(object);
}

// Render the scene
const render = function () {
    renderer.render(scene, camera);
};
// Use GSAP loop to render
TweeMax.ticker.add(render);

// Tween all objects
for (let i=0; i<objects.length; i++) {
    const tween = TweeMax.to(objects[i].rotation, 2 + Math.random() * 2, {
        x: Math.PI / 180 * 360,
        y: Math.PI / 180 * 360,
        yoyo: true,
        repeat: -1,
        ease: "elastic.easeInOut",
        delay: Math.random() * 5
    });
}