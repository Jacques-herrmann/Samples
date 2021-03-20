import * as THREE from 'three'
import {normalize} from "../utils/math";
import Sea from './sea'
import Sky from './sky'
import AirPlane from './airplane'

class App {
    constructor() {
        this.container = document.getElementById('app');
        this.mousePos = { x: 0, y: 0 };
        this.addEventListeners();
    }
    addEventListeners() {
        window.addEventListener('load', this.init, false);
        window.addEventListener('resize', this.onResize, false);

        document.addEventListener('mousemove', this.onMouseMove, false);
    }
    init = () => {
        this.createScene();
        this.createLights();
        this.createPlane();
        this.createSea();
        this.createSky();

        // start a loop that will update the objects' positions
        // and render the scene on each frame
        this.loop();
    };
    createScene() {
        this.scene = new THREE.Scene();

        // Add a fog effect to the scene; same color as the
	    // background color used in the style sheet
	    this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

	    // Create a camera
        const aspectRatio = window.innerWidth / window.innerHeight;
        const fieldOfView = 60;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, 1, 10000);
        this.camera.position.x = 0;
        this.camera.position.z = 200;
        this.camera.position.y = 100;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        // alpha -> allow transparency | antialias -> allow antialiasing (signal correction)

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Enabled shadow rendering
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
    };
    createLights() {
        this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
        this.ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
        this.shadowLight = new THREE.DirectionalLight(0xaaaaaa, 0.9);
        this.shadowLight.position.set(150, 350, 350);
        this.shadowLight.castShadow = true;

        // define the visible area of the projected shadow
        this.shadowLight.shadow.camera.left = -400;
        this.shadowLight.shadow.camera.right = 400;
        this.shadowLight.shadow.camera.top = 400;
        this.shadowLight.shadow.camera.bottom = -400;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 1000;

        // define the resolution of the shadow; the higher the better,
        // but also the more expensive and less performant
        this.shadowLight.shadow.mapSize.width = 2048;
        this.shadowLight.shadow.mapSize.height = 2048;

        // to activate the lights, just add them to the scene
        this.scene.add(this.hemisphereLight);
        this.scene.add(this.ambientLight);
        this.scene.add(this.shadowLight);
    };
    createPlane() {
        this.airplane = new AirPlane();
        this.airplane.mesh.scale.set(0.25, 0.25, 0.25);
        this.airplane.mesh.position.y = 100;

        this.scene.add(this.airplane.mesh);
    };
    createSea() {
        this.sea = new Sea();
        this.sea.mesh.position.y = -600;
        this.scene.add(this.sea.mesh);
    };
    createSky() {
        this.sky = new Sky();
        this.sky.mesh.position.y = - 600;
        this.scene.add(this.sky.mesh);
    };
    loop = () => {
        this.sea.mesh.rotation.z += 0.005;
        this.sky.mesh.rotation.z += 0.01;

        this.movePlane();
        this.airplane.pilot.moveHairs();
        this.sea.moveWaves();

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.loop);
    };
    movePlane() {
        const targetX = normalize(this.mousePos.x, -0.75, 0.75, -100, 100);
        const targetY = normalize(this.mousePos.y, -0.75, 0.75, 25, 175);

        this.airplane.mesh.position.y += ( targetY - this.airplane.mesh.position.y ) * 0.1;
        this.airplane.mesh.position.x += ( targetX - this.airplane.mesh.position.x ) * 0.1;

        this.airplane.mesh.rotation.x = ( this.airplane.mesh.position.y - targetY ) * 0.0064;
        this.airplane.mesh.rotation.z = ( targetY - this.airplane.mesh.position.y ) * 0.0128;

        this.airplane.propeller.rotation.x += 0.3;
    }
    onResize = () => {
        const height = window.innerHeight;
        const width = window.innerWidth;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };
    onMouseMove = (ev) => {
        this.mousePos = {
            x: - 1 + ( ev.clientX / window.innerWidth) * 2,
            y: 1 - (ev.clientY / window.innerHeight * 2)
        };
    };
}

const app = new App();