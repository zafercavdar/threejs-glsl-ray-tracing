/////////////////////////////////////////////////////////////////////////////////////////
//  UBC CPSC 314,  Vjan2018
//  Assignment 6 Template;   compatible with three.js  r90
/////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////
//  SETUP RENDERER, SCENE & CAMERA            //
////////////////////////////////////////////////

var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xd0f0d0); // set background colour
canvas.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30,1,0.1,10000); // view angle, aspect ratio, near, far
camera.position.set(0,45,45);
camera.lookAt(0,0,0);
scene.add(camera);

// SETUP ORBIT CONTROLS OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.autoRotate = false;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
}

// EVENT LISTENER RESIZE
window.addEventListener('resize',resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
     window.scrollTo(0,0);
}

////////////////////////////////////////////////
//  ADD LIGHTS                                //
////////////////////////////////////////////////

light = new THREE.PointLight(0xffffff);
light.position.set(-5,-3,4);                           // WCS coords for light
var vcsLight = new THREE.Vector3(0.0,0.0,0.0);       // VCS coords for light

scene.add(light);
ambientLight = new THREE.AmbientLight(0x606060);
scene.add(ambientLight);

var diffuseMaterial = new THREE.MeshLambertMaterial( {color: 0xff0000} );

//////////////////////////////////////////////// 
//  FLOOR with texture                        //
////////////////////////////////////////////////

var textureLoader = new THREE.TextureLoader();
floorTexture = textureLoader.load( "images/floor.jpg" );
floorTexture.magFilter = THREE.NearestFilter;
floorTexture.minFilter = THREE.NearestFilter
floorMaterial = new THREE.MeshBasicMaterial( {map: floorTexture, side:THREE.DoubleSide });
floorGeometry = new THREE.PlaneBufferGeometry(25.0, 25.0);
floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = 0.0;
floor.rotation.x = Math.PI / 2;

////////////////////////////////////////////////
//  SHADER & UNIFORMS                         //
////////////////////////////////////////////////

var raytracerMaterial = new THREE.ShaderMaterial( {     
        uniforms: { 
           lightPosition: {value: light.position},
           resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
           myFloat1: {value: 0.5},
           myFloat2: {value: 0.5}
        },
  vertexShader: document.getElementById( 'raytracerVertShader' ).textContent,
  fragmentShader: document.getElementById( 'raytracerFragShader' ).textContent
} );

////////////////////////////////////////////////
//  SCENE OBJECTS                             //
////////////////////////////////////////////////

sphere_small = new THREE.Mesh(new THREE.SphereGeometry(2.0, 32, 32), diffuseMaterial);
sphere_small.position.set(-1.0,16.0,0.0);
sphere_med = new THREE.Mesh(new THREE.SphereGeometry(3.0, 32, 32), diffuseMaterial);
sphere_med.position.set(6.0,13.0,0.0);
sphere_large = new THREE.Mesh(new THREE.SphereGeometry(6.0, 32, 32), diffuseMaterial);
sphere_large.position.set(0.0,6.0,-1.0);

////////////////////////////////////////////////
//  RAYTRACER OUTPUT "SCREEN"                 //
////////////////////////////////////////////////

var resolution_scale = 10.0;
screenGeometry = new THREE.PlaneBufferGeometry(window.innerHeight, window.innerHeight);
raytracerScreen = new THREE.Mesh(screenGeometry, raytracerMaterial);
raytracerScreen.position.set(0.0,0.0,0.0);
raytracerScreen.rotation.x = -Math.PI / 6;
raytracerScreen.material.side = THREE.DoubleSide;
scene.add(raytracerScreen);

////////////////////////////////////////////////
//  SCENE to SHADER MAPPING, FUNC             //
////////////////////////////////////////////////

////////////////////////////////////////////////
//  LISTEN TO KEYBOARD                        //
////////////////////////////////////////////////

var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W")) {
    console.log('W pressed');
    light.position.y += 0.1;
  } else if (keyboard.pressed("S"))
    light.position.y -= 0.1;
  if (keyboard.pressed("A"))
    light.position.x -= 0.1;
  else if (keyboard.pressed("D"))
    light.position.x += 0.1;
}

////////////////////////////////////////////////
//  UPDATE CALLBACK                           //
////////////////////////////////////////////////

function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  raytracerScreen.lookAt(camera.position);
  raytracerMaterial.uniforms.lightPosition.value = light.position;
  raytracerMaterial.uniforms.lightPosition.value.needsUpdate = true;
  var i = 0.5+0.5*Math.sin(Date.now()*0.001*5.0);
  raytracerMaterial.uniforms.myFloat1.value = i;
  raytracerMaterial.uniforms.myFloat1.needsUpdate = true;
  var i2 = 0.5+0.5*Math.cos(Date.now()*0.001*5.0);
  raytracerMaterial.uniforms.myFloat2.value = i2;
  raytracerMaterial.uniforms.myFloat2.needsUpdate = true;
  renderer.render(scene, camera);
}

update();

