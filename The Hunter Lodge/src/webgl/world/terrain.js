import * as THREE from 'three'
import WebGL from '../webgl'
import Debug from '../utils/debug'

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
    this.texture = this.assetManager.items.terrainTexture
    this.texture.flipY = false
    this.texture.encoding = THREE.sRGBEncoding
    this.material = new THREE.MeshBasicMaterial({ map: this.texture })
  }

  setModel () {
    this.model = this.assetManager.items.terrainModel.scene.children.find(child => child.name === 'Terrain')
    // this.model.material = this.material
    this.model.children.forEach(child => {
      child.material = this.material
    })
    this.scene.add(this.model)
  }
}
