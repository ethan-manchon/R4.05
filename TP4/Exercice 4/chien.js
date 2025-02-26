import * as THREE from "three";
import { scene } from "./exo4.js";
import { degreesToRadians, random } from "./utils.js";


// figure
export default class Figure {
  constructor(params) {
    this.params = {
      x: 0,
      y: 0,
      z: 0,
      ry: 0,
      // rx: 0,
      headRotation: 0,
      walkRotation: 0,
      ...params,
    };
    this.group = new THREE.Group();
    scene.add(this.group);

    this.group.position.x = this.params.x;
    this.group.position.y = this.params.y;
    this.group.position.z = this.params.z;
    this.group.rotation.y = this.params.ry;
    // this.group.rotation.x = this.params.rx;
    // Material
    this.headHue = random(0, 360);
    this.bodyHue = random(0, 360);
    this.headLightness = random(40, 65);
    this.headMaterial = new THREE.MeshLambertMaterial({
      color: `hsl(${this.headHue}, 30%, ${this.headLightness}%)`,
    });
    this.bodyMaterial = new THREE.MeshLambertMaterial({
      color: `hsl(${this.bodyHue}, 85%, 50%)`,
    });
    this.legs = [];
  }

  createHead() {
    // Create a new group for the head
    this.head = new THREE.Group();

    // Create the main cube of the head and add to the group
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 1);
    const headMain = new THREE.Mesh(geometry, this.headMaterial);
    this.head.add(headMain);

    // Add the head group to the figure
    this.group.add(this.head);

    // Position the head group
    this.head.position.y = 0.5;
    this.head.position.z = 1;

    // Add the eyes by calling the function we already made
    this.createEyes();
    this.createEars();
    this.createMouth();
  }

  createEyes() {
    const eyes = new THREE.Group();
    const geometry = new THREE.SphereGeometry(0.15, 12, 8);

    // Define the eye material
    const material = new THREE.MeshLambertMaterial({ color: 0x44445c });

    // in createEyes()
    this.head.add(eyes);

    // Move the eyes forwards by half of the head depth - it might be a good idea to create a variable to do this!
    eyes.position.z = 0.5;
    eyes.position.y = 0.3;

    for (let i = 0; i < 2; i++) {
      const eye = new THREE.Mesh(geometry, material);
      const m = i % 2 === 0 ? 1 : -1;
      // Add the eye to the group
      eyes.add(eye);

      // Position the eye
      eye.position.x = 0.36 * m;
    }
  }

  createEars() {
    const ears = new THREE.Group();
    const geometry = new THREE.CylinderGeometry(0.05, 0.1, 1, 4);

    // Define the eye material
    const material = new THREE.MeshLambertMaterial({ color: 0x44445c });

    // in createears()
    this.head.add(ears);

    // Move the ears forwards by half of the head depth - it might be a good idea to create a variable to do this!
    ears.position.z = 0;
    ears.rotateX(degreesToRadians(-33));

    for (let i = 0; i < 2; i++) {
      const ear = new THREE.Mesh(geometry, material);
      const m = i % 2 === 0 ? 1 : -1;
      // Add the ear to the group
      ears.add(ear);

      // Position the ear
      ear.position.x = 0.2 * m;
      ear.position.y = 0.8;
    }
  }

  createMouth() {
    // Create a new group for the mouth 
    this.mouth = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.9, 0.2, 0.2);
    this.head.add(this.mouth);
    this.mouth.position.y = -0.1;

    const lip = new THREE.Mesh(geometry, this.bodyMaterial) 
    this.mouth.add(lip);
    lip.position.y = -0.05;
    lip.position.z = 0.5;
    this.createNose();
    this.createTongue();
  }

  createNose() {
    const geometry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
    const material = new THREE.MeshLambertMaterial({ color: 0x44445c });
    this.nose = new THREE.Mesh(geometry, material);
    this.mouth.add(this.nose);
    this.nose.position.y = 0.1;
    this.nose.position.z = 0.6;
  }

  createTongue() {
    const geometry = new THREE.BoxGeometry(0.2, 0.8, 0.05);
    const material = new THREE.MeshLambertMaterial({ color: 0xff69b4 });
    this.tongue = new THREE.Mesh(geometry, material);
    this.mouth.add(this.tongue);
    this.tongue.position.y = -0.05;
    this.tongue.position.z = 0.5;
    this.tongue.rotateX(degreesToRadians(-45));
  }

  createBody() {
    // Create a new group for the chest
    this.chest = new THREE.Group();

    // Create the main cube of the chest and add to the group
    const geometry = new THREE.BoxGeometry(1, 1, 2);
    const body = new THREE.Mesh(geometry, this.bodyMaterial);
    this.chest.add(body);

    // Add the chest group to the figure
    this.group.add(this.chest);

    // Add the legs by calling the function we already made
    this.createLegs();
    this.createTail();

  }

  createLegs() {
    const legs = new THREE.Group();
    const legGeometry = new THREE.BoxGeometry(0.25, 1.2, 0.25);
    const footGeometry = new THREE.BoxGeometry(0.35, 0.25, 0.35);

    for (let i = 0; i < 4; i++) {
      const legGroup = new THREE.Group();
      const leg = new THREE.Mesh(legGeometry, this.headMaterial);
      const foot = new THREE.Mesh(footGeometry, this.bodyMaterial);
      const m = i % 2 === 0 ? 1 : -1;

      legGroup.add(leg);
      legGroup.add(foot);
      legs.add(legGroup);
      leg.position.y = -0.2;
      foot.position.y = -0.6;
      legGroup.position.x = m * 0.22;
      legGroup.position.z = i < 2 ? 0.6 : -0.6;
      this.legs.push(legGroup);
    }

    this.group.add(legs);
    legs.position.y = -0.75;
    this.chest.add(legs);
    this.createPonpon();
  }

  createTail(){
    const geometry = new THREE.CylinderGeometry(0.05, 0.1, 1, 4);
    const material = new THREE.MeshLambertMaterial({ color: 0x44445c });
    const tail = new THREE.Mesh(geometry, material);
    this.group.add(tail);
    tail.position.y = 0.5;
    tail.position.z = -1;
    tail.rotation.x = degreesToRadians(-33);
    this.chest.add(tail);
  }
  createPonpon() {
    const geometry = new THREE.SphereGeometry(0.15, 12, 8);
    const ponpon = new THREE.Mesh(geometry, this.bodyMaterial);
    this.group.add(ponpon);
    ponpon.position.y = 0.9;
    ponpon.position.z = -1.3;
    this.chest.add(ponpon);
  }

  update() {
    // Walk rotation
    this.group.position.x = this.params.x;
    this.group.position.y = this.params.y;
    this.group.position.z = this.params.z;
    this.group.rotation.y = this.params.ry;
    // this.group.rotation.x = this.params.rx;

    this.legs.forEach((leg, index) => {
      const m = index % 2 === 0 ? 1 : -1;
      leg.rotation.x = Math.sin(this.params.walkRotation) * m * 0.5;
    });
  }

  init() {
    this.createHead();
    this.createBody();
  }

}
