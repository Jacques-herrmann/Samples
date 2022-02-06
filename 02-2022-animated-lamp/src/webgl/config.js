const config = {
  debug: true,
  global: {
    renderer: {},
    scene: {
      background: '#01020c'
    },
    camera: {
      position: { x: 40, y: 19, z: 30 }
    }
  },
  lights: {
    ambient: {
      color: '#ffffff',
      intensity: 0.4,
      position: { x: 3.5, y: 2, z: -1.25 }
    }
  },
  materials: {
    backdrop: {
      color: '#282538'
    },
    bench: {
      color: '#508691'
    },
    base: {
      color: '#1F6DBC'
    },
    stem: {
      color: '#575757'
    },
    bulb: {
      color: '#FFF479'
    }
  },
  objects: {},
  shaders: {}
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
