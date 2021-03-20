import * as THREE from 'three'
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'
import image1 from "../images/1.jpg";

class GLManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.lookAt = this.scene.position;
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.textures = new THREE.TextureLoader().load(image1, this.updateAspectRatioFactor.bind(this));
        this.factor = new THREE.Vector2(1, 1);

        this.loopRaf = null;

        this.createPlane();
    }
    render = () => {
        this.renderer.render(this.scene, this.camera)
    };
    mount = (el) => {
        el.appendChild(this.renderer.domElement);
    };
    loop = () => {
        this.render();
        this.loopRaf = requestAnimationFrame(this.loop)
    };
    onResize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.updateAspectRatioFactor(this.textures)
    };
    getViewSize() {
        const fovInRadians = (this.camera.fov * Math.PI) / 180;
        return Math.abs(this.camera.position.z * Math.tan(fovInRadians / 2) * 2);
    };
    getPlaneSize() {
        const viewSize = this.getViewSize();
        return {
            width: viewSize * 1.5,
            height: viewSize
        };
    };
    createPlane() {
        const { width, height } = this.getPlaneSize();
        const geometry = new THREE.PlaneBufferGeometry(width, height,60,60);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_texture: { type: 't', value: this.textures},
                u_textureFactor: { type: 'f', value: this.factor},
                u_offset: { type: 'f', value: 8 },
                // Progress of the effect
                u_progress: { type: "f", value: 0 },
                // In which direction is the effect going
                u_direction: { type: "f", value: 1 },
                u_waveIntensity: { type: "f", value: 0 },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            side: THREE.DoubleSide
        });
        this.plane = new THREE.Mesh(geometry, material);
        this.scene.add(this.plane);
    };
    updateAspectRatioFactor(texture) {
        const plane = this.getPlaneSize();
        const windowRatio = window.innerWidth / window.innerHeight;
        const rectRatio = (plane.width / plane.height) * windowRatio;
        const imageRatio = texture.image.width / texture.image.height;

        let factorX = 1;
        let factorY = 1;
        if (rectRatio > imageRatio) {
            factorX = 1;
            factorY = imageRatio / rectRatio;
        } else {
            factorX = rectRatio / imageRatio;
            factorY = 1;
        }
        this.factor = new THREE.Vector2(factorX, factorY);
        this.plane.material.uniforms.u_textureFactor.value = this.factor;
        this.plane.material.uniforms.u_textureFactor.needsUpdate = true;
        this.render();
    };
    updateStickEffect = ({ progress, direction, waveIntensity }) => {
        this.plane.material.uniforms.u_progress.value = progress;
        this.plane.material.uniforms.u_direction.value = direction;
        this.plane.material.uniforms.u_waveIntensity.value = waveIntensity;
        // this.render();
    };
    scheduleLoop() {
        if (this.loopRaf) return;
        this.loop();
    }
    cancelLoop() {
        cancelAnimationFrame(this.loopRaf);
        this.loopRaf = null;
    }
}

export default GLManager