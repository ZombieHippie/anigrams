
this.createPoint = (loc_x, loc_y, onmove, slow=false) ->
  newEl = $("<div class='ani-point'><div></div></div>")
  newEl.appendTo(".ani-points")
  target = newEl[0]
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + loc_x + 'px, ' + loc_y + 'px)'
  target.setAttribute('data-x', loc_x)
  target.setAttribute('data-y', loc_y)
  
  interact_options = {
    # enable inertial throwing
    inertia: true
    # keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: false,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    }

    # call this function on every dragmove event
    onmove: (event) ->
      target = event.target
      # keep the dragged position in the data-x/data-y attributes
      x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

      # translate the element
      target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'

      # update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)

      onmove?(x, y, event.dx, event.dy)

    # call this function on every dragend event
    onend: (event) ->
      textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of ' + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
  }

  if slow
    interact_options.snap = {
      targets: [
        interact.createSnapGrid({ x: 10, y: 10 })
      ],
      range: Infinity,
      elementOrigin: { x: 0, y: 0 }
    }

  interact(target)
  .draggable interact_options