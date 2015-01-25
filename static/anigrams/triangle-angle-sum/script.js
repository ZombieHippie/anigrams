// triangle-side-sum

var points = []
var new_change = function (x, y, point_no) {
  x *= anigramSize
  y *= anigramSize
  points[point_no] = [x, y]
  createPoint(x, y, function (new_x, new_y, dx, dy) {
    console.log(point_no + ": " + new_x + ", " + new_y)
  })
}

new_change(.5, .1, 0)
new_change(.9, .9, 1)
new_change(.1, .1, 2)
