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
    if (f_angle != Infinity)
    {
        var v;
        for (var angle = s_angle; angle < f_angle - 0.01; angle += d_angle) // - 0.01 for floating point error handling
        {
            v = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            geom.vertices.push(v);
            face = new THREE.Face3(0, i - 1, i)
            geom.faces.push(face);
            i++;
        }
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
renderer.setSize(anigramSize, anigramSize / 2);
$("#game>canvas").remove()
$("#game").prepend(renderer.domElement);

$('#game').prepend
(
'<div class="abs" style="z-index:2;">\
  <div class="c25">\
    <div id="num1" class="num">5</div>\
    <input id="num1range" type="range" max="9" min="0" data-target="num1">\
    <div class="nddiv"></div>\
    <div id="den1" class="num">5</div>\
    <input id="den1range" type="range" max="9" min="1" data-target="den1">\
  </div>\
  <div style="left: 25%" class="c125">\
    <div id="operator" class="sym">+</div>\
  </div>\
  <div style="left: 37.5%" class="c25">\
    <div id="num2" class="num">5</div>\
    <input id="num2range" type="range" max="9" min="0" data-target="num2">\
    <div class="nddiv"></div>\
    <div id="den2" class="num">5</div>\
    <input id="den2range" type="range" max="9" min="1" data-target="den2">\
  </div>\
  <div style="left: 62.5%" class="c125">\
    <div class="sym">=</div>\
  </div>\
  <div style="left: 75%" class="c25">\
    <div id="num3" class="num">5</div><span class="sep">&nbsp;</span>\
    <div class="nddiv"></div>\
    <div id="den3" class="num">5</div><span class="sep">&nbsp;</span>\
  </div>\
</div>\
\
<style>\
    .abs, .abs>div { position: absolute; }\
    .abs > div {height:100%}\
    .abs {width:100%;height:50%;top:50%}\
    .c25 { width: 25%; background: #aaffff; text-align: center; }\
    .c25>.num {font-size:15vh}\
    .c25>.nddiv {border-bottom: 3vh solid black;}\
    .c125 { width: 12.5%; background: #ccaaff; text-align: center }\
    .sym { padding: 15vh 5%; font-size: 10vw; position: inline }\
    .sep { height: 2em }\
</style>\
')

$("input[data-target]").on("input", function (event) {
  var targetId = event.target.dataset.target;
  document.getElementById(targetId).innerText = event.target.value
  draw_frac_addition()
})

var camera = new THREE.PerspectiveCamera(45, 2, 1, 1500);
camera.position.z = 00;

var scene = new THREE.Scene();

circle = function(xpos)
{
    this.index = 0;
    this.offset = 0;
    this.xpos = xpos;
    this.objects = [];
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
    this.objects.push(sliver);
}

colors = [0x3FB8AF, 0x7FC7AF, 0xDAD8A7, 0xFF9E9D, 0xFF3D7F]
circles = [];
circles.push(new circle(-500));
circles.push(new circle(00));
circles.push(new circle(500));

var mmc = function(o){
    for(var i, j, n, d, r = 1; (n = o.pop()) != undefined;)
        while(n > 1){
            if(n % 2){
                for (i = 3, j = Math.floor(Math.sqrt(n)); i <= j && n % i; i += 2);
                d = i <= j ? i : n;
            }
            else
                d = 2;
            for(n /= d, r *= d, i = o.length; i; !(o[--i] % d) && (o[i] /= d) == 1 && o.splice(i, 1));
        }
    return r;
};

var INS = {
    num1: $("#num1range")[0],
    den1: $("#den1range")[0],
    num2: $("#num2range")[0],
    den2: $("#den2range")[0]
}
function draw_frac_addition()
{
    var lcd = mmc([INS.den1.value, INS.den2.value])
    var val = INS.num1.value * INS.den2.value + INS.num2.value * INS.den1.value
    $("#num3").text(val)
    $("#den3").text(lcd)

    for (var i = 0; i < 3; i++)
    {
        circles[i].offset = 0;
        while (circles[i].objects.length != 0)
            scene.remove(circles[i].objects.pop());
    }
    num_1 = parseInt($("#num1range").val());
    num_2 = parseInt($("#num2range").val());
    den_1 = parseInt($("#den1range").val());
    den_2 = parseInt($("#den2range").val());
    circles[0].draw_frac(num_1, den_1, colors[0]);
    circles[1].draw_frac(num_2, den_2, colors[3]);
    circles[2].draw_frac(circles[0].offset, 1, colors[0]);
    circles[2].draw_frac(circles[1].offset, 1, colors[3]);
    renderer.render(scene, camera);
}

draw_frac_addition()
renderer.render(scene, camera);
