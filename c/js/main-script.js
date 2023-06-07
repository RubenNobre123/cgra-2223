var scene, renderer, bufferTexture;
var camera;
var textureSize = 512; // Size of the texture
var skyTexture;
var skyMaterial;
var currentTextureType;
var changeSky = false;
var UFO;
var activeCamera;

var moveUFORight = false;
var moveUFOLeft = false;
var moveUFOUp = false;
var moveUFODown = false;

var orbitControls;

var slight
var pointLights = [];
var trees = [];
var plane;

const clock = new THREE.Clock();
var delta;

var UFO_SPEED

const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const phongMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const toonMaterial = new THREE.MeshToonMaterial({ color: 0x0000ff });


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

    var heightMap = new THREE.TextureLoader().load("https://web.tecnico.ulisboa.pt/~ist199226/heightmap.png");
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    const planeMaterial = new THREE.MeshPhongMaterial(
    {
        color : 0x00FF00,
        side: THREE.DoubleSide,
        displacementMap : heightMap,
        displacementScale : 20
    });

    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0); 
    plane.scale.set(3, 3, 3);
    plane.rotation.x = Math.PI /2;
    scene.add(plane);

    drawHouse();

    var tree1 = new THREE.Object3D();
    drawTree(tree1, 0, 2, -20, 8, -Math.PI / 2);
    trees.push(tree1);

    var tree2 = new THREE.Object3D();
    drawTree(tree2, -20, 2, 15, 9, Math.PI /2);
    trees.push(tree2);

    var tree3 = new THREE.Object3D();
    drawTree(tree3, 10, 2, 20, 7, 0);
    trees.push(tree3);

    var tree4 = new THREE.Object3D();
    drawTree(tree4, 20, 2, -20, 9, 0);
    trees.push(tree4);

    
    drawUFO();
    drawSkydome();
    drawMoon();
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    var width = window.innerWidth;
    var height = window.innerHeight;

    var aspectRatio = width / height;

    camera = new THREE.PerspectiveCamera(70, aspectRatio, 1, 1000);
    camera.position.set(35, 35, 35)
    camera.lookAt(scene.position);
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
    'use strict';
    
    if(moveUFORight){
        UFO.position.x += UFO_SPEED;
    }
    if(moveUFOLeft){
        UFO.position.x -= UFO_SPEED;
    }
    if(moveUFOUp){
        UFO.position.z -= UFO_SPEED;
    }
    if(moveUFODown){
        UFO.position.z += UFO_SPEED;
    }
    if(changeSky) {
        skyTexture = createSkyTexture();
        skyMaterial.map = skyTexture;
    }
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    requestAnimationFrame(render);

    //renderer.render(scene, perspectiveCamera, bufferTexture);

	renderer.render(scene, camera);
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
    renderer.shadowMap.enabled = true

    createScene();
    createCamera();
    activeCamera = camera;
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    
    
    renderer.setAnimationLoop( function () {
    
        delta = clock.getDelta();
        UFO_SPEED = 50*delta
    
        update();
    
        renderer.render( scene, activeCamera);
        UFO.rotation.y += 0.05;    
    } );
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        activeCamera.aspect = window.innerWidth / window.innerHeight;
        activeCamera.updateProjectionMatrix();
    }
}

function createSkyTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    var context = canvas.getContext('2d');
  
    // Create the gradient background
    var gradient = context.createLinearGradient(0, 0, 0, textureSize);
    gradient.addColorStop(0, '#00008r'); // Dark blue
    gradient.addColorStop(1, '#9400d3'); // Dark violet
    context.fillStyle = gradient;
    context.fillRect(0, 0, textureSize, textureSize);
  
    // Draw the stars
    var starRadius = 1;
    var numStars = 600;
    for (var i = 0; i < numStars; i++) {
      var x = Math.random() * textureSize;
      var y = Math.random() * textureSize;
      context.fillStyle = '#ffffff';
      context.beginPath();
      context.arc(x, y, starRadius, 0, 2 * Math.PI);
      context.fill();
    }
  
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
  
    return texture;
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
            changeSky = true;
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
        case 37: // left arrow
            moveUFOLeft = true;
            break;
        case 38: // up arrow
            moveUFOUp = true;
            break;
        case 39: // right arrow
            moveUFORight = true;
            break;
        case 40: // down arrow
            moveUFODown = true;
            break;
        //case for 's' and 'S' to change the spotlight
        case 83: // S
        case 115: // s
            spotlight.visible = !spotlight.visible;
            break;
            //case for 'p' and 'P' to change the pointlights
        case 80: // P
        case 112: // p
            switchPointLights();
            break;
        case 54: // 6
            changeMaterial(lambertMaterial);
            break;
        case 55: // 7   
            changeMaterial(phongMaterial);
            break;
        case 56: // 8
            changeMaterial(toonMaterial);
            break;

    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    switch (e.keyCode) {
        case 37: // left arrow
            moveUFOLeft = false;
            break;
        case 38: // up arrow
            moveUFOUp = false;
            break;
        case 39: // right arrow
            moveUFORight = false;
            break;
        case 40: // down arrow
            moveUFODown = false;
            break;
        case 50: // 2
            changeSky = false;
            break;
    }

}

function drawHouse(){
    'use strict';

    var house = new THREE.Object3D();
    scene.add(house);
}

