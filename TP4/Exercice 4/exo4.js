import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";
import Figure from "./chien.js";
import { degreesToRadians, random } from "./utils.js";

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

const dogs = [];
const walkSpeed = [];
const numDogs = 50;

for (let i = 0; i < numDogs; i++) {
  const newDog = new Figure({
    x: random(-15, 15),
    y: 1.5,
    z: random(-15, 15),
    ry: random(0, Math.PI * 2),
  });
  newDog.init();
  dogs.push(newDog);
  walkSpeed.push(random(0.004, 0.2, true));
}

gsap.ticker.add(() => {
  dogs.forEach((dog, index) => {
    dog.params.x += Math.sin(dog.params.ry) * walkSpeed[index];
    dog.params.z += Math.cos(dog.params.ry) * walkSpeed[index];

    // Check if the dog is at the edge of the ground
    if (dog.params.x > 17.5 || dog.params.x < -17.5 || dog.params.z > 17.5 || dog.params.z < -17.5) {
      dog.params.ry += Math.PI * (0.2 + Math.random()); // Change direction randomly
    }

    dog.update();
  });
});

dogs.forEach((dog, index) => {
  let walkTL = gsap.timeline();
  walkTL.to(dog.params, {
    walkRotation: degreesToRadians(45),
    duration: 0.02 / walkSpeed[index],
    yoyo: true,
    repeat: -1,
  });

  walkTL.to(
    dog.params,
    {
      walkRotation: degreesToRadians(-45),
      duration: 0.02 / walkSpeed[index],
      yoyo: true,
      repeat: -1, // Repeat indefinitely
    },
    ">"
  );
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
const near = 30;
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


const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
  stats.update();
};

loop();
