/*global THREE, requestAnimationFrame, console*/

var scene, renderer;

var frontalCamera, sideCamera, topCamera, isometricOrthogonalCamera, isometricPerspectiveCamera, activeCamera;

var geometry, baseMaterial, mesh, robot;

var greyColor = 0x333333;
var blueColor = 0x00008B;
var redColor = 0x8B0000;

var robotBlue = { color: blueColor, wireframe: true }
var robotGrey = { color: greyColor, wireframe: true }
var robotRed = { color: redColor, wireframe: true }

var baseMaterialBlue = new THREE.MeshBasicMaterial(robotBlue);
var baseMaterialGrey = new THREE.MeshBasicMaterial(robotGrey);
var baseMaterialRed = new THREE.MeshBasicMaterial(robotRed);

var rightLeg, leftLeg, waist, rightArm, leftArm, head

/**
 * Stores all materials in the scene. Useful for toggling wireframe.
 * According to teacher sources, an even number of objects in the
 * scene results in a not-working wireframe toggle (see Discord).
 */
var allMaterials = [baseMaterialBlue, baseMaterialRed, baseMaterialGrey];

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
        case 49: // 1
            activeCamera = frontalCamera;
            break;
        case 50: // 2
            activeCamera = sideCamera;
            break;
        case 51: // 3
            activeCamera = topCamera;
            break;
        case 52: // 4
            activeCamera = isometricOrthogonalCamera;
            break;
        case 53: // 5
            activeCamera = isometricPerspectiveCamera;
            break;
        case 54: // 6
            allMaterials.forEach(material => {
                material.wireframe = !material.wireframe
            })
            break;
        case 113: // q
        case 81: // Q

        break;
        case 97: // a
        case 65: // A

        break;
        case 115: // s
        case 83: // S
            waist.rotation.x -= 0.04;
        break;
        case 119: // w
        case 87: // W
            waist.rotation.x += 0.04;
        break;
        case 101: // e
        case 69: // E

        break;
        case 114: // r
        case 82: // R
            head.rotation.x += 0.04;
        break;
        case 100: // d
        case 68: // D

        break;
        case 102: // f
        case 70: // F
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

    createRobot();
    createTrailer(100,100,100);

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

function createTrailer(x, y, z) {
    'use strict';

    var trailerBack = new THREE.Object3D();
    var trailerFront = new THREE.Object3D();
    var trailerBody = new THREE.Object3D();
    var trailerWheel1 = new THREE.Object3D();
    var trailerWheel2 = new THREE.Object3D();
    var trailerWheel3 = new THREE.Object3D();
    var trailerWheel4 = new THREE.Object3D();

    addTrailerBack(trailerBack, -200, -200, 0);
    addTrailerFront(trailerFront, -200, -185, 125);
    addTrailerWheel(trailerWheel1, -170, -240, -40);
    addTrailerWheel(trailerWheel2, -170, -240, 10);
    addTrailerWheel(trailerWheel3, -230, -240, -40);
    addTrailerWheel(trailerWheel3, -230, -240, 10);


    trailerBody.add(trailerBack);
    trailerBody.add(trailerFront);
    trailerBody.add(trailerWheel1);
    trailerBody.add(trailerWheel2);
    trailerBody.add(trailerWheel3);
    trailerBody.add(trailerWheel4);
    scene.add(trailerBody);
}

function addTrailerBack(trailer, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(50, 80, 100);
    mesh = new THREE.Mesh(geometry, baseMaterialBlue);
    mesh.position.set(x, y, z);
    trailer.add(mesh);
}

function addTrailerFront(trailer, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(50, 50, 150);
    mesh = new THREE.Mesh(geometry, baseMaterialBlue);
    mesh.position.set(x, y, z);
    trailer.add(mesh);
}

function addTrailerWheel(trailer, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(20, 20, 10);
    mesh = new THREE.Mesh(geometry, baseMaterialBlue);
    mesh.position.set(x, y, z);
    mesh.rotation.z += Math.PI/2;
    trailer.add(mesh);
}

