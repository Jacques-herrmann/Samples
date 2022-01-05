import * as THREE from 'three'
import WebGL from '../webgl'
import Debug from '../utils/debug'
import Sizes from '../utils/sizes'
import { config } from '../config'

import vertexShader from '../../shaders/snow/vertex.glsl'
import fragmentShader from '../../shaders/snow/fragment.glsl'
import { sphericalToCartesian } from '../utils/math'

export default class Snow {
  constructor () {
    this.config = config.shaders.snow
    this.webgl = new WebGL()
    this.sizes = new Sizes()
    this.debug = new Debug()
    this.scene = this.webgl.scene

    this.points = null
    this.geometry = null
    this.material = null

    this.debugShader()
    this.generate()
  }

  generate () {
    if (this.points !== null) {
      this.dispose()
    }
    this.generateData()
    this.createMaterial()

    this.points = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.points)
  }

  generateData () {
    this.geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.config.count * 3)
    const colors = new Float32Array(this.config.count * 3)
    const scales = new Float32Array(this.config.count)
    const fallingRandomness = new Float32Array(this.config.count)

    const particlesColor = new THREE.Color(this.config.color)

    for (let i = 0; i < this.config.count; i++) {
      const i3 = i * 3

      // Position
      const randomAngle = Math.random() * 360
      const randomRadius = Math.random() * this.config.radius
      const height = -2 + Math.random() * this.config.maxHeight
      const sphericalCoordinate = sphericalToCartesian(randomRadius, 0, randomAngle)

      positions[i3] = sphericalCoordinate.x
      positions[i3 + 1] = height
      positions[i3 + 2] = sphericalCoordinate.z

      // Color
      colors[i3] = particlesColor.r
      colors[i3 + 1] = particlesColor.g
      colors[i3 + 2] = particlesColor.b

      scales[i] = Math.random() * 10
      fallingRandomness[i] = Math.random() * 3
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(fallingRandomness, 1))
  }

  createMaterial () {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      // blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: this.config.particlesSize * this.sizes.pixelRatio },
        uMaxHeight: { value: this.config.maxHeight },
        uMinY: { value: this.config.minY },
        uRadius: { value: this.config.radius },
        uFallingSpeed: { value: this.config.fallingSpeed },
        uWindSpeed: { value: this.config.windSpeed }
      }
    })
  }

  debugShader () {
    const folder = this.debug.addFolder(0, 'Snow')
    folder.addInput(this.config, 'count', {
      min: 100,
      max: 1000000,
      step: 100
    })
    folder.addInput(this.config, 'minY', {
      min: -10,
      max: 10,
      step: 1
    })
    folder.addInput(this.config, 'maxHeight', {
      min: 0,
      max: 100,
      step: 0.5
    })
    folder.addInput(this.config, 'particlesSize', {
      min: 1,
      max: 50,
      step: 0.01
    })
    folder.addInput(this.config, 'radius', {
      min: 10,
      max: 60,
      step: 1
    })
    folder.addInput(this.config, 'fallingSpeed', {
      min: 0,
      max: 10,
      step: 0.01
    })
    folder.addInput(this.config, 'windSpeed', {
      min: 0,
      max: 6,
      step: 0.001
    })
    folder.addInput(this.config, 'color')
    folder.on('change', () => {
      this.generate()
    })
  }

  update () {
    this.material.uniforms.uTime.value = this.webgl.time.elapsed
  }

  dispose () {
    this.geometry.dispose()
    this.material.dispose()
    this.scene.remove(this.points)
  }
}
