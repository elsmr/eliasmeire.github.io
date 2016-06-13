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
            ghost.addEventListener('click', function() {
                if(this.className.indexOf('colorshift') > -1) {
                    this.className = this.className.replace(/\b colorshift\b/,'');
                    this.className += ' fadein';                
                } else {
                    this.className = this.className.replace(/\b fadein\b/,'');
                    this.className += ' colorshift';
                }
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
        var radius = (document.getElementsByClassName('content')[0].offsetWidth / 2) + 100;
        var middlepoint = {
            x: bodyWidth / 2 - 20,
            y: bodyHeight / 2 - 20
        };
        positionNodesCircles(icons, radius, middlepoint, 8, 3, Math.max(bodyWidth,bodyHeight) / 10);
    }

    var implodeIcons = function() {
        var icons = document.querySelectorAll('.icon-canvas .mdi');
        for (var i = icons.length - 1; i >= 0; i--) {
            icons[i].style.opacity = 1;
            icons[i].className = icons[i].className.replace(/\b fadein\b/,'');
            icons[i].className = icons[i].className.replace(/\b implode\b/,'');
            icons[i].className = icons[i].className.replace(/\b explode\b/,'');
            var newone = icons[i].cloneNode(true);
            icons[i].parentNode.replaceChild(newone, icons[i]);
            newone.className += ' implode';
        }
    }

    var explodeIcons = function() {
        var icons = document.querySelectorAll('.icon-canvas .mdi');
        for (var i = icons.length - 1; i >= 0; i--) {
            icons[i].style.opacity = 0;
            icons[i].className = icons[i].className.replace(/\b fadein\b/,'');
            icons[i].className = icons[i].className.replace(/\b implode\b/,'');
            icons[i].className = icons[i].className.replace(/\b explode\b/,'');
            var newone = icons[i].cloneNode(true);
            icons[i].parentNode.replaceChild(newone, icons[i]);
            newone.className += ' explode';
        }
    }

    /**
     * Shuffles items in an array
     * @param {array} array - The array to shuffle.
     * @return {array} array - The shuffled array.
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
     * Shuffles items in an array
     * @param {number} radius - The radius of the circle.
     * @param {object} middlepoint - The middlepoint of the circle (x,y).
     * @param {number} theta - rotation angle (radians)
     */
    var circleCoords = function(radius, middlepoint, theta) {
        return {
            x: middlepoint.x + radius * Math.cos(theta),
            y: middlepoint.y + radius * Math.sin(theta)
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
    var positionNodesCircles = function(nodes, radius, middlepoint, nodesPerCircle, nodesPerCircleRandom, interCircleDistance) {
        var node, nodesOnCircle, circleCoord, deg, random, theta = 0;

        while(nodes.length > 0) {
            nodesOnCircle = nodesPerCircle + Math.random() * nodesPerCircleRandom;
            if(nodesOnCircle > nodes.length) nodesOnCircle = nodes.length;

            for (var i =  nodesOnCircle; i >= 0; i--) {
                random = Math.random();
                node = [].pop.call(nodes);
                circleCoord = circleCoords(radius, middlepoint, theta);
                deg = random * 180;

                node.className = node.className.replace(/\b fadein\b/,'');
                node.className = node.className.replace(/\b fadeout\b/,'');
                node.style.left = circleCoord.x + 'px';
                node.style.top = circleCoord.y + 'px';
                node.style.fontSize = 1 + random * 3.2 + 'em';
                node.className += ' fadein';
                theta += (6.283 / (nodesOnCircle + 1)) + random * 0.1;
                if(nodes.length == 0) return;
            }

            radius += interCircleDistance + Math.max(bodyWidth, bodyHeight) / 100;
            theta = random * 6.283;
        }
    };
})();