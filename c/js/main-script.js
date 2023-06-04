var scene, renderer, perspectiveCamera, bufferTexture;
var frontalCamera, sideCamera, topCamera, isometricOrthogonalCamera, isometricPerspectiveCamera, activeCamera;
var ovni;

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    const axesHelper = new THREE.AxesHelper( 5 );
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    scene.add( axesHelper );

    scene.position.set(0,0,0)
    

    const planeWidth = 45;
    const planeHeight = 45;

    var plane = new THREE.Object3D();
    const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 , side: THREE.DoubleSide}); 
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); 

    plane.add(planeMesh);
    plane.position.set(0, 0, 0); 
    plane.rotateX(Math.PI / 2); 
    scene.add(plane); 

    var colorArray = [];
    bufferTexture = new THREE.BufferGeometry();
    bufferTexture.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        -15, -15, 0,
        15, -15, 0,
        15, 15, 0,
        -15, 15, 0
    ]), 3));

    const indices = [
        0, 1, 2,
        2, 3, 0
    ]
    var color1 = new THREE.Color(0xff0000);
    var color2 = new THREE.Color(0x0000ff);
    colorArray = color1.toArray()
                .concat(color2.toArray())
                .concat(color2.toArray())
                .concat(color1.toArray());

    drawHouse();

    var tree1 = new THREE.Object3D();
    drawTree(tree1, 7, 7, 0, 0.5, -Math.PI / 2);

    var tree2 = new THREE.Object3D();
    drawTree(tree2, -5, 7, 20, 0.7, Math.PI /2);

    var tree3 = new THREE.Object3D();
    drawTree(tree3, -5, 7, 5, 0.3, 0);

    drawOvni();


}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;

    var aspectRatio = width / height;
    var distance = 30;

    perspectiveCamera = new THREE.PerspectiveCamera(70, aspectRatio, 1, 1000);
    perspectiveCamera.position.set(30, 30, 30)
    perspectiveCamera.lookAt(scene.position);

    frontalCamera = new THREE.OrthographicCamera(-aspectRatio * distance , aspectRatio*distance, distance, -distance, 1, 1000);
    frontalCamera.position.set(0, 0, 30)
    frontalCamera.lookAt(scene.position);

    sideCamera = new THREE.OrthographicCamera(-aspectRatio* distance, aspectRatio* distance, distance, -distance, 1, 1000);
    sideCamera.position.set(30, 0, 0)
    sideCamera.lookAt(scene.position);

    topCamera = new THREE.OrthographicCamera(-aspectRatio * distance, aspectRatio * distance, distance, -distance, 1, 1000);
    topCamera.position.set(0, 30, 0)
    topCamera.lookAt(scene.position);

    isometricOrthogonalCamera = new THREE.OrthographicCamera(-aspectRatio * distance, aspectRatio * distance, distance, -distance, 1, 1000);
    isometricOrthogonalCamera.position.set(30, 30, 30)
    isometricOrthogonalCamera.lookAt(scene.position);
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    requestAnimationFrame(render);

    //renderer.render(scene, perspectiveCamera, bufferTexture);

	renderer.render(scene, activeCamera);
}


////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;

    createScene();
    createCamera();

    activeCamera = perspectiveCamera;

    render();

    window.addEventListener("keydown", onKeyDown);

}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    renderer.setAnimationLoop( function () {

        renderer.render( scene, activeCamera);
        ovni.rotation.z += 0.05;

    
    } );
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
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
            activeCamera = perspectiveCamera;
            break;
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}

function drawHouse(){
    'use strict';

    var house = new THREE.Object3D();
    scene.add(house);
}

function drawTree(tree, x, y, z, high, rotation){
    'use strict';

    const trunkGeometry = new THREE.CylinderGeometry(1.5, 1.5, 10, 16);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    tree.add(trunkMesh);

    const branchGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const branchMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const branchMesh = new THREE.Mesh(branchGeometry, branchMaterial);
    branchMesh.position.set(3.5, 2.5, 0.5);
    branchMesh.rotateZ(-Math.PI / 2.5);
    tree.add(branchMesh);

    const foliageGeometry = new THREE.SphereGeometry(2, 50, 50);
    foliageGeometry.scale(3, 0.7, 3);
    const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 });
    const foliageMesh = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliageMesh.position.set(0, 6, 0);
    tree.add(foliageMesh);

    const foliageGeometry2 = new THREE.SphereGeometry(2, 50, 50);
    foliageGeometry2.scale(2, 0.5, 2);
    const foliageMaterial2 = new THREE.MeshBasicMaterial({ color: 0x006400 });
    const foliageMesh2 = new THREE.Mesh(foliageGeometry2, foliageMaterial2);
    foliageMesh2.position.set(6, 4, 0);
    tree.add(foliageMesh2);

    tree.rotateY(rotation);
    tree.scale.set(0.5, high, 0.5);
    tree.position.set(x, y, z);

    scene.add(tree);
}

function drawOvni(){
    'use strict'

    ovni = new THREE.Object3D();

    const bodyGeometry = new THREE.SphereGeometry(3, 64, 64);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xadd8e6 });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.scale.set(1, 0.5, 1);
    bodyMesh.rotateX(Math.PI / 2);
    ovni.add(bodyMesh);

    const cockpitGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
    const cockpitMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff  });
    const cockpitMesh = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpitMesh.position.set(0, 0, 1);
    ovni.add(cockpitMesh);
    

    const numLights = 8; 
    const lightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    for (let i = 0; i < numLights; i++) {
        const angle = (i / numLights) * Math.PI * 2;
        const x = Math.cos(angle) * 2.5;
        const y = Math.sin(angle) * 2.5;
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.set(x, y, -0.75);
        ovni.add(lightMesh);
    }

    const bottomGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16);
    const bottomMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottomMesh.position.set(0, 0, -1.5);
    bottomMesh.rotateX(Math.PI / 2);
    ovni.add(bottomMesh);

    ovni.position.set(0, 20, 0);
    ovni.scale.set(1.5, 1.5, 1.5);
    ovni.rotateX(-Math.PI / 2);
    scene.add(ovni);

    const pointLights = [];

    for (let i = 0; i < numLights; i++) {
        const angle = (i / numLights) * Math.PI * 2;
        const x = Math.cos(angle) * 2.5;
        const y = Math.sin(angle) * 2.5;
        const pointLight = new THREE.PointLight(0xffff00, 1, 5);
        pointLight.position.set(x, y, -3);
        scene.add(pointLight);
        pointLights.push(pointLight);
    }

    const spotLight = new THREE.SpotLight(0xffff00, 1);
    spotLight.position.set(0, 0, -3);
    spotLight.target = bottomMesh;
    scene.add(spotLight);
}

