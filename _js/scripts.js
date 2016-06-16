var mdl = require('material-design-lite');

(function() {
    'use strict';

    var resizeTimer;
    var bodyWidth, bodyHeight;
    var exploded;

    window.addEventListener('load',function() {
        bodyWidth = document.body.offsetWidth;
        bodyHeight = document.body.offsetHeight;
        exploded = true;

        document.getElementById('content').className += ' fadein';

        document.getElementById('implodeexplode').addEventListener('click', function() {
            if(exploded) {
                this.innerHTML = 'Explode';
                implodeIcons();
            } else {
                this.innerHTML = 'Implode';
                explodeIcons();
            } 

            exploded = !exploded;
        });
        

        var ghosts = [].slice.call(document.querySelectorAll('.mdi-ghost'));
        ghosts.forEach(function (ghost) {
            ghost.addEventListener('click', function(e) {
                this.className += ' colorshift';
                this.style.opacity = 1;
                this.style.cursor = 'default';
                e.target.removeEventListener(e.type, null);
            });
        });

        positionIcons();
    });

    window.addEventListener('resize',function() {
        // Only trigger this when done resizing
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            bodyWidth = document.body.offsetWidth;
            bodyHeight = document.body.offsetHeight;
            positionIcons();
        }, 250);
    });

    var positionIcons = function() {
        var icons = shuffle([].slice.call(document.querySelectorAll('.icon-canvas .mdi')));
        var radius = (document.getElementsByClassName('content')[0].offsetWidth / 2) +  50 + Math.max(bodyWidth,bodyHeight) / 10;
        positionNodesCircles(icons, radius, 8, 3, 100 + Math.max(bodyWidth,bodyHeight) / 20);
    }

    var implodeIcons = function() {
        var icons = document.querySelectorAll('.icon-canvas .mdi');
        for (var i = icons.length - 1; i >= 0; i--) {
            icons[i].style.opacity = 1;
            icons[i].className = icons[i].className.replace(/\b fadein\b/,'');
            icons[i].className = icons[i].className.replace(/\b implode\b/,'');
            icons[i].className = icons[i].className.replace(/\b explode\b/,'');
            var clone = icons[i].cloneNode(true);
            icons[i].parentNode.replaceChild(clone, icons[i]);
            clone.className += ' implode';
        }
    }

    var explodeIcons = function() {
        var icons = document.querySelectorAll('.icon-canvas .mdi');
        for (var i = icons.length - 1; i >= 0; i--) {
            icons[i].style.opacity = 0;
            icons[i].className = icons[i].className.replace(/\b fadein\b/,'');
            icons[i].className = icons[i].className.replace(/\b implode\b/,'');
            icons[i].className = icons[i].className.replace(/\b explode\b/,'');
            var clone = icons[i].cloneNode(true);
            icons[i].parentNode.replaceChild(clone, icons[i]);
            clone.className += ' explode';
        }
    }

    /**
     * Applies property to node with vendor prefixes
     * @param {object} node - The node to apply the property to.
     * @param {string} property - The property that needs to be applied.
     * @param {string} value - The value of the property.
     */
    var setVendor = function(node, property, value) {
      node.style["webkit" + property] = value;
      node.style["moz" + property] = value;
      node.style["ms" + property] = value;
      node.style["o" + property] = value;
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
     * @param {number} nodesPerCircle - The amount of node per circle.
     * @param {number} nodesPerCircleRandom - The random factor for the number of nodes per circle.
     * @param {number} interCircleDistance - The distance between two circles.
     */
    var positionNodesCircles = function(nodes, radius, nodesPerCircle, nodesPerCircleRandom, interCircleDistance) {
        var node, nodesOnCircle, circleCoord, random, theta = 0;

        while(nodes.length > 0) {
            nodesOnCircle = nodesPerCircle + Math.random() * nodesPerCircleRandom;
            if(nodesOnCircle > nodes.length) nodesOnCircle = nodes.length;

            for (var i =  nodesOnCircle; i >= 0; i--) {
                random = Math.random();
                node = [].pop.call(nodes);
                circleCoord = circleCoords(radius, theta);

                setVendor(node, 'Transform','translate3d('  + (circleCoord.x - node.offsetWidth/2) + 'px,' + (circleCoord.y - node.offsetHeight/2) +'px,0) scale(' + (1 + (random * 1.2)) + ')');
                if(node.className.indexOf('fadein') == -1) node.className += ' fadein';
                theta += (6.283 / (nodesOnCircle + 1)) + ((random * 0.2) - 0.1);
                if(nodes.length == 0) return;
            }

            radius += interCircleDistance;
            theta = random * 6.283;
        }
    };
})();