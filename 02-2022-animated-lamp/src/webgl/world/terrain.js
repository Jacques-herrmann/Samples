import * as THREE from 'three'
import WebGL from '../webgl'
import Debug from '../utils/debug'
import { config } from '../config'

export default class Terrain {
  constructor () {
    this.webgl = new WebGL()
    this.debug = new Debug()
    this.scene = this.webgl.scene
    this.assetManager = this.webgl.assetManager

    // Setup
    this.setMaterial()
    this.setModel()
  }

  setMaterial () {
    // this.texture = this.assetManager.items.terrainTexture
    // this.texture.flipY = false
    // this.texture.encoding = THREE.sRGBEncoding
    this.material = new THREE.MeshStandardMaterial({ color: config.materials.backdrop.color })
    this.benchMaterial = new THREE.MeshStandardMaterial({ color: config.materials.bench.color })
  }

  setModel () {
    this.model = this.assetManager.items.terrainModel.scene
    // this.model.material = this.material
    this.model.children.forEach(child => {
      child.receiveShadow = true
      if (child.name === 'Bench') {
        child.material = this.benchMaterial
      } else {
        child.material = this.material
      }
    })
    this.scene.add(this.model)
  }
}
