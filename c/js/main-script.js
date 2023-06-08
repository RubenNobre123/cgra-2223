//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var scene, renderer, bufferTexture;
var camera;
var textureSize = 512; // Size of the texture
var currentTextureType;
var changeSky = false;
var changeField = false;
var UFO;
var activeCamera;
var directionalLight;
var hemiSphere;
var tree_colors = [];
var UFO_colors = [];
var moon;

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

var lambertMaterial = new THREE.MeshLambertMaterial();
var phongMaterial = new THREE.MeshPhongMaterial();
var toonMaterial = new THREE.MeshToonMaterial();
var basicMaterial = new THREE.MeshBasicMaterial();




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
    camera.position.set(35, 75, 50)
    camera.lookAt(scene.position);
}


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {

    directionalLight = new THREE.DirectionalLight(0xffaa33, 0.5);
    directionalLight.position.set(35, 35, 35);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x111111, 0.2);
    scene.add(ambientLight);
}


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createPlane(){
    var heightMap = new THREE.TextureLoader().load("https://web.tecnico.ulisboa.pt/~ist199321/heightmap.png");
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);

    texture = createFieldTexture();

    const planeMaterial = new THREE.MeshPhongMaterial(
    {
        color : 0XFFFFFF,
        side: THREE.DoubleSide,
        displacementMap : heightMap,
        displacementScale : 10,
        map:texture
    });    

    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 30, 0); 
    plane.scale.set(3, 3, 3);
    plane.rotation.x = Math.PI /2;
    plane.material.side = THREE.DoubleSide;

    scene.add(plane);
}


function drawHouse(){
    'use strict';

    const houseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Base da casa
    const baseGeometry = new THREE.BoxGeometry(10, 5, 7);
    const base = new THREE.Mesh(baseGeometry, houseMaterial);
    base.position.y = 2;

    // Telhado
    const roofGeometry = new THREE.BoxGeometry(11, 3, 8);
    const roofMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 6;
    roof.position.z = -0.5;

    const doorWindowMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    // Porta
    const doorGeometry = new THREE.BoxGeometry(2, 4, 1);
    const door = new THREE.Mesh(doorGeometry, doorWindowMaterial);
    door.position.y = 2;
    door.position.z = -3.51;

    // Janelas
    const windowGeometry = new THREE.BoxGeometry(1.5, 1.5, 1);

    const window1 = new THREE.Mesh(windowGeometry, doorWindowMaterial);
    window1.position.set(-3, 2, -3.51);

    const window2 = window1.clone();
    window2.position.x = 3;

    const window3 = window1.clone();
    window3.position.set(-3, 2, -0.49);
    window3.rotation.y = Math.PI;

    const window4 = window3.clone();
    window4.position.x = 3;

    const trimMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // ou 0xffff00 para amarelo

    const trimGeometry = new THREE.BoxGeometry(11, 0.5, 0.5);
    const trim1 = new THREE.Mesh(trimGeometry, trimMaterial);
    trim1.position.set(0, -2.25, -3.51);

    const trim2 = trim1.clone();
    trim2.position.z = -0.49;
    trim2.rotation.y = Math.PI;

    scene.add(base, roof, door, window1, window2, window3, window4, trim1, trim2);
}

function drawTree(tree, x, y, z, high, rotation){
    'use strict';

    const trunkGeometry = new THREE.CylinderGeometry(1.5, 1.5, high, 16);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    tree_colors.push(0x8B4513);
    const trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);
    tree.add(trunkMesh);

    const branchGeometry = new THREE.CylinderGeometry(0.5, 0.5, high/1.5, 16);
    const branchMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    tree_colors.push(0x8B4513);
    const branchMesh = new THREE.Mesh(branchGeometry, branchMaterial);
    branchMesh.position.set(1.5, -1.5, 0);
    branchMesh.rotateZ(-Math.PI / 4.5);
    tree.add(branchMesh);

    const foliageGeometry = new THREE.SphereGeometry(2, 50, 50);
    foliageGeometry.scale(2, 1, 2);
    const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 });
    tree_colors.push(0x006400);
    const foliageMesh = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliageMesh.position.set(0, 3, 0);
    tree.add(foliageMesh);

    const foliageGeometry2 = new THREE.SphereGeometry(2, 50, 50);
    foliageGeometry2.scale(1.5, 0.5, 1.5);
    const foliageMaterial2 = new THREE.MeshBasicMaterial({ color: 0x006400 });
    tree_colors.push(0x006400);
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
    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xffffa5, emissive: 0xffffa5, emissiveIntensity: 0.3 });
    console.log(moonMaterial);
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(0, 80, 80);

    scene.add(moon);

}

