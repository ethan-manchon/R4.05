import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";
import Bullet from "./bullet.js";

const container = document.getElementById("container");
const stats = new Stats();
container.appendChild(stats.dom);

// Scene graph
 export const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
  .setPath("assets/")
  .load([
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg",
  ]);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1.0);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);
light.position.set(50, 50, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true; // Active les ombres portées
scene.add(light);
scene.add(new THREE.DirectionalLightHelper(light));

light.shadow.mapSize.width = 512; // Largeur de la shadow map
light.shadow.mapSize.height = 512; // Hauteur de la shadow map
light.shadow.camera.near = 0.5; // Distance minimale de la shadow camera
light.shadow.camera.far = 500; // Distance maximale de la shadow camera
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;

// ground
const ground = new THREE.PlaneGeometry(35, 35, 35, 35);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xccffcc,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(ground, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true; // Active la réception des ombres
scene.add(groundMesh);

// geometry
const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const geometry = new THREE.SphereGeometry(1, 32, 16);

// convert degrees to radians
const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const random = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min;

  if (float) {
    return val;
  }

  return Math.floor(val);
};

// figure
class Figure {
  constructor(params) {
    this.params = {
      x: 0,
      y: 0,
      z: 0,
      ry: 0,
      armRotation: 0,
      headRotation: 0,
      leftEyeScale: 0,
      walkRotation: 0,
      ...params,
    };
    this.group = new THREE.Group();
    scene.add(this.group);

    this.group.position.x = this.params.x;
    this.group.position.y = this.params.y;
    this.group.position.z = this.params.z;
    this.group.rotation.y = this.params.ry;
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
    this.arms = [];
    this.legs = [];
  }
  createHead() {
    // Create a new group for the head
    this.head = new THREE.Group();

    // Create the main cube of the head and add to the group
    const geometry = new THREE.SphereGeometry(0.8, 16, 16);
    const headMain = new THREE.Mesh(geometry, this.headMaterial);
    this.head.add(headMain);

    // Add the head group to the figure
    this.group.add(this.head);

    // Position the head group
    this.head.position.y = 1.65;

    // Add the eyes by calling the function we already made
    this.createEyes();
  }
  createAntennas() {
    const height = 0.7;
    const geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);

    for (let i = 0; i < 2; i++) {
      const antennaGroup = new THREE.Group();
      const antenna = new THREE.Mesh(geometry, this.headMaterial);

      const m = i % 2 === 0 ? 1 : -1;

      antennaGroup.add(antenna);
      this.group.add(antennaGroup);

      // Translate the antenna (not the group) downwards by half the height
      antenna.position.y = height * -0.5;

      antennaGroup.position.x = m * 0.6;
      antennaGroup.position.y = 2;
      antennaGroup.rotation.z = degreesToRadians(145 * m);
    }
  }

  createEyes() {
    const eyes = new THREE.Group();
    const geometry = new THREE.SphereGeometry(0.15, 12, 8);

    // Define the eye material
    const material = new THREE.MeshLambertMaterial({ color: 0x44445c });

    // in createEyes()
    this.head.add(eyes);

    // Move the eyes forwards by half of the head depth - it might be a good idea to create a variable to do this!
    eyes.position.z = 0.7;

    for (let i = 0; i < 2; i++) {
      const eye = new THREE.Mesh(geometry, material);
      const m = i % 2 === 0 ? 1 : -1;
      // Add the eye to the group
      eyes.add(eye);

      // Position the eye
      eye.position.x = 0.36 * m;
    }
  }
  createBody() {
    // Create a new group for the chest
    this.chest = new THREE.Group();

    // Create the main cube of the chest and add to the group
    const geometry = new THREE.BoxGeometry(1, 1.5, 1);
    const body = new THREE.Mesh(geometry, this.bodyMaterial);
    this.chest.add(body);

    // Add the chest group to the figure
    this.group.add(this.chest);

    // Add the legs by calling the function we already made
    this.createLegs();
  }
  createArms() {
    // Set the variable
    const height = 1;
    const geometry = new THREE.CylinderGeometry(0.3, 0.1, height, 8);

    for (let i = 0; i < 2; i++) {
      const armGroup = new THREE.Group();
      const arm = new THREE.Mesh(geometry, this.headMaterial);

      const m = i % 2 === 0 ? 1 : -1;

      armGroup.add(arm);
      this.group.add(armGroup);

      // Translate the arm (not the group) downwards by half the height
      arm.position.y = height * -0.5;

      armGroup.position.x = m * 0.8;
      armGroup.position.y = 0.6;
      armGroup.rotation.z = degreesToRadians(90 * m);
      this.arms.push(armGroup);
    }
  }
  createLegs() {
    const legs = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25);

    for (let i = 0; i < 2; i++) {
      const legGroup = new THREE.Group();
      const leg = new THREE.Mesh(geometry, this.headMaterial);
      const m = i % 2 === 0 ? 1 : -1;

      legGroup.add(leg);
      legs.add(legGroup);
      leg.position.y = -0.2;
      legGroup.position.x = m * 0.22;
      this.legs.push(legGroup);
    }

    this.group.add(legs);
    legs.position.y = -1.15;

    this.chest.add(legs);
  }

  update() {
    this.group.rotation.y = this.params.ry;
    this.group.position.y = this.params.y;
    this.group.position.x = this.params.x;
    this.group.position.z = this.params.z;

    // Move the arms
    this.arms.forEach((arm, index) => {
      const m = index % 2 === 0 ? 1 : -1;
      arm.rotation.z = this.params.armRotation * m;
      arm.rotation.x = this.params.walkRotation * m;
    });

    // Move the legs
    this.legs.forEach((leg, index) => {
      const m = index % 2 === 0 ? 1 : -1;
      leg.rotation.x = this.params.walkRotation * m;
    });

    this.head.rotation.z = this.params.headRotation;
    this.head.children[1].children[0].scale.y =
      (this.params.leftEyeScale,
      this.params.leftEyeScale,
      this.params.leftEyeScale);

    // Walk animation
  }

  init() {
    this.createHead();
    this.createBody();
    this.createArms();
    this.createAntennas();
  }
}

