import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import WebGL from '../webgl'
import Debug from '../utils/debug'
import { config } from '../config'

export default class Lamp {
  constructor () {
    this.webgl = new WebGL()
    this.debug = new Debug()
    this.scene = this.webgl.scene
    this.assetManager = this.webgl.assetManager

    // Setup
    this.setMaterial()
    this.init()
    this.setAnimation()
  }

  setMaterial () {
    this.baseMaterial = new THREE.MeshStandardMaterial({ color: config.materials.base.color })
    this.stemMaterial = new THREE.MeshStandardMaterial({ color: config.materials.stem.color })
    this.bulbMaterial = new THREE.MeshStandardMaterial({ color: config.materials.bulb.color })
  }

  init () {
    this.model = this.assetManager.items.lampModel.scene
    this.animationClip = this.assetManager.items.lampModel.animations[0]
    const lampGeometry = this.model.children.find(child => child.name === 'Lamp')
    lampGeometry.children[0].material = this.baseMaterial
    lampGeometry.children[1].material = this.stemMaterial
    lampGeometry.children.forEach((child, c) => {
      if (c !== 2) {
        child.receiveShadow = true
        child.castShadow = true
      }
    })
    this.bulb = lampGeometry.children[2]
    this.createBulb()
    this.scene.add(this.model)
  }

  createBulb () {
    this.bulbLight = new THREE.SpotLight(config.materials.bulb.color, 6, 20, Math.PI / 3.34)
    this.bulbLight.castShadow = true
    this.buldLightHelper = new SpotLightHelper(this.bulbLight)
    this.toFollow = this.bulb.skeleton.bones.find(child => child.name === 'Lamp_Shade')
    this.lightTarget = new THREE.Object3D()
    this.bulbLight.target = this.lightTarget
    this.updateLightTarget()

    console.log(this.toFollow)
    this.scene.add(this.bulbLight)
    this.scene.add(this.buldLightHelper)
    this.scene.add(this.bulbLight.target)
  }

  updateLightTarget () {
    const boneTarget = this.bulb.skeleton.bones.find(child => child.name === 'Look')
    this.lightTarget.position.setFromMatrixPosition(boneTarget.matrixWorld)
    this.lightTarget.updateMatrixWorld()
    // console.log(this.lightTarget.position)
    this.buldLightHelper.update()
  }

  setAnimation () {
    this.animation = {}
    this.animation.mixer = new THREE.AnimationMixer(this.model)

    this.animation.actions = {}

    this.animation.actions.jump = this.animation.mixer.clipAction(this.animationClip)
    this.animation.actions.jump.loop = THREE.LoopOnce

    this.animation.play = () => {
      this.animation.actions.jump.reset()
      this.animation.actions.jump.play()
      // console.log('played')
    }

    // Debug
    if (this.debug.active) {
      this.debug.tabs.pages[0].addButton({
        title: 'Play'
      }).on('click', () => {
        this.animation.play()
      })
    }
  }

  update () {
    this.animation.mixer.update(this.webgl.time.delta * 0.001)
    // console.log(this.bulb.skeleton.bones[5].position)

    this.bulbLight.position.setFromMatrixPosition(this.toFollow.matrixWorld)
    this.lightTarget.updateMatrixWorld()
    this.updateLightTarget()
  }
}