function drawUFO(){
    'use strict'

    UFO = new THREE.Object3D();

    const bodyGeometry = new THREE.SphereGeometry(1, 15, 15);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xffa726 });
    UFO_colors.push(0xffa726);
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.scale.set(1, 0.3, 1);
    UFO.add(bodyMesh);

    const cockpitGeometry = new THREE.SphereGeometry(0.5, 15, 15);
    cockpitGeometry.thetaLength = Math.PI / 4;
    const cockpitMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb  });
    UFO_colors.push(0x87ceeb);
    const cockpitMesh = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpitMesh.scale.set(1, 0.5, 1);
    cockpitMesh.position.set(0, 0.3, 0);
    UFO.add(cockpitMesh);
    
    const numLights = 8; 
    const lightGeometry = new THREE.SphereGeometry(0.08, 5, 5);
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    pointLights = [];

    for (let i = 0; i < numLights; i++) {
        UFO_colors.push(0xffff00);
        const angle = (i / numLights) * Math.PI * 2;
        const x = Math.cos(angle) * 0.8;
        const z = Math.sin(angle) * 0.8;
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.set(x, -0.2, z);

        const pointLight = new THREE.PointLight(0xffff00, 1, 25);
        pointLight.position.set(x, 0, z);
        scene.add(pointLight);
        pointLights.push(pointLight);

        lightMesh.add(pointLight);
        UFO.add(lightMesh);
    }

    const bottomGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    const bottomMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    UFO_colors.push(0xffff00);
    const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottomMesh.position.set(0, -0.3, 0);
    UFO.add(bottomMesh);

    slight = new THREE.SpotLight ( 0xffff00, 1, 0, Math.PI/8, 0.5, 2 );
    slight.target.position.set(UFO.position.x, UFO.position.y - 10, UFO.position.z);
    UFO.add( slight );
    
    UFO.position.set(0, 30, 0);
    
    slight.position.set( UFO.position.x, 0, UFO.position.z );
    UFO.scale.set(10, 10, 10);
    scene.add(slight.target);
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

    var material = new THREE.MeshStandardMaterial({map:texture});
    var hemiSphereGeom = new THREE.SphereGeometry(5, 32, Math.round(8), 0, Math.PI * 2, 0, Math.PI / 2);
    hemiSphere = new THREE.Mesh(hemiSphereGeom, material);
        
    hemiSphere.material.side = THREE.DoubleSide;

    hemiSphere.scale.set(30,30,30);
    scene.add(hemiSphere);

}

function createSkyTexture() {
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

  function getRandomColor() {
    var colors = ['#ffffff', '#ffff00', '#dda0dd', '#add8e6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createFieldTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    var context = canvas.getContext('2d');

    context.fillStyle = '#008000'; 
    context.fillRect(0, 0, canvas.width, canvas.height);

    var flowerRadius = 1;
    var numFlowers = 600;
    for (var i = 0; i < numFlowers; i++) {
        var x = Math.random() * textureSize;
        var y = Math.random() * textureSize;
        context.fillStyle = getRandomColor();
        context.beginPath();
        context.arc(x, y, flowerRadius, 0, 2 * Math.PI);
        context.fill();
    }

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
  
    return texture;
  }

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
        var skyTexture = createSkyTexture();
        hemiSphere.material.map = skyTexture;
        hemiSphere.material.needsUpdate = true;
    }
    if(changeField) {
        var fieldTexture = createFieldTexture();
        plane.material.map = fieldTexture;
        plane.material.needsUpdate = true;
    }
    slight.target.position.set(UFO.position.x, UFO.position.y - 10, UFO.position.z);
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
    createLights();
    activeCamera = camera;

    createPlane();
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

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.maxDistance = 140;
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


///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 49: // 1
            changeField = true;
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
        case 83: // S
        case 115: // s
            slight.visible = !slight.visible;
            break;
        case 80: // P
        case 112: // p
            switchPointLights();
            break;
        case 81:
        case 113:
            changeMaterial(lambertMaterial);
            break;
        case 87:
        case 119:
            changeMaterial(phongMaterial);
            break;
        case 69:
        case 101:
            changeMaterial(toonMaterial);
            break;
        case 82:
        case 114:
            changeMaterial(basicMaterial);
            break;
        case 68: // D
        case 100: // d
            directionalLight.visible = !directionalLight.visible;
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
        case 49: // 1
            changeField = false;
            break;
    }

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
        material.color.set(UFO_colors[i]);
        UFO.children[i].material = material.clone();
    }
    
    for (let i = 0; i < trees.length; i++) {
        for (let j = 0; j < trees[i].children.length; j++) {
            material.color.set(tree_colors[j]);
            trees[i].children[j].material = material.clone();
        }
    }
    
    var material1 = material.clone();
    if(material != basicMaterial){ 
        material1.emissive.set(0xffffa5);
        material1.emissiveIntensity = 0.3;
    }
    material1.color.set(0xffffa5)
    moon.material = material1
    console.log(moon.material)
}

