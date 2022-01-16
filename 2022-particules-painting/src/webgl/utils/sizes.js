import { EventEmitter2 } from 'eventemitter2'

export default class Sizes extends EventEmitter2 {
  constructor () {
    super()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)

    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)

      this.emit('resize')
    })
  }
}
