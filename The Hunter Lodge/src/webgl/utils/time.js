import { EventEmitter2 } from 'eventemitter2'

export default class Time extends EventEmitter2 {
  constructor () {
    super()

    // Setup
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick () {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    this.emit('tick')

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