const figure = new Figure({
  y: 1.5,
});
figure.init();

let rySpeed = 0;
let walkSpeed = 0;
let keyTL = gsap.timeline();
document.addEventListener("keydown", (event) => {
  if (event.key == " " && !keyTL.isActive()) {
    keyTL.to(figure.params, {
      y: 3,
      armRotation: degreesToRadians(90),
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: CustomEase.create(
        "custom",
        "M0,0 C0.126,-0.341 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1 "
      ),
    });
    idleTL.pause();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") {
    rySpeed += 0.05;
    if (rySpeed > 0.1) {
      rySpeed = 0.1;
    }
    idleTL.pause();
  } else if (event.key == "ArrowRight") {
    rySpeed -= 0.05;
    idleTL.pause();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    walkSpeed += 0.03;
    idleTL.pause();
    walkTL.restart();
    if (walkSpeed > 0.1) {
      walkSpeed = 0.1;
    }
  } else if (event.key == "ArrowDown") {
    walkSpeed -= 0.03;
    idleTL.pause();
    walkTL.restart();
  }
});

let walkTL = gsap.timeline();
walkTL.to(figure.params, {
  walkRotation: degreesToRadians(30),
  duration: 0.25,
  yoyo: true,
  repeat: 1,
});

walkTL.to(
  figure.params,
  {
    walkRotation: degreesToRadians(-30),
    duration: 0.25,
    yoyo: true,
    repeat: 1,
  },
  ">"
);

let idleTL = gsap.timeline();
idleTL.to(figure.params, {
  headRotation: Math.PI / 4,
  duration: 0.75,
  delay: 2.5,
  yoyo: true,
  repeat: 1,
});

idleTL.to(
  figure.params,
  {
    leftEyeScale: 1.2,
    duration: 1,
    yoyo: true,
    repeat: 1,
  },
  ">2.2"
);

let bullet = new Bullet();
scene.add(bullet);
document.addEventListener("keydown", (event) => {
    if (event.key == "f") {
        bullet.fire();
    }
});

// boucle d'animation
gsap.ticker.add(() => {
  figure.params.ry += rySpeed;
  rySpeed *= 0.98;

  walkSpeed *= 0.98;
  figure.params.x += Math.sin(figure.params.ry) * walkSpeed;
  figure.params.z += Math.cos(figure.params.ry) * walkSpeed;

  if (!keyTL.isActive() && !idleTL.isActive() && rySpeed < 0.01) {
    idleTL.restart();
  }
  figure.update();
  bullet.update();
});

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight
);
camera.position.set(30, 30, 30); // Position initiale de la caméra
camera.up.set(0, 1, 0); // Ajustement de l'orientation de la caméra
camera.lookAt(0, 0, 0);

// Fog
const near = 20;
const far = 60;
const color = "lightblue";
scene.fog = new THREE.Fog(color, near, far);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true; // Active les ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type d'ombres
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05; // Ajustement de l'amortissement
controls.screenSpacePanning = false;
controls.minDistance = 10; // Distance minimale de zoom
controls.maxDistance = 100; // Distance maximale de zoom
controls.maxPolarAngle = Math.PI / 2; // Limite de l'angle de rotation verticale

const grid = scene.add(new THREE.GridHelper(35, 35));

const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  stats.update();
};

loop();
