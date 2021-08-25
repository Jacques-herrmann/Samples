const element = document.getElementById('two');
const svg = document.getElementById("your-svg");
const mask = document.getElementById('your-path')
const params = { 
    width: 258, 
    height: 200,
    fullscreen: true,
    autostart: true
};

const two = new Two(params).appendTo(element);

let x, y, line
const mouse = new Two.Vector()
const randomness = 0;

const drag = function(e) {
    x = e.clientX;
    y = e.clientY;
    if (!line) {
        const v1 = makePoint(mouse);
        const v2 = makePoint(x, y);
        line = two.makeCurve([v1, v2], true);
        line.noFill().stroke = '#333';
        line.linewidth = 10;
        line.vertices.forEach(function(v) {
            v.addSelf(line.translation);
        });
        line.translation.clear();
    } else {
        const v1 = makePoint(x, y);
        line.vertices.push(v1);
    }
    mouse.set(x, y);
};
const dragEnd = function(e) {
    differenceFromMask()
    window.removeEventListener('mousemove', drag)
    window.removeEventListener('mouseup', dragEnd)
};

const touchDrag = function(e) {
    e.preventDefault();
    const touch = e.originalEvent.changedTouches[0];
    drag({
        clientX: touch.pageX,
        clientY: touch.pageY
    });
    return false;
};
const touchEnd = function(e) {
    e.preventDefault();
    differenceFromMask()
    window.removeEventListener('touchmove', touchDrag)
    window.removeEventListener('touchup', touchEnd)
    return false;
};

window.addEventListener('mousedown', function(e) {
    mouse.set(e.clientX, e.clientY);
    line = null;
    window.addEventListener('mousemove', drag)
    window.addEventListener('mouseup', dragEnd)
})
window.addEventListener('touchstart', function(e) {
    e.preventDefault();
    var touch = e.originalEvent.changedTouches[0];
    mouse.set(touch.pageX, touch.pageY);
    line = null;
    window.addEventListener('touchmove', drag)
    window.addEventListener('touchend', dragEnd)
    return false;
})

two.bind('update', function(frameCount, timeDelta) {
    two.scene.children.forEach(function(child) {
        child.vertices.forEach(function(v) {
        if (!v.position) {
            return;
        }
        v.x = v.position.x + (Math.random() * randomness - randomness / 2);
        v.y = v.position.y + (Math.random() * randomness - randomness / 2);
        });
    });
});

function makePoint(x, y) {
    if (arguments.length <= 1) {
        y = x.y;
        x = x.x;
    }

    const v = new Two.Vector(x, y);
    v.position = new Two.Vector().copy(v);

    return v;
}


function differenceFromMask() {
    let isInside = true
    for (let i = 0; i < line.vertices.length; i++) {
        let point = svg.createSVGPoint();
        point.x = line.vertices[i].x;
        point.y = line.vertices[i].y;
        if (! mask.isPointInFill(point)) {
            isInside = false
        }
    }
    if (isInside) {
        console.log("Dessin OK")
    } else {
        console.log("Dessin KO")
    }

}
