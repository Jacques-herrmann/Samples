import WebGL from '../webgl'
// import Environment from './environment'
import Painting from './painting'

export default class World {
  constructor () {
    this.webgl = new WebGL()
    this.scene = this.webgl.scene
    this.assetManager = this.webgl.assetManager

    // Setup
    this.assetManager.on('ready', () => {
      this.init()
      // this.environment = new Environment()
    })
  }

  init () {
    this.painting = new Painting()
  }

  update () {
    if (this.painting) this.painting.update()
  }
}
