import * as THREE from 'three'
import { Pane } from 'tweakpane'
import { EventEmitter2 } from 'eventemitter2'
import { config, options } from '../config'
import WebGL from '../webgl'

let instance = null

export default class Debug extends EventEmitter2 {
  constructor () {
    super()
    // Singleton
    if (instance) return instance
    instance = this

    this.active = config.debug || window.location.hash === '#debug'
    this.folders = {}

    if (this.active) {
      // Attach Webgl to the window for console inspection
      window.webgl = new WebGL()

      this.ui = new Pane({ title: 'Parameters' })
      this.tabs = this.ui.addTab({
        pages: [
          { title: 'Basic' }
        ]
      })
      this.init()

      // Add CSS to debug UI
      const panel = document.querySelector('.tp-dfwv')
      panel.style.width = '370px'
    }
  }

  init () {
    if (config.lights) this.initFolders('Lights')
    if (config.objects) this.initFolders('Objects')
  }

  debugRenderer (renderer) {
    console.log(renderer)
    this.tabs.pages.forEach(page => {
      const folder = page.addFolder({ title: 'Renderer', expand: true })

      const basicKeys = []
      Object.keys(config.global.renderer).forEach(k => {
        if (page.title === 'Advanced' || basicKeys.includes(k)) {
          folder.addInput(renderer, k, options[k] || null)
        }
      })
    })
  }

  debugScene (scene) {
    console.log(scene)
    this.tabs.pages.forEach(page => {
      const folder = page.addFolder({ title: 'Scene', expand: true })
      const configKeys = Object.keys(config.global.scene)

      if (configKeys.includes('background')) {
        folder.addInput(config.global.scene, 'background').on('change', () => {
          scene.background = new THREE.Color(config.global.scene.background)
        })
        configKeys.splice(configKeys.indexOf('background'), 1)
      }

      if (configKeys.includes('fog')) {
        folder.addInput(config.global.scene.fog, 'color', { label: 'fogColor' }).on('change', () => {
          scene.fog = new THREE.Fog(config.global.scene.fog.color, config.global.scene.fog.color)
        })
        folder.addInput(config.global.scene.fog, 'density', { label: 'fogDensity' }).on('change', () => {
          scene.fog = new THREE.Fog(config.global.scene.fog.color, config.global.scene.fog.color)
        })
        configKeys.splice(configKeys.indexOf('fog'), 1)
      }

      configKeys.forEach(k => {
        if (page.title === 'Advanced') {
          folder.addInput(scene, k, options[k] || null)
        }
      })
    })
  }

  debugCamera (camera) {
    console.log(camera)
    this.tabs.pages.forEach(page => {
      const folder = page.addFolder({ title: 'Camera', expand: true })
      const basicKeys = ['position']
      Object.keys(config.global.camera).forEach(k => {
        if (page.title === 'Advanced' || basicKeys.includes(k)) {
          folder.addInput(camera, k, options[k] || null)
        }
      })
      folder.addSeparator()
    })
  }

  initFolders (name) {
    const folders = []
    this.tabs.pages.forEach(page => {
      folders.push(page.addFolder({ title: name, expand: true }))
    })
    this.folders[name.toLowerCase()] = folders
  }

  addFolder (tab, name) {
    return this.tabs.pages[tab].addFolder({
      title: name,
      expand: true
    })
  }

  debugLight (light, name) {
    console.log(light)
    this.folders.lights.forEach((folder, f) => {
      const basicKeys = ['position']
      Object.keys(config.lights[name]).forEach(k => {
        if (f === 1 || basicKeys.includes(k)) {
          const option = Object.assign({}, options[k] || {}, {
            label: `${name}-${k}`
          })
          folder.addInput(light, k, option)
        }
      })
      folder.addSeparator()
    })
  }

  debugObject (object, name) {
    console.log(object)
    this.folders.objects.forEach((folder, f) => {
      const configKeys = Object.keys(config.objects[name])
      if (configKeys.includes('color')) {
        folder.addInput(config.objects[name], 'color').on('change', () => {
          object.material.color.set(config.objects[name].color)
        })
        configKeys.splice(configKeys.indexOf('color'), 1)
      }
      const basicKeys = ['position']
      configKeys.forEach(k => {
        if (f === 1 || basicKeys.includes(k)) {
          const option = Object.assign({}, options[k] || {}, {
            label: `${name}-${k}`
          })
          folder.addInput(object, k, option)
        }
      })
      folder.addSeparator()
    })
  }

  debugMaterial (folder, obj, parameter) {
    console.log('material')
  }
}
