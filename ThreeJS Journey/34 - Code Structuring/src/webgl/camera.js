import WebGL from "./webgl";
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default class Camera {
    constructor() {
        console.log('camera');
        this.webgl = new WebGL()
        this.sizes = this.webgl.sizes
        this.scene = this.webgl.scene
        this.canvas = this.webgl.canvas

        this.setInstance()
        this.setOrbitControls()

    }
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }
    setOrbitControls() {
        console.log('orbit')
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }
    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }
    update() {
        this.controls.update()
    }
}