function createRobot() {
    'use strict';

    rightLeg = new THREE.Object3D();
    leftLeg = new THREE.Object3D();
    waist = new THREE.Object3D();
    rightArm = new THREE.Object3D();
    leftArm = new THREE.Object3D();
    head = new THREE.Object3D();

    addRobotFoot(rightLeg, -25, -250, 0);
    addRobotLeg(rightLeg, -25, -160, 0);
    addRobotThigh(rightLeg, -25, -45, 10);
    addWheel(rightLeg, -50, -135, 0);
    addWheel(rightLeg, -50, -185, 0);

    addRobotFoot(leftLeg, 25, -250, 0);
    addRobotLeg(rightLeg, 25, -160, 0);
    addRobotThigh(leftLeg, 25, -45, 10);
    addWheel(leftLeg, 50, -135, 0);
    addWheel(leftLeg, 50, -185, 0);

    addRobotWaist(waist, 0, 0, 0);
    addWheel(waist, 55, -15, 0);
    addWheel(waist, -55, -15, 0);

    addRobotAbdomen(0, 25, 0);
    addRobotChest(0, 60, 0);

    addArm(rightArm, 60, 60, -50);
    addForearm(rightArm, 60, 25, -20);
    addExaustingPipe(rightArm, -75, 80, 50);

    addArm(leftArm, -60, 60, -50);
    addForearm(leftArm, -60, 25, -20);
    addExaustingPipe(leftArm, 75, 80, -50);
    
    addHead(head, 0, 100, 0); 
    addAntenna(head, 17.5, 115, 0);
    addAntenna(head, -17.5, 115, 0);
    addEye(head, 8, 100, 15);
    addEye(head, -8, 100, 15);

    waist.add(rightLeg);
    waist.add(leftLeg);

    scene.add(waist);
    scene.add(rightArm);
    scene.add(leftArm);
    scene.add(head);
}

function addRobotFoot(leg, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(40, 10, 50);
    mesh = new THREE.Mesh(geometry, baseMaterialRed);
    mesh.position.set(x, y, z);
    leg.add(mesh);
}

function addRobotLeg(leg, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(40, 170, 40);
    mesh = new THREE.Mesh(geometry, baseMaterialBlue);
    mesh.position.set(x, y, z);
    leg.add(mesh);    
}

function addRobotThigh(leg, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(20, 60, 20);
    mesh = new THREE.Mesh(geometry, baseMaterialBlue);
    mesh.position.set(x, y, z);
    leg.add(mesh);
}

function addRobotWaist(waist, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(100, 30, 60);
    mesh = new THREE.Mesh(geometry, baseMaterialRed);
    mesh.position.set(x, y, z);
    waist.add(mesh);
}

function addRobotAbdomen(x, y, z){
    'use strict';

    geometry = new THREE.CubeGeometry(60, 20, 60);
    mesh = new THREE.Mesh(geometry, baseMaterialRed);
    mesh.position.set(x, y, z);
    scene.add(mesh);
}

function addRobotChest(x, y, z){
    'use strict';

    geometry = new THREE.CubeGeometry(100, 50, 60);
    mesh = new THREE.Mesh(geometry, baseMaterialRed);
    mesh.position.set(x, y, z);
    scene.add(mesh);
}

function addArm(arm, x, y, z){
    'use strict';

    geometry = new THREE.CubeGeometry(20, 50, 40);
    mesh = new THREE.Mesh(geometry, baseMaterialBlue);
    mesh.position.set(x, y, z);
    arm.add(mesh);
}

function addForearm(arm, x, y, z){
    'use strict';

    geometry = new THREE.CubeGeometry(20, 20, 100);
    mesh = new THREE.Mesh(geometry, baseMaterialBlue);
    mesh.position.set(x, y, z);
    arm.add(mesh);
}

function addWheel(obj, x, y, z){
    'use strict';

    geometry = new THREE.CylinderGeometry(20, 20, 10);
    mesh = new THREE.Mesh(geometry, baseMaterialGrey);
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addHead(head, x, y, z){
    'use strict';
    
    geometry = new THREE.CubeGeometry(30,30,30);
    mesh = new THREE.Mesh(geometry, baseMaterialBlue);
    mesh.position.set(x, y, z);
    head.add(mesh);
}

function addAntenna(head, x, y, z){
    'use strict';

    geometry = new THREE.CubeGeometry(5,20,5);
    mesh = new THREE.Mesh(geometry, baseMaterialBlue);
    mesh.position.set(x, y, z);
    head.add(mesh);
}

function addEye(head, x, y, z){
    'use strict';

    geometry = new THREE.CylinderGeometry(5,5,5);
    mesh = new THREE.Mesh(geometry, baseMaterialRed);
    mesh.position.set(x, y, z);
    mesh.rotation.x = Math.PI/2;
    head.add(mesh);
}

function addExaustingPipe(arm, x, y, z){
    'use strict';

    geometry = new THREE.CylinderGeometry(5, 5, 60);
    mesh = new THREE.Mesh(geometry, baseMaterialGrey);
    mesh.position.set(x, y, z);
    arm.add(mesh);
}