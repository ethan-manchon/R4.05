import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

// Scene graph
const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
    .setPath('assets/')
    .load([
        'posx.jpg',
        'negx.jpg',
        'posy.jpg',
        'negy.jpg',
        'posz.jpg',
        'negz.jpg'
    ]);

// Light
const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
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
const ground = new THREE.PlaneGeometry(50, 50, 50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xccffcc, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(ground, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true; // Active la réception des ombres
scene.add(groundMesh);

// geometry
const forest = new THREE.Group();
const numTrees = 100;
const minHeight = 5;
const maxHeight = 15;

for (let i = 0; i < numTrees; i++) {
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    const geometry = new THREE.BoxGeometry(2, height, 2);
    const geometryMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const geometryMesh = new THREE.Mesh(geometry, geometryMaterial);
    
    geometryMesh.position.set(
        (Math.random() - 0.5) * 49, // Random x position within the ground
        height / 2, // Position y to ensure the bottom is at the same altitude
        (Math.random() - 0.5) * 49  // Random z position within the ground
    );
    
    geometryMesh.castShadow = true; // Enable casting shadows
    geometryMesh.receiveShadow = true; // Enable receiving shadows
    
    forest.add(geometryMesh);
}

scene.add(forest);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(30, 30, 30); // Position initiale de la caméra
camera.up.set(0, 1, 0); // Ajustement de l'orientation de la caméra
camera.lookAt(0, 0, 0);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
// Antialias : effet marches d'escalier

renderer.shadowMap.enabled = true; // Active les ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type d'ombres
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

window.addEventListener('resize', () => {
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

scene.add(new THREE.GridHelper(50, 50));

const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

const loop = () => {
    controls.update();
    window.requestAnimationFrame(loop);
    stats.update();
}


loop();
