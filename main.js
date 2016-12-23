var OPACITY = 0.6;
var BASE_SIZE = 100;

var container;
var camera, scene, renderer;
var group;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  info.innerHTML = '<h1>Acrylamps</h1><br/>Drag to spin';
  container.appendChild( info );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 500 );
  camera.position.set( 0, 0, BASE_SIZE * 2 );
  scene.add( camera );

  var light = new THREE.PointLight( 0xffffff, 1 );
  camera.add( light );

  group = new THREE.Group();
  group.position.y = 0;
  scene.add( group );

  var loader = new THREE.TextureLoader();

  function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

    var geometry = new THREE.ShapeBufferGeometry( shape );

    // extruded shape
    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: color, transparent: true, opacity: OPACITY } ) );
    mesh.rotation.set( rx, ry, rz );
    mesh.position.set( x, y, z );
    //mesh.scale.set( s, s, s );
    group.add( mesh );

  }

  // Rectangle
  function getRect(length, width) {
    var rectShape = new THREE.Shape();
    var halfLength = length / 2;
    var halfWidth = width / 2;
    rectShape.moveTo(-halfWidth, -halfLength);
    rectShape.lineTo(halfWidth, -halfLength);
    rectShape.lineTo(halfWidth, halfLength);
    rectShape.lineTo(-halfWidth, halfLength);
    rectShape.lineTo(-halfWidth, -halfLength);
    return rectShape;
  }

  var extrudeSettings = { amount: 2, bevelEnabled: false };

  addShape(getRect(BASE_SIZE, BASE_SIZE), extrudeSettings, 0x800080, 0, 0, 0, 0, Math.PI/2, 0, 1 );
  addShape(getRect(BASE_SIZE, BASE_SIZE), extrudeSettings, 0x0000F0, 0, 0, 0, 0, 0, 0, 1 );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xf0f0f0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseDown( event ) {
  event.preventDefault();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'mouseout', onDocumentMouseOut, false );
  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDown = targetRotation;
}
function onDocumentMouseMove( event ) {
  mouseX = event.clientX - windowHalfX;
  targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}
function onDocumentMouseUp( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

}
function onDocumentMouseOut( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentTouchStart( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }
}
function onDocumentTouchMove( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
  }
}
function animate() {
  requestAnimationFrame( animate );
  render();
}
function render() {
  group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;
  renderer.render( scene, camera );
}
