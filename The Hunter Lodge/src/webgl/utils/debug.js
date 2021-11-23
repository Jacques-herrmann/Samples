import { Pane } from 'tweakpane'
import { EventEmitter2 } from 'eventemitter2'
import { config, options } from '../config'

export default class Debug extends EventEmitter2 {
  constructor () {
    super()
    this.active = window.location.hash === '#debug'

    if (config.debug || this.active) {
      this.ui = new Pane({
        title: 'Parameters'
      })
      this.tabs = this.ui.addTab({
        pages: [
          { title: 'Basic' },
          { title: 'Advanced' }
        ]
      })
      this.init()
      const panel = document.querySelector('.tp-dfwv')
      panel.style.width = '370px'
    }
  }

  init () {
    this.initRenderer()
    this.initCamera()
    if (config.global.fog) this.initFog()
    if (config.lights) this.initLights()
    if (config.objects) this.initObjects()
  }

  initRenderer () {
    this.tabs.pages.forEach(page => {
      const folder = page.addFolder({
        title: 'Renderer',
        expand: true
      })
      const basicKeys = ['background']
      Object.keys(config.global.renderer).forEach(k => {
        if (page.title === 'Advanced' || basicKeys.includes(k)) {
          folder.addInput(config.global.renderer, k, options[k] || null)
        }
      })
    })
  }

  initCamera () {
    this.tabs.pages.forEach(page => {
      const folder = page.addFolder({
        title: 'Camera',
        expand: true
      })
      const basicKeys = ['position']
      Object.keys(config.global.camera).forEach(k => {
        if (page.title === 'Advanced' || basicKeys.includes(k)) {
          folder.addInput(config.global.camera, k, options[k] || null)
        }
      })
    })
  }

  initFog () {
    this.tabs.pages.forEach(page => {
      const folder = page.addFolder({
        title: 'Fog',
        expand: true
      })
      const basicKeys = ['color']
      Object.keys(config.global.fog).forEach(k => {
        if (page.title === 'Advanced' || basicKeys.includes(k)) {
          folder.addInput(config.global.fog, k, options[k] || null)
        }
      })
    })
  }

  initLights () {
    this.tabs.pages.forEach(page => {
      const folder = page.addFolder({
        title: 'Lights',
        expand: true
      })
      const basicKeys = ['color', 'intensity']
      Object.keys(config.lights).forEach(name => {
        Object.keys(config.lights[name]).forEach(k => {
          if (page.title === 'Advanced' || basicKeys.includes(k)) {
            const option = Object.assign({}, options[k] || {}, {
              label: `${name}-${k}`
            })
            folder.addInput(config.lights[name], k, option)
          }
        })
        folder.addSeparator()
      })
    })
  }

  initObjects () {
    this.tabs.pages.forEach(page => {
      const folder = page.addFolder({
        title: 'Objects',
        expand: true
      })
      const basicKeys = ['color']
      Object.keys(config.objects).forEach(name => {
        Object.keys(config.objects[name]).forEach(k => {
          if (page.title === 'Advanced' || basicKeys.includes(k)) {
            const option = Object.assign({}, options[k] || {}, {
              label: `${name}-${k}`
            })
            folder.addInput(config.objects[name], k, option)
          }
        })
        folder.addSeparator()
      })
    })
  }

  addFolder (tab, name) {
    return this.tabs.pages[tab].addFolder({
      title: name,
      expand: true
    })
  }

  debugLight () {
    console.log('light')
  }

  debugMaterial () {
    console.log('material')
  }

  debugObject () {
    console.log('object')
  }

  onUpdate () {
    this.emit('updateDebug')
  }
}
