import * as THREE from "three"
let text = null;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

createBackground();
createLight();
createText();
render();

function render() {
    renderer.render(scene, camera);
    if (text !== null) {
        text.rotation.x += 0.01;
        text.rotation.y += 0.05;
    }
    requestAnimationFrame(render)
}
function createBackground() {
    const space = new THREE.TextureLoader().load("assets/space.jpg", function (texture) {
        scene.background = texture;
    });
}
function createLight() {
    const ambient = new THREE.AmbientLight(0xffeecc, 0.2);
    const point = new THREE.PointLight(0xaaffcc, 1);
    scene.add(ambient);
    scene.add(point);
    point.position.set(0, -10, 30);
}
function createText() {
    const texture = new THREE.TextureLoader().load("assets/magma.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.15, 0.15);
    const font = new THREE.FontLoader().load("assets/Star Jedi_Regular.json", function (font) {
        const geometry = new THREE.TextGeometry("3D", {
            font: font,
            size: 5.9,
            height: 1,
            curveSegments: 20,
            bevelEnabled: false,
            bevelThickness: .2,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 2
        });
        const material = new THREE.MeshPhongMaterial({ map: texture });
        text = new THREE.Mesh(geometry, material);
        geometry.center();
        text.position.z = -1;
        text.rotation.set(Math.PI / 180 * -40,
            Math.PI / 180 * -2,
            Math.PI / 180 * 5);
        text.scale.set(1, 1.4, 1);
        scene.add(text)
    })
}