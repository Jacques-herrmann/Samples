import * as THREE from "three"
import { colors } from "./constants";

class Cloud {
    constructor() {
        this.mesh = new THREE.Mesh();

        this.geo = new THREE.BoxGeometry(20, 20, 20);
        this.mat = new THREE.MeshPhongMaterial({ color: colors.white });

        const nBlocs = 3 + Math.floor(Math.random() * 3);
        for (let i=0; i<nBlocs; i++) {
            let m = new THREE.Mesh(this.geo, this.mat);

            m.position.x = i * 15;
            m.position.y = Math.random() * 10;
            m.position.z = Math.random() * 10;
            m.rotation.y = Math.random() * Math.PI * 2;
            m.rotation.z = Math.random() * Math.PI * 2;

            const s = 0.1 + Math.random() * 0.9;
            m.scale.set(s, s, s);
            m.castShadow = true;
            m.receiveShadow = true;

            this.mesh.add(m);
        }
    }
}
export default Cloud;