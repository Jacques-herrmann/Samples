import * as THREE from 'three'
import WebGL from '../webgl'
import { config } from '../config'

export default class DemoCube {
  constructor () {
    this.config = config.objects.demoCube

    this.webgl = new WebGL()
    this.scene = this.webgl.scene
    this.resources = this.webgl.resources

    // Setup
    this.setGeometry()
    this.setTextures()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry () {
    this.geometry = new THREE.BoxBufferGeometry()
  }

  setTextures () {
    this.textures = {}
  }

  setMaterial () {
    this.material = new THREE.MeshStandardMaterial({
      color: config.objects.demoCube.color
    })
  }

  setMesh () {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.x = this.config.position.x
    this.mesh.position.y = this.config.position.y
    this.mesh.position.z = this.config.position.z
    this.scene.add(this.mesh)
  }
}
