var scene, renderer, perspectiveCamera, bufferTexture;

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
    

    const planeWidth = 40;
    const planeHeight = 40;

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
    drawTree(tree2, -5, 7, 20, 0.7, Math.PI);

    var tree3 = new THREE.Object3D();
    drawTree(tree3, -5, 7, 5, 0.3, 0);


}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;

    perspectiveCamera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    perspectiveCamera.position.set(30, 30, 30)
    perspectiveCamera.lookAt(scene.position);
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

    renderer.render(scene, perspectiveCamera, bufferTexture);

	renderer.render(scene, perspectiveCamera);
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

    render();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    renderer.setAnimationLoop( function () {

        renderer.render( scene, perspectiveCamera);
    
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

    const trunkGeometry = new THREE.CylinderGeometry(1, 1, 10, 16);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    tree.add(trunkMesh);

    const branchGeometry = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    const branchMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const branchMesh = new THREE.Mesh(branchGeometry, branchMaterial);
    branchMesh.position.set(2.5, 2.5, 0.5);
    branchMesh.rotateZ(-Math.PI / 4);
    tree.add(branchMesh);

    const foliageGeometry = new THREE.SphereGeometry(2, 50, 50);
    foliageGeometry.scale(2, 0.5, 2);
    const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 });
    const foliageMesh = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliageMesh.position.set(0, 6.5, 0);
    tree.add(foliageMesh);

    const foliageGeometry2 = new THREE.SphereGeometry(2, 50, 50);
    foliageGeometry2.scale(1, 0.3, 1);
    const foliageMaterial2 = new THREE.MeshBasicMaterial({ color: 0x006400 });
    const foliageMesh2 = new THREE.Mesh(foliageGeometry2, foliageMaterial2);
    foliageMesh2.position.set(5, 5, 0);
    tree.add(foliageMesh2);

    tree.rotateY(rotation);
    tree.scale.set(0.5, high, 0.5);
    tree.position.set(x, y, z);

    scene.add(tree);
}