const config = {
  debug: true,
  global: {
    renderer: {},
    scene: {
      background: '#18191f'
    },
    camera: {
      position: { x: 0, y: 0, z: 2.5 }
    }
  },
  lights: {},
  objects: {},
  shaders: {
    painting: {
      count: 400000,
      particlesPattern: 1,
      particlesSize: 20,
      randomness: 4,
      loopRadius: 0.1,
      loopScale: 4,
      colorMask: 0,
      progress: 0
    }
  }
}
const options = {
  number: {
    min: -100,
    max: 100,
    step: 0.1
  },
  color: {
    alpha: true,
    view: 'color'
  },
  position: {
    x: { min: -100, max: 100 },
    y: { min: -100, max: 100 },
    z: { min: -100, max: 100 }
  }
}
export {
  config,
  options
}
