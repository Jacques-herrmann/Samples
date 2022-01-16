import * as THREE from 'three'
import WebGL from '../webgl'
import Debug from '../utils/debug'
import { config } from '../config'

export default class Environment {
  constructor () {
    this.config = config.lights

    this.webgl = new WebGL()
    this.debug = new Debug()
    this.scene = this.webgl.scene
    this.resources = this.webgl.resources
    this.debug = this.webgl.debug

    this.setLight()
  }

  setLight () {
    this.ambientLight = new THREE.DirectionalLight(this.config.ambient.color, this.config.ambient.intensity)
    this.ambientLight.castShadow = true
    this.ambientLight.shadow.camera.far = 15
    this.ambientLight.shadow.mapSize.set(1024, 1024)
    this.ambientLight.shadow.normalBias = 0.05
    this.ambientLight.position.set(
      this.config.ambient.position.x,
      this.config.ambient.position.y,
      this.config.ambient.position.z
    )
    this.scene.add(this.ambientLight)
    if (this.debug.active) this.debug.debugLight(this.ambientLight, 'ambient')
  }
}
