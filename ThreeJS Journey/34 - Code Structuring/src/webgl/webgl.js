import * as THREE from 'three'
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import Camera from "./camera";
import Renderer from "./renderer";
import World from "./world/world";
import Resources from "./utils/resources";
import Debug from "./utils/debug";
import sources from "./sources";

let instance = null

export default class WebGL {
    constructor(canvas) {
        // Singleton
        if (instance) return instance
        instance = this

        // Global access
        window.webgl = this

        // Options
        this.canvas = canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.resources = new Resources(sources)
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // Events
        this.sizes.on('resize', () => {
            this.resize()
        })
        this.time.on('tick', () => {
            this.update()
        })
    }
    resize() {
        console.log("resize")
        this.camera.resize()
        this.renderer.resize()
    }
    update() {
        // console.log("update");
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }
    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
             child.geometry.dispose()

            // Loop through the material properties
            for(const key in child.material) {
                const value = child.material[key]

                // Test if there is a dispose function
                if(value && typeof value.dispose === 'function') {
                    value.dispose()
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()
        if(this.debug.active)
            this.debug.ui.destroy()
    }
}