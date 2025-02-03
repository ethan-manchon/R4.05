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
scene.background = new THREE.CubeTextureLoader()
    .setPath( 'assets/dark-s_' ) 
    .load( [
                'px.jpg',
                'nx.jpg',
                'py.jpg',
                'ny.jpg',
                'pz.jpg',
                'nz.jpg'
            ] );

// un tableau d'objets dont la rotation à mettre à jour
const objects = [];
 
// utiliser une seule sphère pour tout
const radius = 1;
const widthSegments = 100;
const heightSegments = 100;
const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

// Solar system enfant de la scène
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

// Sun enfant de la scène
const sunMaterial = new THREE.MeshPhongMaterial({
    emissive: 0xffff00,
    emissiveMap: new THREE.TextureLoader().load('./assets/8k_sun.jpg'),
    emissiveIntensity: 1
 });
 

const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
scene.add(sunMesh);

{
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
}

// Mars orbit enfant de solarSystem
const marsOrbit = new THREE.Object3D();
marsOrbit.position.x = 22;
marsOrbit.time = 3;
solarSystem.add(marsOrbit);
objects.push(marsOrbit);

const marsOrbitTrack = new THREE.TorusGeometry(22, 0.1, 12, 100);
const marsOrbitTrackMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const marsOrbitTrackMesh = new THREE.Mesh(marsOrbitTrack, marsOrbitTrackMaterial);
marsOrbitTrackMesh.rotation.x = Math.PI / 2;
solarSystem.add(marsOrbitTrackMesh);

const marsColor = "./assets/marsmap1k.jpg";
const marsBump = "./assets/marsbump1k.jpg";
const textureMarsLoader = new THREE.TextureLoader();
const marsMaterial = new THREE.MeshPhongMaterial({
   map: textureMarsLoader.load(marsColor),
   bumpMap: textureMarsLoader.load(marsBump),
   bumpScale: 0.25,
   shininess: 1
});

const marsMesh = new THREE.Mesh(sphereGeometry, marsMaterial);
// console.log(marsMesh);
marsMesh.time = 3;
// console.log(marsMesh.time);
marsMesh.scale.set(0.8, 0.8, 0.8);
marsOrbit.add(marsMesh);
objects.push(marsMesh);

// Earth orbit enfant de solarSystem
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 16;
earthOrbit.time = 2;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const earthOrbitTrack = new THREE.TorusGeometry(16, 0.1, 12, 100);
const earthOrbitTrackMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const earthOrbitTrackMesh = new THREE.Mesh(earthOrbitTrack, earthOrbitTrackMaterial);
earthOrbitTrackMesh.rotation.x = Math.PI / 2;
solarSystem.add(earthOrbitTrackMesh);


const earthColor = "./assets/earthmap1k.jpg";
const earthBump = "./assets/earthbump1k.jpg";
const earthSpec = "./assets/earthspec1k.jpg";
const textureEarthLoader = new THREE.TextureLoader();
const earthMaterial = new THREE.MeshPhongMaterial({
   map: textureEarthLoader.load(earthColor),
   bumpMap: textureEarthLoader.load(earthBump),
   specularMap: textureEarthLoader.load(earthSpec),
   bumpScale: 0.25,
   shininess: 1
});

const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthMesh.time = 2;
earthOrbit.add(earthMesh);
objects.push(earthMesh);

// Moon orbit enfant de earthOrbit
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
moonOrbit.time = 1;
earthOrbit.add(moonOrbit);

const moonOrbitTrack = new THREE.TorusGeometry(2, 0.05, 8, 50);
const moonOrbitTrackMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const moonOrbitTrackMesh = new THREE.Mesh(moonOrbitTrack, moonOrbitTrackMaterial);
moonOrbitTrackMesh.rotation.x = Math.PI / 2;
earthOrbit.add(moonOrbitTrackMesh);

const moonColor = "./assets/moonmap1k.jpg";
const moonBump = "./assets/moonbump1k.jpg";
const textureMoonLoader = new THREE.TextureLoader();
const moonMaterial = new THREE.MeshPhongMaterial({
   map: textureMoonLoader.load(moonColor),
   bumpMap: textureMoonLoader.load(moonBump),
   bumpScale: 0.25,
   shininess: 1
});

const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.time = 1;
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);


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

const gui = new GUI();

const param = {
    sun: true,
    mars: true,
    earth: true,
    moon: true,
    // grid: true,
    speed: 0.01,
};
gui.add( param, 'sun' ).name("Sun");
gui.add( param, 'mars' );
gui.add( param, 'earth' );
gui.add( param, 'moon' );
// gui.add( param, 'grid' );
gui.add( param, 'speed', 0, 0.05 );

let speed = 0;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// const grid = scene.add(new THREE.GridHelper(25, 25));

const loop = () => {
    controls.update(); 

    sunMesh.visible = param.sun;
    marsMesh.visible = param.mars;
    marsOrbitTrackMesh.visible = param.mars;
    earthMesh.visible = param.earth;
    earthOrbitTrackMesh.visible = param.earth;
    moonMesh.visible = param.moon;
    moonOrbitTrackMesh.visible = param.moon;
    // grid.visible = param.grid;
    
    speed += param.speed;
    objects.forEach((obj) => {
        if (obj.time === undefined) obj.time = 1;
        obj.rotation.y = obj.time * speed;
    });
    
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
    stats.update();
}

loop();