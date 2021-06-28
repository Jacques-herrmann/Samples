import * as THREE from "three"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;
camera.position.y = 10;
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

createLight();
createGround();
createSphere();
render();

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render)
}
function createLight() {
    // Lightning
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 20, 0);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    const helper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(helper);
    scene.add(light);
}
function createGround() {
    const geometry = new THREE.PlaneBufferGeometry(50, 50, 32, 32);
    const texture = new THREE.TextureLoader().load( "./image/ground.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const material = new THREE.MeshStandardMaterial({ map: texture });
    // const material = new THREE.MeshBasicMaterial({ color: "#45c6a2" });

    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = - Math.PI * 0.5;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground)
}
function createSphere() {
    const geometry = new THREE.SphereBufferGeometry(5, 32, 32);
    // const material = new THREE.MeshBasicMaterial({color: "#7e589d"});
    const material = new THREE.MeshPhongMaterial({ color: "#7e589d" }); // Visible only with light
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 3;
    mesh.castShadow = true;
    scene.add(mesh);
}