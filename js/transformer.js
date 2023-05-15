/*global THREE, requestAnimationFrame, console*/

var scene, renderer;

var frontalCamera, sideCamera, aboveCamera, isometricOrthogonalCamera, isometricPerspectiveCamera, activeCamera;

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
    }
}

function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;
    frontalCamera = new THREE.OrthographicCamera(
        width / -2, // Left
        width / 2,  // Right
        height / 2, // Top
        height / -2, // Bottom
        1,          // Near
        1000        // Far
      );

    sideCamera = new THREE.OrthographicCamera(
        width / -2, // Left
        width / 2,  // Right
        height / 2, // Top
        height / -2, // Bottom
        1,          // Near
        1000        // Far
      );

    frontalCamera.position.set(0, 0, 100)
    frontalCamera.lookAt(scene.position);

    sideCamera.position.set(100,0,0)
    sideCamera.lookAt(scene.position);
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