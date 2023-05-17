/*global THREE, requestAnimationFrame, console*/

var scene, renderer;

var frontalCamera, sideCamera, topCamera, isometricOrthogonalCamera, isometricPerspectiveCamera, activeCamera;

var geometry, material, mesh;

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
    }
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;

    frontalCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    frontalCamera.position.set(0, 0, 100)
    frontalCamera.lookAt(scene.position);

    sideCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    sideCamera.position.set(100,0,0)
    sideCamera.lookAt(scene.position);

    topCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    sideCamera.position.set(0,100,0)
    sideCamera.lookAt(scene.position);

    isometricOrthogonalCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    isometricOrthogonalCamera.position.set(50,50,50)
    isometricOrthogonalCamera.lookAt(scene.position);

    isometricPerspectiveCamera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    isometricPerspectiveCamera.position.set(50,50,50)
    isometricPerspectiveCamera.lookAt(scene.position);

} 

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xeeeeee );

    scene.position.x = 0;
    scene.position.y = 0;
    scene.position.z = 0;

    scene.add(new THREE.AxisHelper(100));

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