import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import * as dat from 'dat.gui'
import { Material, ShaderMaterial } from 'three'

/**
 * Post-processing
 * 
 * Post-pocessing is about adding effects on the final image and we usually use it for filmmaking, 
 * but we can do it in WebGL too. It can be subtle to improve the image slightly or to create huge effects.
 * - Depth of field
 * - Bloom
 * - God ray
 * - Motion blur
 * - Glitch effect
 * - Outlines
 * - Color variantions
 * - Antialiasing
 * - Reflexion and refraction
 * - and more...
 * 
 * Instead of rendering in the canvas, we do it in a render target (or "buffer"). In a simpler way, 
 * we render in a texture instead of the canvas on the screen.
 * 
 * We use that texture on a plane facing the camera and covering the whole view. We use special
 * fragment shader that will apply the post-processing effect on the texture. In Three.JS thos
 * "effects" are called "passes".
 * 
 * - PingPong Buffering
 * We can have multiple passes on our post-process, but we cannot read a texture while writing on it.
 * This is why we are going to need two render targets and write on one while reading the other and 
 * then invert them. We write the last one on the canvas.
 * 
 * Fortunately, we don't have to do it on our own. We are going to use the EffectComposer class
 * At the first pass, we usually start from a render of the scene using RenderPass
 * 
 * 
 * Some passes need extra work like the RGBShift pass. The RGBShift is available as a shader. We need
 * to use it with a ShaderPass
 * 
 * 
 * 
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    /**
     * Resizing
     * 
     * The resizing isn't handle properly. We need to call the setSize function on effectComposer when resizing 
     * the windows.
     * 
     */
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Post-processing
 */

/**
 * Fixing antialiasing
 * 
 * The antialias isn't working too. Here we have multiple solution :
 *      - Use a particular type of render target that handle antialias, but won't work on all modern browsers
 *      - Use a pass to do the antialias -> less performant
 *      - A combination of the two previous options where we test if the browser supports this unique type of 
 *        render, and if not, we use an antialias pass.
 * 
 * There are multiple pass to do so:
 *      - FXAA: Performant, but the result is just ok and can be blurry
 *      - SMAA: Usually better than FXaa but less performant - not to be confused wih MSAA
 *      - SSAA: Best quality but worst performance
 *      - TAA: Performant but limited result
 *      - And others
 * 
 * Usually :
 * If the pixel ratio is above 1, we use the WebGLRenderTarget and no antialias pass
 * If the pixel ratio is 1 and the browser supports WebGL 2, we use a WebGLMultisampleRenderTarget
 * If the pixel ratio is 1 and the browser doesn't supports WebGL 2, we use a WebGLRenderTarget and enable SMAAPass
 * 
 */

 let RenderTargetClass = null

 if(renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2){
    RenderTargetClass = THREE.WebGLMultisampleRenderTarget
    console.log('Using WebGLMultisampleRenderTarget')
 }
 else{
    RenderTargetClass = THREE.WebGLRenderTarget
    console.log('Using WebGLRenderTarget')
 }

const renderTarget = new RenderTargetClass(800, 600, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    encoding: THREE.sRGBEncoding,
})


/**
 * Since we are using EffectComposer, the colors are darker.
 * The renderer.outputEncoding = THREE.sRGBEncoding doesn't work anymore because the render targets of 
 * EffectComposer is not set right. Fortunately, we can provide our own render target.
 */
const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

const glitchPass = new GlitchPass()
// glitchPass.goWild = true
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)

const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6
unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)

gui.add(unrealBloomPass, 'enabled')
gui.add(unrealBloomPass, 'strength', 0, 2, 0.001)
gui.add(unrealBloomPass, 'radius', 0, 2, 0.001)
gui.add(unrealBloomPass, 'threshold', 0, 1, 0.001)

/**
 * Create your own pass
 */
 const displacementShader = {
    uniforms: {
        tDiffuse: { value: null }, // Used by EffectComposer to give us the texture from the precedent pass
        // uTime: { value: null },
        uNormalMap: { value: null },
    },
    vertexShader: `
        varying vec2 vUv;

        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;
        uniform float uTime;

        varying vec2 vUv;

        void main() {
            // vec2 newUv = vec2(
            //     vUv.x,
            //     vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
            // );

            vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
            vec2 newUv = vUv + normalColor.xy * 0.1;
            vec4 color = texture2D(tDiffuse, newUv);

            vec3 lightDirection = normalize(vec3(- 1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
            color.rgb += lightness * 2.0;

            gl_FragColor = color;
        }
    `
}
const displacementPass = new ShaderPass(displacementShader)
// displacementPass.material.uniforms.uTime.value = 0
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load('/textures/interfaceNormalMap.png')
effectComposer.addPass(displacementPass)

const tintShader = {
    uniforms: {
        tDiffuse: { value: null }, // Used by EffectComposer to give us the texture from the precedent pass
        uTint: { value: null },
    },
    vertexShader: `
        varying vec2 vUv;

        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;

        varying vec2 vUv;

        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            color.rgb += uTint;

            gl_FragColor = color;
        }
    `
}
const tintPass = new ShaderPass(tintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3()
effectComposer.addPass(tintPass)
gui.add(tintPass.material.uniforms.uTint.value, 'x', -1, 1, 0.001).name("red")
gui.add(tintPass.material.uniforms.uTint.value, 'y', -1, 1, 0.001).name("green")
gui.add(tintPass.material.uniforms.uTint.value, 'z', -1, 1, 0.001).name("blue")





if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)

    console.log('Using SMAA')
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update passes
    // displacementPass.material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()