function drawTree(tree, x, y, z, high, rotation){
    'use strict';

    const trunkGeometry = new THREE.CylinderGeometry(1.5, 1.5, high, 16);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    tree.add(trunkMesh);

    const branchGeometry = new THREE.CylinderGeometry(0.5, 0.5, high/1.5, 16);
    const branchMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const branchMesh = new THREE.Mesh(branchGeometry, branchMaterial);
    branchMesh.position.set(1.5, -1.5, 0);
    branchMesh.rotateZ(-Math.PI / 4.5);
    tree.add(branchMesh);

    const foliageGeometry = new THREE.SphereGeometry(2, 50, 50);
    foliageGeometry.scale(2, 1, 2);
    const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 });
    const foliageMesh = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliageMesh.position.set(0, 3, 0);
    tree.add(foliageMesh);

    const foliageGeometry2 = new THREE.SphereGeometry(2, 50, 50);
    foliageGeometry2.scale(1.5, 0.5, 1.5);
    const foliageMaterial2 = new THREE.MeshBasicMaterial({ color: 0x006400 });
    const foliageMesh2 = new THREE.Mesh(foliageGeometry2, foliageMaterial2);
    foliageMesh2.position.set(3, 1, 0);
    tree.add(foliageMesh2);

    tree.rotateY(rotation);
    //tree.scale.set(1, high, 1);
    tree.position.set(x, 2*y, z);

    scene.add(tree);
}


function drawMoon() {
    const moonGeometry = new THREE.SphereGeometry(8, 10, 10);
    const moonMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(0, 80, 80);

    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    light.position.set( moon.position.x, moon.position.y, moon.position.z );
    moon.add(light); 

    scene.add(moon);

}

function drawUFO(){
    'use strict'

    UFO = new THREE.Object3D();

    const bodyGeometry = new THREE.SphereGeometry(1, 15, 15);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xadd8e6 });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.scale.set(1, 0.3, 1);
    UFO.add(bodyMesh);

    const cockpitGeometry = new THREE.SphereGeometry(0.5, 15, 15);
    cockpitGeometry.thetaLength = Math.PI / 4;
    const cockpitMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff  });
    const cockpitMesh = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpitMesh.scale.set(1, 0.5, 1);
    cockpitMesh.position.set(0, 0.3, 0);
    UFO.add(cockpitMesh);
    
    const numLights = 8; 
    const lightGeometry = new THREE.SphereGeometry(0.08, 5, 5);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    pointLights = [];

    for (let i = 0; i < numLights; i++) {
        const angle = (i / numLights) * Math.PI * 2;
        const x = Math.cos(angle) * 0.8;
        const z = Math.sin(angle) * 0.8;
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.set(x, -0.2, z);

        const pointLight = new THREE.PointLight(0xffff00, 1, 5);
        pointLight.position.set(x, -3, z);
        scene.add(pointLight);
        pointLights.push(pointLight);

        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        scene.add( pointLightHelper );

        lightMesh.add(pointLight);
        UFO.add(lightMesh);
    }

    const bottomGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    const bottomMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottomMesh.position.set(0, -0.3, 0);
    //bottomMesh.rotateX(Math.PI / 2);
    UFO.add(bottomMesh);

    slight = new THREE.SpotLight ( 0xffff00, 1, -10, Math.PI, 0.5, 2 );
    slight.position.set( bottomMesh.position.x, bottomMesh.position.y, bottomMesh.position.z );
    slight.target.position.set(bottomMesh.position.x, 0, bottomMesh.position.z);
    
    const spotLightHelper = new THREE.SpotLightHelper( slight );
    scene.add( spotLightHelper );
    
    UFO.add(slight);
    //UFO.add(slight.target); // Add this line
    
    UFO.position.set(0, 30, 0);
    //slight.target.position.set(UFO.position.x, 0, UFO.position.z);
    
    UFO.scale.set(10, 10, 10);
    scene.add(UFO);
}


function drawSkydome(){
    'use strict';

    var canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    var context = canvas.getContext('2d');
  
    // Create the gradient background
    var gradient = context.createLinearGradient(0, 0, 0, textureSize);
    gradient.addColorStop(0, '#00008b'); // Dark blue
    gradient.addColorStop(1, '#9400d3'); // Dark violet
    context.fillStyle = gradient;
    context.fillRect(0, 0, textureSize, textureSize);

    var starRadius = 1;
    var numStars = 600;
    for (var i = 0; i < numStars; i++) {
        var x = Math.random() * textureSize;
        var y = Math.random() * textureSize;
        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(x, y, starRadius, 0, 2 * Math.PI);
        context.fill();
    }
  
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var radius = 5;
    var radialSegments = 32;
    var material = new THREE.MeshStandardMaterial({map:texture});
    var hemiSphereGeom = new THREE.SphereGeometry(radius, radialSegments, Math.round(radialSegments / 4), 0, Math.PI * 2, 0, Math.PI / 2);
    var hemiSphere = new THREE.Mesh(hemiSphereGeom, material);
    //var capGeom = new THREE.CircleBufferGeometry(radius, radialSegments);
    //capGeom.rotateX(Math.PI * 0.5);
    //var cap = new THREE.Mesh(capGeom, material);
    //hemiSphere.add(cap);
        
    hemiSphere.material.side = THREE.DoubleSide;

    hemiSphere.scale.set(30,30,30);
    scene.add(hemiSphere);

}


function switchPointLights(){
    'use strict';

    for (let i = 0; i < pointLights.length; i++) {
        pointLights[i].visible = !pointLights[i].visible;
    }
}

function changeMaterial(material){
    'use strict';


    for (let i = 0; i < UFO.children.length; i++) {
        UFO.children[i].material = material;
    }

    for (let i = 0; i < trees.length; i++) {
        for (let j = 0; j < trees[i].children.length; j++) {
            trees[i].children[j].material = material;
        }
    }
}