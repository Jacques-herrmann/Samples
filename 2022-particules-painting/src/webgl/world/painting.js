import * as THREE from 'three'
import { gsap } from 'gsap'
import WebGL from '../webgl'
import Debug from '../utils/debug'
import Sizes from '../utils/sizes'
import { config } from '../config'

import vertexShader from '../../shaders/vertex.glsl'
import fragmentShader from '../../shaders/fragment.glsl'
import Cursor from '../utils/cursor'

export default class Painting {
  constructor () {
    this.config = config.shaders.painting
    this.webgl = new WebGL()
    this.sizes = new Sizes()
    this.debug = new Debug()
    this.cursor = new Cursor()
    this.scene = this.webgl.scene
    this.painting = this.webgl.assetManager.items.painting

    this.points = null
    this.geometry = null
    this.material = null

    this.debugShader()
    this.generate()
    this.webgl.assetManager.on('image-dropped', () => {
      this.generate()
    })
    this.cursor.on('click', () => {
      this.animate()
    })
  }

  generate () {
    this.painting = this.webgl.assetManager.items.painting
    if (this.points !== null) {
      this.dispose()
      this.cursor.dispose()
    }
    this.cursor.generate()
    this.generateData()
    this.createMaterial()

    this.points = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.points)
  }

  generateData () {
    this.geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.config.count * 3)
    const scales = new Float32Array(this.config.count)

    for (let i = 0; i < this.config.count; i++) {
      const i3 = i * 3

      positions[i3] = (0.5 - Math.random()) * 2
      positions[i3 + 1] = (0.5 - Math.random()) * 2 * this.painting.ratio
      positions[i3 + 2] = (0.5 - Math.random()) * 0.1

      scales[i] = Math.random()
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  }

  createMaterial () {
    this.painting = this.webgl.assetManager.items.painting
    this.particulePattern = this.webgl.assetManager.items[`particles-${this.config.particlesPattern}`]
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uParticlesPattern: { value: this.particulePattern },
        uSize: { value: this.config.particlesSize * this.sizes.pixelRatio },
        uTime: { value: 0 },
        uTexture: { value: this.painting },
        uTextureRatio: { value: this.painting.ratio },
        uCursor: { value: this.cursor.projected },
        uLoopRadius: { value: this.config.loopRadius },
        uLoopScale: { value: this.config.loopScale },
        uColorMask: { value: this.config.colorMask },
        uProgress: { value: this.config.progress }
      }
    })
  }

  debugShader () {
    const folder = this.debug.addFolder(0, 'Painting')
    folder.addInput(this.config, 'count', {
      min: 100,
      max: 1000000,
      step: 100
    })
    folder.addInput(this.config, 'particlesPattern', {
      min: 1,
      max: 13,
      step: 1
    })
    folder.addInput(this.config, 'particlesSize', {
      min: 1,
      max: 50,
      step: 0.01
    })
    folder.addInput(this.config, 'randomness', {
      min: 0,
      max: 20,
      step: 0.001
    })
    folder.addInput(this.config, 'loopRadius', {
      min: 0.001,
      max: 0.5,
      step: 0.001
    })
    folder.addInput(this.config, 'loopScale', {
      min: 0.1,
      max: 20,
      step: 0.01
    })
    folder.addInput(this.config, 'colorMask', {
      min: 0,
      max: 1,
      step: 0.001
    })
    folder.on('change', () => {
      this.generate()
    })
  }

  update () {
    this.material.uniforms.uTime.value = this.webgl.time.elapsed
  }

  animate () {
    console.log('click')
    gsap.to(this.material.uniforms.uProgress, { value: 1, duration: 0.2, ease: 'power3.out' })
    gsap.to(this.material.uniforms.uProgress, { value: 0, duration: 0.2, delay: 0.2, ease: 'power3.in' })
  }

  dispose () {
    this.geometry.dispose()
    this.material.dispose()
    this.scene.remove(this.points)
  }
}
