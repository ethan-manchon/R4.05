import * as THREE from 'three';

// Scene graph
const scene = new THREE.Scene();

// un tableau d'objets dont la rotation à mettre à jour
const objects = [];
 
// utiliser une seule sphère pour tout
const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);



// Solar system enfant de la scène
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

// Sun enfant de la scène
const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
scene.add(sunMesh);

{
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
}

// Earth orbit enfant de solarSystem
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 16;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

// Moon orbit enfant de earthOrbit
const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 4;
earthOrbit.add(moonOrbit);

const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);


let time = 0;

const loop = () => {
    time += 0.01;

    objects.forEach((obj) => {
        obj.rotation.y = time;
    });

    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}
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

loop();
