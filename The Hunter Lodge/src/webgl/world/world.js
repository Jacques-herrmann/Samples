import WebGL from '../webgl'
import Environment from './environment'
import DemoCube from './demoCube'

export default class World {
  constructor () {
    this.webgl = new WebGL()
    this.scene = this.webgl.scene
    this.resources = this.webgl.resources

    // Setup
    this.resources.on('ready', () => {
    })
    this.setDemoCube()
    this.environment = new Environment()
  }

  setDemoCube () {
    this.demoCube = new DemoCube()
  }

  update () {
  }
}
