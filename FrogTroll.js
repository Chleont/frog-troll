import React, { useEffect } from "react";
import './FrogTroll.css';
import trollBody from './fb.png';
import trollJumping from './fj.png';
import trollMouthClosed from './fmc.png';
import trollMouthOpen from './fmo.png';

export default function FrogTroll({ options }) {

    var propOption = {
        units: options.units ? options.units : 'em',
        fontSize: options.fontSize ? options.fontSize : null,
        size: options.size ? options.size : 5,
        startingPosition: {
            x: options.startingPosition && options.startingPosition.x ? options.startingPosition.x : 0,
            y: options.startingPosition && options.startingPosition.y ? options.startingPosition.y : 0
        },
        timeToOpenMouth: options.timeToOpenMouth ? options.timeToOpenMouth : 2000,
        timeToAttack: options.timeToAttack ? options.timeToAttack : 1000,
        navbarHeight: options.navbarHeight ? options.navbarHeight : 0
    };

    var canvas = null,
        width = Math.max(window.screen.width, window.innerWidth),
        height = Math.max(window.screen.height, window.innerHeight),
        units = propOption.units,
        x = null,
        y = null,
        ctx = null,
        pointer = null,
        mouseX = null,
        mouseY = null,
        pointerBox = null,
        centerPoint = null,
        centers = null,
        centerX = null,
        centerY = null,
        radians = null,
        degrees = null,
        interval = null,
        hitInterval = null,
        mouthCenter = [],
        offsety = null,
        offsetx = null,
        fontSize = null,
        navbarHeight = propOption.navbarHeight;

    if (propOption.fontSize == null) {
        if (width < 1024) {
            fontSize = 16;
        } else if (width >= 1024 && width < 1280) {
            fontSize = 19;
        } else if (width >= 1280) {
            fontSize = 20;
        }
    } else {
        fontSize = propOption.fontSize;
    }

    var trollSize = units === 'em' ? propOption.size * fontSize : propOption.size,
        frogx = units === 'em' ? propOption.startingPosition.x * fontSize : propOption.startingPosition.x,
        frogy = units === 'em' ? propOption.startingPosition.y * fontSize : propOption.startingPosition.y;

    if (Math.abs(frogx) > (width - trollSize) / 2) {
        frogx = Math.sign(frogx) * (width - trollSize) / 2;
    }

    if (Math.abs(frogy) > (height - trollSize) / 2 - navbarHeight) {
        frogy = Math.sign(frogy) * (height - 1.28 * trollSize - 2 * navbarHeight) / 2;
    }

    function start() {
        clearInterval(interval);
        interval = setInterval(function () {
            document.getElementById('frog-troll-head').src = trollMouthOpen;
            clearInterval(hitInterval);
            hitInterval = setInterval(function () {
                killPointer();
            }, propOption.timeToAttack);
        }, propOption.timeToOpenMouth);
    }

    function killPointer() {
        canvas = document.getElementById('canvas');
        canvas.width = document.getElementById('frog-troll-container').clientWidth;
        canvas.height = document.getElementById('frog-troll-container').clientHeight;
        ctx = canvas.getContext("2d");

        // Calculate center of frog's mouth coordinates
        x = document.getElementById('frog-troll-head').getBoundingClientRect().x;
        y = document.getElementById('frog-troll-head').getBoundingClientRect().y;

        // Add offset depending on frog's position and on frog's head rotation
        // cos changes offset when head is close to vertical direction and sin when it's close to horizontal
        // Combination is needed because tongue is not in the center of the frog's mouth
        // If frog-troll-container is rendered under the navbar uncomment navbarHeight
        offsety = document.getElementById('frog-troll-head').getBoundingClientRect().height * (0.5 + 0.1 * Math.cos(radians)) - navbarHeight
        offsetx = document.getElementById('frog-troll-head').getBoundingClientRect().width / 2 * (1.1 + 0.3 * Math.sin(radians));

        // Draw tongue
        ctx.beginPath();
        ctx.moveTo(x + offsetx, y + offsety);
        ctx.lineWidth = propOption.size + 2;
        ctx.strokeStyle = "#ff7887";
        ctx.lineTo(mouseX, mouseY- navbarHeight);
        ctx.stroke();
        setTimeout(function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 100);

        // Tongue's hit aftermath
        document.body.style.cursor = 'none';
        document.body.removeEventListener('mousemove', listener);
        document.body.removeEventListener('mouseleave', stopHunting);
        setTimeout(function () {
            document.getElementById('frog-troll-head').src = trollMouthClosed;
        }, 300);
        clearInterval(interval);
        clearInterval(hitInterval);
        setTimeout(function () {
            rotateBack();
        }, 300);
    }

    function generatePosition() {
        let randX = Math.random() * (width - trollSize) - (width - trollSize) / 2;
        let randY = Math.random() * (height - trollSize - 2 * navbarHeight) - (height - trollSize - 2 * navbarHeight) / 2;
        let transitionTime = Math.round(Math.max(Math.abs(frogx - randX), Math.abs(frogy - randY)) / 100) / 10 + 0.1;

        if (randX === frogx) {
            randX = randX + 10;
        }
        if (randY === frogy) {
            randY = randY + 10;
        }
        return {
            x: randX,
            y: randY,
            t: transitionTime
        };
    }

    function jump() {
        rotateBack(0.1);
        let newPositionData = generatePosition();

        setTimeout(function () {
            clearInterval(interval);
            clearInterval(hitInterval);
        }, propOption.timeToAttack * 0.8);

        document.getElementById('frog-troll-body').src = trollJumping;
        document.getElementById('frog-troll-head').style.visibility = 'hidden';

        let dx = newPositionData.x - frogx,
            dy = newPositionData.y - frogy,
            halfDist = Math.sqrt((newPositionData.x - frogx) ** 2 + (newPositionData.y - frogy) ** 2) / 2,
            φ = -Math.atan(dy / dx),
            ω = Math.PI / 2 - φ,
            centery = null,
            r = null,
            centerx = null,
            instances = newPositionData.t * 20,
            xinterval = dx / instances,
            points = [],
            initialAngle = 0,
            finalAngle = 0,
            rotationFragment = 0,
            rotation = 1;

        //Calculate jumpin circular curve's center and radious
        if (newPositionData.y <= frogy && Math.abs(φ) < Math.PI / 4) {
            centerx = newPositionData.x;
            r = Math.abs(halfDist / Math.cos(ω));
            centery = newPositionData.y + r;
        } else if (newPositionData.y <= frogy && Math.abs(φ) >= Math.PI / 4) {
            centery = frogy;
            r = Math.abs(halfDist / Math.cos(φ));
            centerx = frogx + Math.sign(Math.sin(φ)) * r;
        } else if (newPositionData.y >= frogy && Math.abs(φ) < Math.PI / 4) {
            r = Math.abs(halfDist / Math.cos(ω));
            centerx = frogx;
            centery = frogy + r;
        } else if (newPositionData.y >= frogy && Math.abs(φ) >= Math.PI / 4) {
            r = Math.abs(halfDist / Math.cos(ω));
            centery = newPositionData.y;
            centerx = newPositionData.x + Math.sign(Math.sin(φ)) * r;
        }

        // Calculate initial frog body's rotation
        if (newPositionData.y >= frogy) {
            if (newPositionData.x >= frogx) {
                initialAngle = Math.PI / 2;
            } else {
                initialAngle = -Math.PI / 2;
            }
        } else {
            initialAngle = 0;
        }

        // Calculate final frog body's rotation
        if (newPositionData.x <= frogx) {
            rotation = -1;
            finalAngle = -Math.PI / 2 + φ;
        } else {
            rotation = 1;
            finalAngle = Math.PI / 2 - φ;
        }

        // Rotate to initial angle
        document.getElementById('frog-troll').style.transform = `translate(${frogx}px,${frogy}px) rotate(${initialAngle * 180 / Math.PI}deg)`;

        // Calculate the amount of rotation between each step and the direction (rotation == -1 -> counterclockwise)
        rotationFragment = Math.abs((finalAngle - initialAngle) / instances * 180 / Math.PI) * rotation;

        // Calculate all coordinates and rotations for each point between initial and final position
        for (let i = 0; i <= instances; i++) {
            points.push({

                // Calculate coordinates of points
                x: frogx + i * xinterval,
                y: -1 * (Math.sqrt(Math.pow(r, 2) - Math.pow(frogx + i * xinterval - centerx, 2)) - Math.abs(centery)),

                // Move frog to next point and recall function for next position
                func: function () {
                    if (!points[points.indexOf(this) + 1]) {
                        document.getElementById('frog-troll').style.transform = `translate(${this.x}px,${this.y}px) rotate(0deg)`;
                    } else {
                        document.getElementById('frog-troll').style.transform = `translate(${this.x}px,${this.y}px) rotate(${initialAngle * 180 / Math.PI + rotationFragment * i}deg)`;
                    }
                    if (points.indexOf(this) < points.length - 1) {
                        setTimeout(() => {
                            points[points.indexOf(this) + 1].func();
                        }, 15);
                    } else {
                        document.body.addEventListener('mousemove', listener);
                        setTimeout(() => {
                            document.getElementById('frog-troll-body').src = trollBody;
                            document.getElementById('frog-troll-head').style.visibility = 'visible';
                        }, newPositionData.t * 100);
                    }
                }
            });
        }

        // Call jump
        points[0].func();

        // Set new position
        frogx = newPositionData.x;
        frogy = newPositionData.y;
    }

    function rotatePointer(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        pointer = document.getElementById("frog-troll-head");
        pointerBox = pointer.getBoundingClientRect();
        centerPoint = window.getComputedStyle(pointer).transformOrigin;
        centers = centerPoint.split(" ");
        centerY = pointerBox.top + parseInt(centers[1]) - window.pageYOffset;
        centerX = pointerBox.left + parseInt(centers[0]) - window.pageXOffset;
        if (Math.abs(mouseX - centerX) < 0.8 * trollSize && Math.abs(mouseY - centerY) < 0.8 * trollSize) {
            document.body.removeEventListener('mousemove', listener);
            jump();
        } else {
            radians = Math.atan2(mouseX - centerX, mouseY - centerY);
            degrees = radians * (180 / Math.PI) * -1;

            // Turn head
            pointer.style.transform = 'rotate(' + degrees + 'deg)';

            //Set position of mouth
            mouthCenter = [Math.sin(radians) * fontSize, (Math.cos(radians) - 2) * fontSize];
            document.getElementById('dot').style.transform = 'translate(' + mouthCenter[0] + 'px, ' + mouthCenter[1] + 'px)';
        }
    }

    function rotateBack(time) {
        var seconds = isNaN(time) ? 0.4 : time;

        pointer = document.getElementById("frog-troll-head");
        pointer.style.transitionDuration = `${seconds}s`;
        pointer.style.transform = 'rotate(' + 0 + 'deg)';
        setTimeout(function () {
            pointer.style.transitionDuration = '0s';
        }, 400);
    }

    function listener(e) {
        console.log(e)
        document.getElementById('frog-troll-head').src = trollMouthClosed;
        clearInterval(hitInterval);
        rotatePointer(e);
        start();
    }

    function stopHunting() {
        document.getElementById('frog-troll-head').src = trollMouthClosed;
        clearInterval(interval);
        clearInterval(hitInterval);
        rotateBack();
    }

    useEffect(() => {
        document.body.addEventListener('mousemove', listener);
        document.body.addEventListener('mouseleave', stopHunting);
    }, [listener]);

    useEffect(() => {
        document.documentElement.style.setProperty('--frog-width', `${trollSize}px`);
        document.getElementById('frog-troll').style.transform = `translate(${frogx}px,${frogy}px)`;
        return () => {
            clearInterval(interval);
            clearInterval(hitInterval);
        };
    }, []);

    return React.createElement(
        'div',
        { id: 'frog-troll-container' },
        React.createElement('canvas', { id: 'canvas' }),
        React.createElement('div', { id: 'dot' }),
        React.createElement(
            'div',
            { id: 'frog-troll' },
            React.createElement('img', { alt: 'head', id: 'frog-troll-head', src: trollMouthClosed }),
            React.createElement('img', { alt: 'body', id: 'frog-troll-body', src: trollBody })
        )
    );
}
