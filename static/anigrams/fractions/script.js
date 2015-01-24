pi = 3.14159265358979;
visual_objects = [];

function draw_sliver(radius, s_angle, f_angle, color)
{
    var geom = new THREE.Geometry();
    var v1 = new THREE.Vector3(0, 0, 0);
    var v2 = new THREE.Vector3(Math.cos(s_angle) * radius, Math.sin(s_angle) * radius, 0);

    geom.vertices.push(v1);
    geom.vertices.push(v2);
    pieces = 360;
    d_angle = 1 / pieces * 2;

    var i = 2;
    for (var angle = s_angle; angle < f_angle - 0.01; angle += d_angle) // - 0.01 for floating point error handling
    {
        var v = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        geom.vertices.push(v);
        face = new THREE.Face3(0, i - 1, i)
        geom.faces.push(face);
        i++;
    }
    var v = new THREE.Vector3(Math.cos(f_angle) * radius, Math.sin(f_angle) * radius, 0);
    geom.vertices.push(v);
    face = new THREE.Face3(0, i - 1, i)
    geom.faces.push(face);
    geom.computeFaceNormals();

    var object = new THREE.Mesh( geom, new THREE.MeshBasicMaterial( { color: color } ) );
    object.material.side = THREE.DoubleSide;

    object.position.z = 100;
    object.rotation.y = 0;
    scene.add(object);
    visual_objects.push(object)
}

function draw_frac(numerator, denominator)
{
    color = draw_frac.colors[draw_frac.index % draw_frac.colors.length]
    draw_frac.index += 1;
    start = draw_frac.offset * 2 * pi;
    end = (numerator / denominator + draw_frac.offset) * 2 * pi;
    draw_sliver(100, start, end, color);
    draw_frac.offset += numerator / denominator;
}
draw_frac.colors = [0x0000ff, 0x00ffff, 0x00ff00, 0xffff00, 0xff0000]
draw_frac.index = 0;
draw_frac.offset = 0;

var renderer = new THREE.WebGLRenderer({ antialias : true});
renderer.setSize(anigramSize, anigramSize);
$("#game>canvas").remove()
$("#game").prepend(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
camera.position.z = 700;

var scene = new THREE.Scene();

draw_frac(1, 4);
draw_frac(1, 4);
renderer.render(scene, camera);

