const debugObject = {
  debug: true,
  global: {
    background: '#211d20',
    renderer: {},
    camera: {
      position: { x: 6, y: 4, z: 8 },
      controls: true
    },
    light: {
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
export default debugObject
