import WebGL from '../webgl'
import Environment from './environment'
import Terrain from './terrain'
import Lamp from './lamp'
// import Snow from './snow'

export default class World {
  constructor () {
    this.webgl = new WebGL()
    this.scene = this.webgl.scene
    this.assetManager = this.webgl.assetManager

    // Setup
    this.assetManager.on('ready', () => {
      this.init()
      this.environment = new Environment()
    })
  }

  init () {
    this.terrain = new Terrain()
    this.lamp = new Lamp()
    // this.snow = new Snow()
  }

  update () {
    if (this.lamp) this.lamp.update()
    // if (this.snow) this.snow.update()
  }
}
