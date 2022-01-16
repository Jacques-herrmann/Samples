import * as THREE from 'three'
import WebGL from '../webgl'
import { EventEmitter2 } from 'eventemitter2'

export default class Cursor extends EventEmitter2 {
  constructor () {
    super()
    this.webgl = new WebGL()
    this.scene = this.webgl.scene

    this.coordinate = new THREE.Vector2(0, 0)
    this.projected = new THREE.Vector2(0, 0)

    this.raycaster = new THREE.Raycaster()
    this.planeProjection = null
    window.addEventListener('mousemove', (ev) => {
      this.update(ev)
    })
    window.addEventListener('click', (ev) => {
      this.onClick(ev)
    })
  }

  generate () {
    this.painting = this.webgl.assetManager.items.painting
    this.planeProjection = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2 * this.painting.ratio),
      new THREE.MeshBasicMaterial({ color: 'rgba(0, 0, 0, 0)' }))
    this.scene.add(this.planeProjection)
  }

  dispose () {
    this.scene.remove(this.planeProjection)
  }

  update (ev) {
    this.coordinate.x = (ev.clientX / this.webgl.canvas.clientWidth) * 2 - 1
    this.coordinate.y = -(ev.clientY / this.webgl.canvas.clientHeight) * 2 + 1

    this.raycaster.setFromCamera(this.coordinate, this.webgl.camera.instance)
    const intersect = this.raycaster.intersectObject(this.planeProjection, false)

    if (intersect.length) {
      this.projected.x = (intersect[0].uv.x - 0.5) * 2
      this.projected.y = (intersect[0].uv.y - 0.5) * 2 * this.painting.ratio

      this.webgl.canvas.classList.add('hide-cursor')
    } else {
      this.projected.x = 0
      this.projected.y = 0
      this.webgl.canvas.classList.remove('hide-cursor')
    }
  }

  onClick (ev) {
    this.coordinate.x = (ev.clientX / this.webgl.canvas.clientWidth) * 2 - 1
    this.coordinate.y = -(ev.clientY / this.webgl.canvas.clientHeight) * 2 + 1

    this.raycaster.setFromCamera(this.coordinate, this.webgl.camera.instance)
    const intersect = this.raycaster.intersectObject(this.planeProjection, false)

    if (!intersect.length) return

    this.emit('click')
  }
}
