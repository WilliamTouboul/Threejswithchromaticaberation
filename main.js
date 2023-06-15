import * as THREE from 'three';

import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import * as bgmesh from './meshes/background.js';
import * as txtmesh from './meshes/text.js';
import {
    createDiamond
} from './meshes/diamond.js';

//Creation SCENE
const scene = new THREE.Scene();

//Creation CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


// Creation RENDERER
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
});

// Parametrage + ajout au DOM
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creation CUBE + ajout a SCENE
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00
// });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

// Creation orbits pour manipuler la camera a la souris.
// const orbits = new OrbitControls(camera, renderer.domElement);

bgmesh.createBackground().then(background => {
    scene.add(background);
});


txtmesh.addText("MADE BY WILL", scene);

const diamond = createDiamond();
scene.add(diamond.mesh);





// Stockage pour la 'photo' du fond SANS prisme
const renderTargetSize = 1024;
const renderTarget = new THREE.WebGLRenderTarget(
    renderTargetSize,
    renderTargetSize
);



function map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

let mouse = {
    x: 0,
    y: 0
}

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

})

function animate() {
    requestAnimationFrame(animate);

    // Hide the glass object
    diamond.mesh.visible = false;

    // Render the scene to the WebGLRenderTarget
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);

    // Restore the renderer's target and make the glass object visible again
    renderer.setRenderTarget(null);
    diamond.mesh.visible = true;

    diamond.update(renderTarget.texture, camera);
    updateDiamondRotation();
    renderer.render(scene, camera);

}

animate();



// Function pour replacer comme prévus le canvas au resize.
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(2)
}

window.addEventListener('resize', onWindowResize)


function updateDiamondRotation() {
    const maxRotationDegres = 30;
    let targetRotationX = map(
        mouse.y,
        -1,
        1,
        (-maxRotationDegres * Math.PI) / 180,
        (maxRotationDegres * Math.PI) / 180
    );
    let targetRotationY = map(
        mouse.x,
        -1,
        1,
        (maxRotationDegres * Math.PI) / 180,
        (-maxRotationDegres * Math.PI) / 180
    );

    let lerpFactor = 0.1;
    diamond.mesh.rotation.x +=
        (targetRotationX - diamond.mesh.rotation.x) * lerpFactor;
    diamond.mesh.rotation.y +=
        (targetRotationY - diamond.mesh.rotation.y) * lerpFactor;
}