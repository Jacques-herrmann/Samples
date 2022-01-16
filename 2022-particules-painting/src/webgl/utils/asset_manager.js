import { EventEmitter2 } from 'eventemitter2'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import WebGL from '../webgl'
import * as THREE from 'three'

export default class AssetManager extends EventEmitter2 {
  constructor (sources) {
    super()

    this.sources = sources
    this.webgl = new WebGL()
    this.dropArea = this.webgl.canvas

    // Setup
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
    this.initDropHandler()
  }

  setLoaders () {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
    this.loaders.textureLoader = new THREE.TextureLoader()
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
  }

  startLoading () {
    // Load each source
    for (const source of this.sources) {
      if (source.type === 'gltfModel') {
        this.loaders.gltfLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file)
          }
        )
      } else if (source.type === 'texture') {
        this.loaders.textureLoader.load(
          source.path,
          (file) => {
            file.ratio = file.image.height / file.image.width
            this.sourceLoaded(source, file)
          }
        )
      } else if (source.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file)
          }
        )
      }
    }
  }

  sourceLoaded (source, file) {
    this.items[source.name] = file

    this.loaded++

    if (this.loaded === this.toLoad) {
      this.emit('ready')
    }
  }

  initDropHandler () {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
      this.dropArea.addEventListener(ev, this.preventDefaults, false)
    })

    this.dropArea.addEventListener('drop', (ev) => {
      this.handleDrop(ev)
    }, false)
  }

  handleDrop (ev) {
    const dataTransfer = ev.dataTransfer
    const file = dataTransfer.files[0]
    const t = file.type.split('/').pop().toLowerCase()
    if (!['jpeg', 'jpg', 'png', 'bmp', 'gif'].includes(t)) {
      alert('Please select a valid image file')
      return false
    }
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const src = fileReader.result
      this.items.painting.dispose()
      this.loaders.textureLoader.load(src, (texture) => {
        texture.ratio = texture.image.height / texture.image.width
        this.items.painting = texture
        this.emit('image-dropped')
      })
    }
    fileReader.readAsDataURL(file)
  }

  preventDefaults (ev) {
    ev.preventDefault()
    ev.stopPropagation()
  }
}
