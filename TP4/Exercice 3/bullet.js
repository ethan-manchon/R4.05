import * as THREE from 'three';

export default class Projectile extends THREE.Group{
    constructor() {
        super(); 
        this.bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.1), 
            new THREE.MeshBasicMaterial({ color: 0xff0000 }
            ));
            this.bullet.castShadow = true;
            this.add(this.bullet);
            this.visible = false;
        }
    fire() {
        this.bullet.position.copy(figure.position);
        this.bullet.rotation.y = figure.rotation.y;
        this.visible = true;
    }
    update() {
        if (this.visible) {
            this.bullet.position.x += Math.sin(this.bullet.rotation.y);
            this.bullet.position.z += Math.cos(this.bullet.rotation.y);
            if (this.bullet.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 100) {
                this.visible = false;
            }
    }
}
}