import * as THREE from "three"
import { colors } from "./constants";

class Pilot {
    constructor() {
        this.mesh = new THREE.Object3D();
        this.mesh.name = "pilot";

        this.angleHairs = 0;
        this.createBody();
        this.createHairs();
        this.createGlasses();
        this.createEars();
    }
    createBody() {
        const bodyGeo = new THREE.BoxGeometry(15, 15, 15);
        const bodyMat = new THREE.MeshPhongMaterial({ color: colors.brown, shading: THREE.FlatShading });
        let body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(2, -12, 0);
        this.mesh.add(body);

        // Face of the pilot
        const faceGeom = new THREE.BoxGeometry(10,10,10);
        const faceMat = new THREE.MeshLambertMaterial({ color: colors.pink });
        const face = new THREE.Mesh(faceGeom, faceMat);
        this.mesh.add(face);
    }
    createHairs() {
        // Hair element
        const hairGeom = new THREE.BoxGeometry(4,4,4);
        const hairMat = new THREE.MeshLambertMaterial({ color: colors.brown });
        const hair = new THREE.Mesh(hairGeom, hairMat);
        hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));
        let hairs = new THREE.Object3D();

        // Top
        this.hairsTop = new THREE.Object3D();
        for (let i=0; i<12; i++){
            const h = hair.clone();
            const col = i % 3;
            const row = Math.floor(i / 3);
            const startPosZ = - 4;
            const startPosX = - 4;
            h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
            this.hairsTop.add(h);
        }
	    hairs.add(this.hairsTop);

        // Side
        const hairSideGeo = new THREE.BoxGeometry(12, 4, 2);
        hairSideGeo.applyMatrix(new THREE.Matrix4().makeTranslation(-6, 0, 0));
        const hairSideR = new THREE.Mesh(hairSideGeo, hairMat);
        const hairSideL = hairSideR.clone();
        hairSideR.position.set(8, -2, 6);
        hairSideL.position.set(8, -2, -6);
        hairs.add(hairSideR);
        hairs.add(hairSideL);

        // Back
        const hairBackGeo = new THREE.BoxGeometry(2, 8, 10);
        const hairBack = new THREE.Mesh(hairBackGeo, hairMat);
        hairBack.position.set(-1, -4, 0);
        hairs.add(hairBack);
        hairs.position.set(-5, 5, 0);

        this.mesh.add(hairs);
    }
    createGlasses() {
        const glassGeo = new THREE.BoxGeometry(5, 5, 5);
        const glassMat = new THREE.MeshLambertMaterial({ color: colors.brown });
        const glassR = new THREE.Mesh(glassGeo, glassMat);
        glassR.position.set(6, 0, 3);
        let glassL = glassR.clone();
        glassL.position.z = - glassR.position.z;

        const glassAGeo = new THREE.BoxGeometry(11, 1, 11);
        const glassA = new THREE.Mesh(glassAGeo, glassMat);
        this.mesh.add(glassR);
        this.mesh.add(glassL);
        this.mesh.add(glassA);
    }
    createEars() {
        const earGeo = new THREE.BoxGeometry(2, 3, 2);
        const earMat = new THREE.MeshLambertMaterial({ color: colors.pink });
        const earL = new THREE.Mesh(earGeo, earMat);
        earL.position.set(0, 0, -6);
        const earR = earL.clone();
        earR.position.set(0, 0, 6);
        this.mesh.add(earL);
        this.mesh.add(earR);
    }
    moveHairs() {
        const hairs = this.hairsTop.children;
        for (let i=0; i<hairs.length; i++){
            let h = hairs[i];
            h.scale.y = .75 + Math.cos(this.angleHairs + i / 3) * .25;
        }
        this.angleHairs += 0.16;
    }
}
export default Pilot;