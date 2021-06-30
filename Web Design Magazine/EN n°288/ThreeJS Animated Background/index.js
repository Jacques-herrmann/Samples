import * as THREE from "three"
import {MeshLine, MeshLineMaterial} from "./utils/THREE.MeshLine"
import { getRandomFloat, getRandomInt } from "./utils/math";
import {Vector3} from "three";

const COLORS = ["#98FB98", "#f4ca1c", "#59C3C3", "#F45B69"];
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

class WebGL {
    constructor(w, h) {
        this.meshCount = 0;
        this.meshListeners = [];
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
        this.camera.position.z = 10;
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.dom = this.renderer.domElement;

        this.update = this.update.bind(this);
        this.resize = this.resize.bind(this);
        this.resize(w, h)
    }
    add(mesh) {
        this.scene.add(mesh);
        if (!mesh.update) return;
        this.meshListeners.push(mesh.update);
        this.meshCount++;
    }
    remove(mesh) {
        const idx = this.meshListeners.indexOf(mesh.update);
        if (idx < 0) return;
        this.scene.remove(mesh);
        this.meshListeners.splice(idx, 1);
        this.meshCount--;
    }
    update() {
        let i = this.meshCount;
        while (--i >= 0) {
          this.meshListeners[i].apply(this, null);
        }
        this.renderer.render(this.scene, this.camera);
    }
    resize(w, h) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}

class WindLine extends THREE.Mesh {
    constructor({
        nbrOfPoints = getRandomFloat(4, 5),
        length = getRandomInt(4, 5),
        disruptedOrientation = getRandomFloat(-0.2, 0.2),
        speed = 0.003,
        color = new THREE.Color("#000000")
        } = {}) {
        const points = [];
        const segmentLength = length / nbrOfPoints;
        const turbulence = 0.5;

        for (let i=0; i<nbrOfPoints; i++){
            points.push(new THREE.Vector3(
                i * segmentLength,
                (Math.random() * (turbulence * 2)) - turbulence,
                (Math.random() * (turbulence * 2)) - turbulence,
            ))
        }
        const curve = new THREE.SplineCurve(points);
        const path = new THREE.Path(curve.getPoints(50));
        const geometry = path.createPointsGeometry(50);
        const line = new MeshLine();
        line.setGeometry(geometry);

        const dashArray = 2;
        const dashRatio = 0.99;
        const dashOffsetRight = 1.01;
        const dashOffsetLeft = dashArray * dashRatio;

        super(line.geometry, new MeshLineMaterial({
            lineWidth: 0.05,
            dashArray,
            dashRatio,
            dashOffset: dashOffsetLeft,
            opacity: 0,
            transparent: true,
            depthWrite: false,
            color
        }));
        this.position.set(getRandomFloat(-10, 10), getRandomFloat(-6, 5), getRandomFloat(-2, 10));
        this.speed = speed;
        this.dying = dashOffsetRight;
        this.update = this.update.bind(this)
    }
    update() {
        this.material.uniforms.dashOffset.value -= this.speed;
        const opacityTargeted = this.material.uniforms.dashOffset.value > this.dying + 0.25 ? 1: 0;
        this.material.uniforms.opacity.value += (opacityTargeted - this.material.uniforms.opacity.value) * 0.08;
    }
    isDied() {
        return this.material.uniforms.dashOffset.value < this.dying;
    }
}

class Wind extends THREE.Object3D {
    constructor() {
        super();
        this.lines = [];
        this.lineNbr = -1;
        this.update = this.update.bind(this);
    }
    addWindLine() {
        const line = new WindLine({ color: new THREE.Color(COLORS[getRandomInt(0, COLORS.length - 1)])});
        this.lines.push(line);
        this.add(line);
        this.lineNbr += 1;
    }
    removeWindLine() {
        this.remove(this.lines[0]);
        this.lines[0] = null;
        this.lines.shift();
        this.lineNbr-= 1;
    }
    update() {
        if (Math.random() < 0.65) {
            this.addWindLine();
        }
        for (let i=this.lineNbr; i>=0; i--) {
            this.lines[i].update();
            if(this.lines[i].isDied()) this.removeWindLine();
        }
    }
}

class CameraMouseControl {
    constructor(camera) {
        this.camera = camera;
        this.lookAt = new Vector3();
        this.position = { x:0, y:0 };
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.update = this.update.bind(this);
        document.body.addEventListener('mousemove', this.handleMouseMove);
    }
    handleMouseMove(event) {
        this.position.x = - (event.clientX / window.innerWidth - 0.5) * 8;
        this.position.y = (event.clientY / window.innerHeight - 0.5) * 4;
    }
    update() {
        this.camera.position.x += (this.position.x - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.position.y - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.lookAt);
    }
}
const webgl = new WebGL(windowWidth, windowHeight);
document.body.appendChild(webgl.dom);
const windLines = new Wind();
webgl.add(windLines);
const cameraControl = new CameraMouseControl(webgl.camera);

function _onResize() {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  webgl.resize(windowWidth, windowHeight);
}
window.addEventListener('resize', _onResize);
window.addEventListener('orientationchange', _onResize);
function render() {
    webgl.update();
    cameraControl.update();
    requestAnimationFrame(render);
}
render();