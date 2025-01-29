import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
// La variable scene va contenir tous les objets que l'on souhaite afficher (Sphere, Lumière, Camera, etc...)

const scene = new THREE.Scene();


// Sphere
// SphereGeometry : permet de créer une sphère en 3D (premier paramètre : rayon, deuxième paramètre : nombre de segments sur la largeur, troisième paramètre : nombre de segments sur la hauteur)
// const geometry = new THREE.SphereGeometry(4, 64, 32); // Sphere
// const geometry = new THREE.PlaneGeometry(1, 1); // Plane
// const geometry = new THREE.BoxGeometry(3, 3, 3); // Box
// const geometry = new THREE.CylinderGeometry(2, 2, 4, 100, 1, false, 0, 7); // Cylinder
// const geometry = new THREE.ConeGeometry(4, 4, 100, 1, false, 0, 2* Math.PI); // Cone
// const geometry = new THREE.TorusGeometry(4, 1, 8, 6, 2* Math.PI); // Torus
const geometry = new THREE.TorusKnotGeometry(4, 1, 100, 8, 59, 71); // TorusKnot
geometry.rotateX(Math.PI / 2);  // Pour le torus sur la grille horizontale



// MesgBasicMaterial : permet de définir la couleur de l'objet de manière uniforme
// const material = new THREE.MeshBasicMaterial({
//    color: 0xffffff,
//    wireframe: true,
// });


// MeshPhysicalMaterial : permet de définir la couleur de l'objet avec des propriétés physiques, respect des ombres, etc...
const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 1,
    reflectivity: 1,
    clearCoat: 0.2,
    clearCoatRoughness: 1,
    lights: true,
    // flatShading: true, // Effet boule à facettes
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Plus lent quand on a beaucoup d'objets et de lumière à calculer, depend de l'effet que l'on veut donner à l'objet et du nombre de pixels à calculer

// Light
const light = new THREE.PointLight(0xffffff, 5, 80);
// const light = new THREE.DirectionalLight(0xffffff, 1, 100);
// const light = new THREE.SpotLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);
const aLight = new THREE.AmbientLight(0x151515);
scene.add(aLight);


// Camera
const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight);
camera.position.z = 20;
scene.add(camera);

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

let angleLight = 0;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {

   controls.update();
   
   
   light.position.x = 10 * Math.cos(angleLight);
   light.position.z = 10 * Math.sin(angleLight);

   angleLight += 0.02;
   renderer.render(scene, camera);
   window.requestAnimationFrame(loop);
}

scene.add(new THREE.AxesHelper(10));
scene.add(new THREE.PointLightHelper(light));
// scene.add(new THREE.DirectionalLightHelper(light));
// scene.add(new THREE.SpotLightHelper(light));
scene.add(new THREE.GridHelper(10, 15));
 
loop();