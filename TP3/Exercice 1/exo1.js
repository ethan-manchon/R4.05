import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// Au début du fichier
import Stats from 'three/addons/libs/stats.module.js';

// Pour créer l’affichage en haut à droite
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

// Scene graph
const scene = new THREE.Scene();
// Set the background of the scene
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

// const ground = new THREE.PlaneGeometry(100, 100, 100, 100);
// const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });


let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(50, 100, 10);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(new THREE.DirectionalLightHelper(light));

// Camera
const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

window.addEventListener('resize', () => {
    // Update sizes
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    
    // Update camera
    camera.updateProjectionMatrix()
    renderer.render(scene, camera);
});

// const gui = new GUI();

// const param = {
//   sun: true,
// };
// gui.add( param, 'sun' ).name("Sun");




const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// const grid = scene.add(new THREE.GridHelper(25, 25));

const loop = () => {
    controls.update(); 

// Code
    
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
    stats.update();
}

loop();