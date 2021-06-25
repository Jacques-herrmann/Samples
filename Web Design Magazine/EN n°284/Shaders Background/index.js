import * as THREE from "three"
import fragment from './shaders/Variant 3/fragment.glsl'
import vertex from './shaders/Variant 3/vertex.glsl'

const starttime = Date.now();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock();

// Initialize the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;
const canvas = document.getElementById("background");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create uniforms
const uniforms = {
    iTime: { type: "f", value: 0.0 },
    iResolution: { type: "v2", value: new THREE.Vector2() },
    iMouse: { type: "v2", value: new THREE.Vector2() }
};
uniforms.iResolution.value.x = window.innerWidth;
uniforms.iResolution.value.y = window.innerHeight;

// Create a plane to apply shaders

const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
});
// const material = new THREE.MeshNormalMaterial();
const geometry = new THREE.PlaneBufferGeometry(4, 4);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
renderer.render(scene, camera);

function render() {
    uniforms.iTime.value += clock.getDelta();
    renderer.render(scene, camera);
    requestAnimationFrame(render)
}
function onWindowResize() {
    // update the camera and renderer
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    //update the uniforms
    uniforms.iResolution.value.x = window.innerWidth;
    uniforms.iResolution.value.y = window.innerHeight;
}
function onDocumentMouseMove(event) {
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    uniforms.iMouse.value.x = mouse.x;
    uniforms.iMouse.value.y = mouse.y;
}
window.addEventListener( "resize", onWindowResize, false );
document.addEventListener("mousemove", onDocumentMouseMove, false );

render();