import * as THREE from 'three'
import Sizes from './utils/sizes'
import Time from './utils/time'
import Camera from './camera'
import Renderer from './renderer'
import World from './world/world'
import AssetManager from './utils/asset_manager'
import Debug from './utils/debug'
import sources from './sources'
import { config } from './config'

let instance = null

export default class WebGL {
  constructor (canvas) {
    // Singleton
    if (instance) return instance
    instance = this

    // Options
    this.canvas = canvas

    // Setup
    this.config = config.global.scene
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.assetManager = new AssetManager(sources)
    this.scene = new THREE.Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    // Events
    this.sizes.on('resize', this.resize.bind(this))
    this.time.on('tick', this.update.bind(this))

    if (this.debug.active) this.debug.debugScene(this.scene)
    this.setupScene()
  }

  resize () {
    console.log('resize')
    this.camera.resize()
    this.renderer.resize()
  }

  update () {
    // console.log("update");
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy () {
    this.sizes.off('resize', this.resize)
    this.time.off('tick', this.update)

    // Traverse the whole scene
    this.scene.traverse((child) => {
      child.geometry.dispose()

      // Loop through the material properties
      for (const key in child.material) {
        const value = child.material[key]

        // Test if there is a dispose function
        if (value && typeof value.dispose === 'function') {
          value.dispose()
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()
    if (this.debug.active) {
      this.debug.ui.destroy()
    }
  }

  updateDebug () {
    console.log('debug update')
  }

  setupScene () {
    this.scene.background = new THREE.Color(this.config.background) || null
  }
}
