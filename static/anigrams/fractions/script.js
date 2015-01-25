pi = 3.14159265358979;

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
    object.position.z = -800;
    return object;
}

var renderer = new THREE.WebGLRenderer({ antialias : true, alpha : true});
renderer.setSize(anigramSize, anigramSize);
$("#game>canvas").remove()
$("#game").prepend("<input id='num_1' value='1' type='text' style='position:absolute; z-index: 2'>");
$("#game").prepend("<input id='num_2' value='1' type='text' style='position:absolute; top: 100px; z-index: 2'>");
$("#game").prepend("<input id='den_1' value='2'type='text' style='position:absolute; left: 100px; z-index: 2'>");
$("#game").prepend("<input id='den_2' value='2' type='text' style='position:absolute; left: 100px; top: 100px; z-index: 2'>");
$("#game").prepend(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, 1, 1, 1500);
camera.position.z = 700;

var scene = new THREE.Scene();

circle = function(xpos)
{
    this.index = 0;
    this.offset = 0;
    this.xpos = xpos;
}

circle.prototype.draw_frac = function(numerator, denominator, color)
{
    this.index += 1;
    start = this.offset * 2 * pi;
    end = (numerator / denominator + this.offset) * 2 * pi;
    sliver = draw_sliver(100, start, end, color);
    this.offset += numerator / denominator;
    sliver.position.x = this.xpos;
    scene.add(sliver);
    this.object = sliver;
}

colors = [0x3FB8AF, 0x7FC7AF, 0xDAD8A7, 0xFF9E9D, 0xFF3D7F]
circles = [];
circles.push(new circle(-500));
circles.push(new circle(-100));
circles.push(new circle(400));

function draw_frac_addition()
{
    for (var i = 0; i < 3; i++)
    {
        circles[i].offset = 0;
        scene.remove(circles[i].object);
    }
    num_1 = parseInt($("#num_1").val());
    num_2 = parseInt($("#num_2").val());
    den_1 = parseInt($("#den_1").val());
    den_2 = parseInt($("#den_2").val());
    circles[0].draw_frac(num_1, den_1, colors[0]);
    circles[1].draw_frac(num_2, den_2, colors[3]);
    circles[2].draw_frac(circles[0].offset, 1, colors[0]);
    circles[2].draw_frac(circles[1].offset, 1, colors[3]);
    renderer.render(scene, camera);
}

draw_frac_addition()
renderer.render(scene, camera);
$("input").on('input', draw_frac_addition);

