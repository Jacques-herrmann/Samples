const config = {
  debug: true,
  global: {
    renderer: {},
    scene: {
      background: '#01020c'
    },
    camera: {
      position: { x: -20, y: 14, z: 70 }
    }
  },
  lights: {
    ambient: {
      color: '#ffffff',
      intensity: 4,
      position: { x: 3.5, y: 2, z: -1.25 }
    }
  },
  objects: {
    demoCube: {
      position: { x: 0, y: 0, z: 0 },
      color: '#27AE60'
    }
  },
  shaders: {
    snow: {
      count: 80000,
      size: 0.005,
      maxHeight: 25,
      radius: 43,
      minY: -2,
      fallingSpeed: 1,
      windSpeed: 1,
      randomness: 0.5,
      particlesSize: 11,
      color: '#9fa1c6'
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
