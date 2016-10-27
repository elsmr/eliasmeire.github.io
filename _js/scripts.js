var mdl = require('material-design-lite');

(function() {
  'use strict';

  var resizeTimer;
  var bodyWidth, bodyHeight;
  var exploded;
  var icons;

  window.addEventListener('load',function() {
    icons = shuffle([].slice.call(document.querySelectorAll('.icon-canvas .mdi')));
    bodyWidth = document.body.offsetWidth;
    bodyHeight = document.body.offsetHeight;
    exploded = true;

    positionIcons();
    explodeIcons();

    document.getElementById('implodeexplode').addEventListener('click', function() {
      if(exploded) {                
        implodeIcons();
        var button = this;
        setTimeout(function() {
          button.textContent = 'Explode';
        }, 250);
      } else {
        explodeIcons();
        var button = this;
        setTimeout(function() {
          button.textContent = 'Implode';
        }, 250);
      } 

      exploded = !exploded;
    });

    icons[0].addEventListener('animationend', function() {
      for (var i = icons.length - 1; i >= 0; i--) {
        if(icons[i].classList.contains('implode')) {
          icons[i].style.opacity = 0;
          icons[i].classList.remove('implode');
        } else if(icons[i].classList.contains('explode')) {
          icons[i].style.opacity = 1;
          icons[i].classList.remove('explode');
        }
      }
    });


    var ghosts = [].slice.call(document.querySelectorAll('.mdi-ghost'));
    ghosts.forEach(function (ghost) {
      ghost.addEventListener('click', function(e) {
        this.classList.contains('colorshift') ? this.classList.remove('colorshift') : this.classList.add('colorshift');
        e.target.removeEventListener(e.type, null);
      });
    });
  });

  window.addEventListener('resize',function() {
        // Only trigger this when done resizing
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          icons = shuffle(icons);
          bodyWidth = document.body.offsetWidth;
          bodyHeight = document.body.offsetHeight;
          positionIcons();
        }, 250);
      });

  var positionIcons = function() {
    var radius = (document.getElementsByClassName('content')[0].offsetWidth / 2) +  50 + Math.max(bodyWidth,bodyHeight) / 10;
    positionNodesCircles(icons.slice(0), radius, 8, 3, 100 + Math.max(bodyWidth,bodyHeight) / 20);
  }

  var implodeIcons = function() {
    for (var i = icons.length - 1; i >= 0; i--) {
      icons[i].classList.remove('explode');
      icons[i].classList.remove('colorshift');
      icons[i].classList.add('implode');            
    }
  }

  var explodeIcons = function() {
    for (var i = icons.length - 1; i >= 0; i--) {
      icons[i].classList.remove('implode');
      icons[i].classList.add('explode');
    }
  }

  var vendorPrefix = function(prop) {
    var testEl = document.createElement('div');
    if(testEl.style.transform == null) {
      var vendors = ['Webkit', 'Moz', 'ms'];
      for(var vendor in vendors) {
        if(testEl.style[ vendors[vendor] + prop ] !== undefined) {
          return vendors[vendor] + prop;
        }
      }
    }
    return prop.toLowerCase();
  }

    /**
     * Shuffles items in an array
     * @param {array} array - The array to shuffle.
     * @return {array} - The shuffled array.
     */
     var shuffle = function(array)
     {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

    /**
     * Calculates the coordinates of a point on a circle
     * @param {number} radius - The radius of the circle.
     * @param {number} theta - The rotation angle (radians).
     */
     var circleCoords = function(radius, theta) {
      return {
        x: radius * Math.cos(theta),
        y: radius * Math.sin(theta)
      }
    }

    /**
     * Positions nodes in circles around the center of the page
     * @param {object} nodes - The nodeList that needs to be laid out in circles.
     * @param {number} radius - The radius of the smallest circle.
     * @param {object} middlepoint - The middlepoint (x,y).
     * @param {number} nodesPerCircle - The amount of nodes per circle.
     * @param {number} nodesPerCircleRandom - The random factor for the number of nodes per circle.
     * @param {number} interCircleDistance - The distance between two circles.
     */
     var positionNodesCircles = function(nodes, radius, nodesPerCircle, nodesPerCircleRandom, interCircleDistance) {
      var node, nodesOnCircle, circleCoord, transform, random, theta = 0;

      while(nodes.length > 0) {
        nodesOnCircle = nodesPerCircle + Math.random() * nodesPerCircleRandom;
        if(nodesOnCircle > nodes.length) nodesOnCircle = nodes.length;

        for (var i =  nodesOnCircle; i >= 0; i--) {
          if(nodes.length == 0) return;

          node = [].pop.call(nodes);
          random = Math.random();
          circleCoord = circleCoords(radius, theta);
          transform = 'translate3d('  + Math.round(circleCoord.x - node.offsetWidth/2) + 'px,' + Math.round(circleCoord.y - node.offsetHeight/2) +'px,0) scale(' + Math.round((0.8 + (random * 0.2)) * 10) / 10 + ')';

          node.style[vendorPrefix('Transition')] = 'transform 1.5s ease-in-out';
          node.style[vendorPrefix('Transform')] = transform;

          theta += (6.283 / (nodesOnCircle + 1)) + ((random * 0.2) - 0.1);
        }

        radius += interCircleDistance;
        theta = random * 6.283;
      }
    };
  })();