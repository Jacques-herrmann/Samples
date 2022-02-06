import WebGL from './webgl'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { config } from './config'
import Debug from './utils/debug'

export default class Camera {
  constructor () {
    this.config = config.global.camera

    this.webgl = new WebGL()
    this.debug = new Debug()
    this.sizes = this.webgl.sizes
    this.scene = this.webgl.scene
    this.canvas = this.webgl.canvas

    this.setInstance()
    if (this.debug.active) {
      this.setOrbitControls()
      this.setDebug()
    }
  }

  setInstance () {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      200
    )
    this.instance.position.set(
      this.config.position.x,
      this.config.position.y,
      this.config.position.z
    )
    this.scene.add(this.instance)
  }

  setOrbitControls () {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }

  resize () {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update () {
    this.controls.update()
  }

  setDebug () {
    this.debug.debugCamera(this.instance)
    // console.log('debug')
  }
}
