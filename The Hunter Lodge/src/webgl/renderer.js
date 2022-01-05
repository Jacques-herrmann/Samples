import * as THREE from 'three'
import WebGL from './webgl'
import Debug from './utils/debug'
import { config } from './config'

export default class Renderer {
  constructor () {
    this.config = config.global.renderer
    console.log(config)

    this.webgl = new WebGL()
    this.debug = new Debug()
    this.sizes = this.webgl.sizes
    this.scene = this.webgl.scene
    this.canvas = this.webgl.canvas
    this.camera = this.webgl.camera

    this.setInstance()
    if (this.debug.active) this.setDebug()
  }

  setInstance () {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    this.instance.setClearColor(config.global.background)
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  resize () {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  update () {
    this.instance.render(this.scene, this.camera.instance)
  }

  setDebug () {
    this.debug.debugRenderer(this)
    console.log('debug')
  }
}
