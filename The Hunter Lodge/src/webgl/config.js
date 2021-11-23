const config = {
  debug: true,
  global: {
    renderer: {
      background: '#211d20'
    },
    fog: {
      color: '#211d20',
      density: 0.5
    },
    camera: {
      position: { x: 6, y: 4, z: 8 },
      controls: true
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
    x: { min: -10, max: 10 },
    y: { min: -10, max: 10 },
    z: { min: -10, max: 10 }
  }
}
export {
  config,
  options
}
