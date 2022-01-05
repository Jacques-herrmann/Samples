import WebGL from '../webgl'
import Environment from './environment'
import Terrain from './terrain'
import Lodge from './lodge'
import Snow from './snow'

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
    this.lodge = new Lodge()
    this.snow = new Snow()
  }

  update () {
    if (this.snow) this.snow.update()
  }
}
