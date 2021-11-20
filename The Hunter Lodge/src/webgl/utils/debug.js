import { Pane } from 'tweakpane'
import config from '../config'

export default class Debug {
  constructor () {
    this.active = window.location.hash === '#debug'

    if (config.debug || this.active) {
      this.ui = new Pane({
        title: 'Parameters'
      })
      this.tabs = this.ui.addTab({
        pages: [
          { title: 'Global' },
          { title: 'Advanced' }
        ]
      })
      this.initGlobal()
      this.addObjects()
    }
  }

  addFolder (tab, name) {
    return this.tabs.pages[tab].addFolder({
      title: name,
      expand: true
    })
  }

  addObjects () {
    Object.keys(config.objects).forEach((name) => {
      const objectFolder = this.addFolder(0, name)
      objectFolder.addInput(config.objects[name], 'position')
      objectFolder.addInput(config.objects[name], 'color')
    })
  }

  initGlobal () {
    console.log(this.ui)
    this.ui.addInput(config.global, 'background')

    const cameraFolder = this.addFolder(0, 'Camera')
    cameraFolder.addInput(config.global.camera, 'position')

    const lightFolder = this.addFolder(0, 'Light')
    lightFolder.addInput(config.global.light, 'color')
    lightFolder.addInput(config.global.light, 'intensity')
    lightFolder.addInput(config.global.light, 'position')
  }
}
