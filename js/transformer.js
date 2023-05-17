/*global THREE, requestAnimationFrame, console*/

var scene, renderer;

var frontalCamera, sideCamera, topCamera, isometricOrthogonalCamera, isometricPerspectiveCamera, activeCamera;

var geometry, material, mesh, robot;



function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        activeCamera.aspect = window.innerWidth / window.innerHeight;
        activeCamera.updateProjectionMatrix();
    }

}


function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 49:
            activeCamera = frontalCamera;
            break;
        case 50:
            activeCamera = sideCamera;
            break;
        case 51:
            activeCamera = topCamera;
            break;
        case 52:
            activeCamera = isometricOrthogonalCamera;
            break;
        case 53:
            activeCamera = isometricPerspectiveCamera;
            break;
        case 54: 
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
    }
}


function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;

    frontalCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    frontalCamera.position.set(0, 0, 200)
    frontalCamera.lookAt(scene.position);

    sideCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    sideCamera.position.set(200, 0, 0)
    sideCamera.lookAt(scene.position);

    topCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    topCamera.position.set(0, 200, 0)
    topCamera.lookAt(scene.position);

    isometricOrthogonalCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    isometricOrthogonalCamera.position.set(100, 100, 100)
    isometricOrthogonalCamera.lookAt(scene.position);

    isometricPerspectiveCamera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    isometricPerspectiveCamera.position.set(200, 200, 200)
    isometricPerspectiveCamera.lookAt(scene.position);

}


function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    scene.position.x = 0;
    scene.position.y = 0;
    scene.position.z = 0;

    scene.add(new THREE.AxisHelper(100));

    createRobot(0, 0, 0);

}


function render() {
    'use strict';
    renderer.render(scene, activeCamera);
}


function animate() {
    render();

    requestAnimationFrame(animate);
}


function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    activeCamera = frontalCamera;

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function createRobot(x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    var rightLeg = new THREE.Object3D();
    var leftLeg = new THREE.Object3D();
    var waist = new THREE.Object3D();

    addRobotFoot(rightLeg, -25, -250, 0);
    addRobotLeg(rightLeg, -25, -160, 0);
    addRobotThigh(rightLeg, -25, -45, 10);
    addRobotFoot(leftLeg, 25, -250, 0);
    addRobotLeg(rightLeg, 25, -160, 0);
    addRobotThigh(leftLeg, 25, -45, 10);
    addRobotWaist(waist, 0, 0, 0);

    waist.add(rightLeg);
    waist.add(leftLeg);
    scene.add(waist);
}

function addRobotFoot(leg, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(40, 10, 50);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    leg.add(mesh);
}

function addRobotLeg(leg, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(40, 170, 40);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    leg.add(mesh);    
}

function addRobotThigh(leg, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(20, 60, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    leg.add(mesh);
}

function addRobotWaist(waist, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(100, 30, 60);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    waist.add(mesh);
}