import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const objects = [];
const num = 20;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0.0, -1.0, 10.0);
// camera.rotation.y = .5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const path = 'assets/';
const urls = [
    path + 'posx.jpg', path + 'negx.jpg',
    path + 'posy.jpg', path + 'negy.jpg',
    path + 'posz.jpg', path + 'negz.jpg',
];
const envMap = new THREE.CubeTextureLoader().load(urls);
scene.background = envMap;

// //controls
// const controls = new OrbitControls( camera, renderer.domElement );
// controls.enableZoom = false;
// controls.enablePan = false;
// controls.minPolarAngle = Math.PI / 4;
// controls.maxPolarAngle = Math.PI / 1.5;

for (let i=0; i<=num; i++) {
    const geometry = new THREE.SphereBufferGeometry(1, 30, 30);
    const material = new THREE.MeshPhysicalMaterial({ envMap: envMap, metalness: 1.0, roughness: 0.0 });
    const object = new THREE.Mesh(geometry, material);
    object.position.set(
        Math.random() * 20.0 - 10.0,
        Math.random() * 20.0 - 10.0,
        Math.random() * 20.0 - 10.0
    );
    const a = new THREE.Vector3(0, 0, 0);
    const b = object.position;
    const d = a.distanceTo(b);
    object.distance = d;
    object.radians = Math.random() * 360 * Math.PI/180;
    object.radians2 = Math.random() * 360 * Math.PI/180;
    scene.add(object);
    objects.push(object)
}

const animate = function () {
    requestAnimationFrame(animate);
    for (let i=0; i<=num; i++) {
        const o = objects[i];
        if (i % 2 === 0) {
            o.radians += .01;
            o.radians2 += .01;
        } else {
            o.radians -= .01;
            o.radians2 -= .01;
        }
        o.position.x = (Math.cos(o.radians) * o.distance);
        o.position.z = (Math.sin(o.radians) * o.distance);
        o.position.y = (Math.sin(o.radians2) * o.distance * 0.5);
    }
    renderer.render(scene, camera);
};
animate();

document.addEventListener('mousedown', onDocumentMouseDown, false);
function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects, true);
    if (intersects.length > 0) {
        const active = intersects[0].object;
        active.material.color.setHex(Math.random() * 0xffffff);
    }
}

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects, true);
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
}

// Touch for mobile
document.addEventListener('touchstart', onDocumentTouchStart, false);
function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects, true);
        if (intersects.length > 0) {
            const active = intersects[0].object;
            active.material.color.setHex(Math.random() * 0xffffff);
        }
    }
}

