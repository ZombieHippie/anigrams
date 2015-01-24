function animate(){

renderer.render(scene, camera);

requestAnimationFrame(function(){
    animate();
});
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 700;

var scene = new THREE.Scene();

var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(100, 100, 15, 50, 50, false), new THREE.MeshNormalMaterial());
cylinder.overdraw = true;
//scene.add(cylinder);

var geom = new THREE.Geometry();
var v1 = new THREE.Vector3(0, 0, 0);
var v2 = new THREE.Vector3(100, 0, 0);
var v3 = new THREE.Vector3(100, 100, 0);

geom.vertices.push(v1);
geom.vertices.push(v2);
//geom.vertices.push(v3);

pi = 3.14159265358979;
for (var i = 2; i < 360; i++)
{
    var v = new THREE.Vector3(Math.cos(i / 180 * pi) * 100, Math.sin(i / 180 * pi) * 100, 0);
    geom.vertices.push(v);
    geom.faces.push(new THREE.Face3(0, i - 1, i));
}

//geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
geom.computeFaceNormals();

var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
object.material.side = THREE.DoubleSide;

object.position.z = 100;

scene.add(object);

animate();
