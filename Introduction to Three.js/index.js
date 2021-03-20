import * as THREE from 'three/build/three.module.js';

function main() {
    const canvas = document.querySelector("#canvas");
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 40; // Filed of vue in degree
    const aspect = 2;  // Canvas default value
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 120; // Move back the camera

    const scene = new THREE.Scene(); // Scene initialization
    scene.background = new THREE.Color(0xAAAAAA);

    // Adding Light on top left
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const objects = [];
    const spread = 15;

    {
        const width = 8;
        const height = 8;
        const depth = 8;
        addSolidGeometry(-2, -2, new THREE.BoxBufferGeometry(width, height, depth));
    }

    function addObject(x, y, obj) {
        obj.position.x = x * spread;
        obj.position.y = y * spread;

        scene.add(obj);
        objects.push(obj);
    }
    function createMaterial() {
        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
        });

        const hue = Math.random();
        const saturation = 1;
        const luminance = .5;
        material.color.setHSL(hue, saturation, luminance);

        return material;
    }
    function addSolidGeometry(x, y, geometry) {
        const mesh = new THREE.Mesh(geometry, createMaterial());
        addObject(x, y, mesh);
    }

    function render(time) {
        time *= 0.001;  // convertis le temps en secondes

        objects.forEach((obj, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            obj.rotation.x = rot;
            obj.rotation.y = rot;
        });
       if (resizeRendererToDisplaySize(renderer)) {
           const canvas = renderer.domElement;
           camera.aspect = canvas.clientWidth / canvas.clientHeight;
           camera.updateProjectionMatrix();
       }
       renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    requestAnimationFrame(render);
}
main();