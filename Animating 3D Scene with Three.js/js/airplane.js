import * as THREE from "three/build/three.module"
import { colors } from "./constants";
import Pilot from "./pilot";

class AirPlane {
    constructor() {
        this.mesh = new THREE.Object3D();
        this.pilot = new Pilot();

        this.createCabin();
        this.createEngine();
        this.createTail();
        this.createWings();
        this.createPropeller();
        this.pilot.mesh.position.set(-10, 27, 0);
        this.mesh.add(this.pilot.mesh);
    }
    createCabin() {
        let geoCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
        const matCockpit = new THREE.MeshPhongMaterial({ color: colors.red, shading: THREE.FlatShading });
        geoCockpit.attributes.position.array[13] -= 10;
        geoCockpit.attributes.position.array[14] += 20;
        geoCockpit.attributes.position.array[25] -= 10;
        geoCockpit.attributes.position.array[26] += 20;
        geoCockpit.attributes.position.array[64] -= 10;
        geoCockpit.attributes.position.array[65] += 20;

        geoCockpit.attributes.position.array[16] -= 10;
        geoCockpit.attributes.position.array[17] -= 20;
        geoCockpit.attributes.position.array[31] -= 10;
        geoCockpit.attributes.position.array[32] -= 20;
        geoCockpit.attributes.position.array[49] -= 10;
        geoCockpit.attributes.position.array[50] -= 20;

        geoCockpit.attributes.position.array[19] += 30;
        geoCockpit.attributes.position.array[20] += 20;
        geoCockpit.attributes.position.array[43] += 30;
        geoCockpit.attributes.position.array[44] += 20;
        geoCockpit.attributes.position.array[70] += 30;
        geoCockpit.attributes.position.array[71] += 20;

        geoCockpit.attributes.position.array[22] += 30;
        geoCockpit.attributes.position.array[23] -= 20;
        geoCockpit.attributes.position.array[37] += 30;
        geoCockpit.attributes.position.array[38] -= 20;
        geoCockpit.attributes.position.array[55] += 30;
        geoCockpit.attributes.position.array[56] -= 20;

        let cockpit = new THREE.Mesh(geoCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.mesh.add(cockpit);
    }
    createEngine() {
        let geoEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
        const matEngine = new THREE.MeshPhongMaterial({ color: colors.white, shading: THREE.FlatShading });
        let engine = new THREE.Mesh(geoEngine, matEngine);
        engine.position.x = 40;
        engine.castShadow = true;
        engine.receiveShadow = true;
        this.mesh.add(engine);
    }
    createTail() {
        let geoTail = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
        const matTail = new THREE.MeshPhongMaterial({ color: colors.red, shading: THREE.FlatShading });
        let tail = new THREE.Mesh(geoTail, matTail);
        tail.position.set(-35, 25, 0);
        tail.castShadow = true;
        tail.receiveShadow = true;
        this.mesh.add(tail);
    }
    createWings() {
        let geoWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
        const matWing = new THREE.MeshPhongMaterial({ color: colors.red, shading: THREE.FlatShading });
        let wing = new THREE.Mesh(geoWing, matWing);
        wing.castShadow = true;
        wing.receiveShadow = true;
        this.mesh.add(wing);
    }
    createPropeller() {
        let geoPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
        const matPropeller = new THREE.MeshPhongMaterial({ color: colors.brown, shading: THREE.FlatShading });
        this.propeller = new THREE.Mesh(geoPropeller, matPropeller);
        this.propeller.castShadow = true;
        this.propeller.receiveShadow = true;

        // Blades
        const geoBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
        const matBlade = new THREE.MeshPhongMaterial({ color: colors.brownDark, shading: THREE.FlatShading });
        let blade = new THREE.Mesh(geoBlade, matBlade);
        blade.position.set(8, 0, 0);
        blade.castShadow = true;
        blade.receiveShadow = true;
        this.propeller.add(blade);
        this.propeller.position.set(50, 0, 0);

        this.mesh.add(this.propeller);
    }

}
export default AirPlane;