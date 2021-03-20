import * as THREE from "three"
import { colors } from "./constants";
 import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

class Sea {
    constructor() {
        this.geo = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
        this.geo.applyMatrix4(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
        BufferGeometryUtils.mergeVertices(this.geo);

        const l = this.geo.attributes.position.array.length;
        this.waves = [];

        for(let i=0; i<l; i+=3) {
            const v = {
                x: this.geo.attributes.position.array[i],
                y: this.geo.attributes.position.array[i + 1],
                z: this.geo.attributes.position.array[i + 2],
            };

            this.waves.push({
                x: v.x,
                y: v.y,
                z: v.z,
                ang: Math.random() * Math.PI * 2,
                amp: 5 + Math.random() * 15,
                speed: 0.016 + Math.random() * 0.032
            });
        }

        this.mat = new THREE.MeshPhongMaterial({
            color: colors.blue,
            transparent: true,
            opacity: 0.6,
            shading: THREE.FlatShading
        });
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        this.mesh.receiveShadow = true;
    }
    moveWaves = () => {
        const vertices = this.geo.attributes.position.array;
        const l = vertices.length;

        for (let i=0; i<l; i+=3) {
            const vprops = this.waves[i / 3];

            this.geo.attributes.position.array[i] = vprops.x + Math.cos(vprops.ang) * vprops.amp;
            this.geo.attributes.position.array[i + 1] = vprops.y + Math.sin(vprops.ang) * vprops.amp;

            vprops.ang -= vprops.speed;
        }
        this.mesh.geometry.verticesNeedUpdate = true;
    }
}
export default Sea;