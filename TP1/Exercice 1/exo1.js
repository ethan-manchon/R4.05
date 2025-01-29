import * as THREE from 'three';


// Scene
// La variable scene va contenir tous les objets que l'on souhaite afficher (Sphere, Lumière, Camera, etc...)

const scene = new THREE.Scene();


// Sphere
// SphereGeometry : permet de créer une sphère en 3D (premier paramètre : rayon, deuxième paramètre : nombre de segments sur la largeur, troisième paramètre : nombre de segments sur la hauteur)
const geometry = new THREE.SphereGeometry(4, 16, 16);


// MesgBasicMaterial : permet de définir la couleur de l'objet de manière uniforme
// const material = new THREE.MeshBasicMaterial({
//    color: 0xffffff,
//    wireframe: true,
// });


// MeshPhysicalMaterial : permet de définir la couleur de l'objet avec des propriétés physiques, respect des ombres, etc...
const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.5,
    reflectivity: 0.5,
    clearCoat: 0.5,
    clearCoatRoughness: 0.5,
    lights: true,
    // flatShading: true, // Effet boule à facettes
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Plus lent quand on a beaucoup d'objets et de lumière à calculer, depend de l'effet que l'on veut donner à l'objet et du nombre de pixels à calculer

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);
const aLight = new THREE.AmbientLight(0x151515);
scene.add(aLight);


// Camera
const camera = new THREE.PerspectiveCamera(45, 800 / 600);
camera.position.z = 20;
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(800, 600);
renderer.render(scene, camera);
