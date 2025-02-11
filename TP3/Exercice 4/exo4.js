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
light.castShadow = true; 
scene.add(light);
scene.add(new THREE.DirectionalLightHelper(light));

light.shadow.mapSize.width = 512; 
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 0.5; 
light.shadow.camera.far = 500; 
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
groundMesh.receiveShadow = true; 
scene.add(groundMesh);



// geometry
const Mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// cylinder
const radiusTop = 1;
const radiusBottom = 1;
const height = 1;
const radialSegments = 100;
const heightSegments = 100;
const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments);
cylinderGeometry.castShadow = true;
// sphere
const radius = 2;
const widthSegments = 100;
const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
sphereGeometry.castShadow = true;

// Pendulum Waves
const Pendulum  = new THREE.Object3D();
scene.add(Pendulum);
Pendulum.position.y = 15;

// support
const supportMesh = new THREE.Mesh(cylinderGeometry, Mat);
supportMesh.position.y = 0;
supportMesh.scale.set(2, 36, 2);
supportMesh.rotateZ(Math.PI / 2);
supportMesh.castShadow = true;
Pendulum.add(supportMesh);

let speed = [];
const balls = new THREE.Object3D();
// balls
for (let i = 0; i < 7; i++) {
    const ball = new THREE.Object3D();
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, Mat);
    cylinderMesh.scale.set(0.4, 8, 0.4);
    cylinderMesh.position.y = -7/2 - 0.4 * i;
    cylinderMesh.position.x = -15 + 5 * i;
    cylinderMesh.castShadow = true;
    ball.add(cylinderMesh);
    const sphereMesh = new THREE.Mesh(sphereGeometry, Mat);
    sphereMesh.position.y = -7 - 0.4 * i;
    sphereMesh.position.x = -15 + 5 * i;
    sphereMesh.castShadow = true;
    ball.add(sphereMesh);
    speed.push(0.7 + 0.03 * i);
    balls.add(ball);
}
Pendulum.add(balls);
console.log(speed);


// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(30, 30, 30); 
camera.up.set(0, 1, 0); 
camera.lookAt(0, 0, 0);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });


renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
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
controls.dampingFactor = 0.05; 
controls.screenSpacePanning = false;
controls.minDistance = 10; 
controls.maxDistance = 100; 
controls.maxPolarAngle = Math.PI / 2; 

scene.add(new THREE.GridHelper(50, 50));

const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);

const loop = () => {

    controls.update();
    render(); 
    window.requestAnimationFrame(loop);
    stats.update();
}
let go = false;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function clickToLaunch(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(Pendulum ? Pendulum.children : [], true);

    if (intersects.length > 0) {
        console.log('Pendulum clicked');
        go = true;
    }
}
let degree = 0;
function render() {
    for (let i = 0; i < 7; i++) {
        const ball = balls.children[i];
        if (go) {
            ball.rotation.x += speed[i] * 0.025;
            if (ball.rotation.x >= Math.PI / 3) {
                ball.rotation.x = Math.PI / 3;
                speed[i] = -speed[i];
            }
            if (ball.rotation.x <= -Math.PI / 3) {
                ball.rotation.x = -Math.PI / 3;
                speed[i] = -speed[i];
            }

        }
        renderer.render(scene, camera);
    }
}

window.addEventListener('click', clickToLaunch);
scene.add(new THREE.AxesHelper(30));
loop();
