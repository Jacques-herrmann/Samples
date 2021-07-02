import * as MO from '@mojs/core';

const CIRCLE_OPTS = {
    left: 120,
    top: 120,
    fill: 'white',
    scale: { .2: 1 },
    opacity: { 1: 0 },
    isForce3d: true,
    isShowEnd: false
};
const circle = new MO.Shape({
    isShowStart: true,
    radius: 100,
    fill: {'#FC2D79': '#fff'},
    scale: {1:0},
    opacity: {1:0},
    left: '50%',
    duration: 1500,
    delay: 300,
    easing: 'cubic.out',
    isShowEnd: false,
});

const burst = new MO.Burst({
    left: 0,
    top: 0,
    radius: {50:250},
    children: {
        fill: "white",
        shape: "polygon",
        stroke: {"white":"#A50710"},
        strokeWidth: 4,
        radius: "rand(30, 60)",
        radiusY: 0,
        scale: {1:0},
        pathScale: "rand(.5, 1)",
        degree: 360,
        isForce3d: true
    }
});
const burst2 = new MO.Burst({
    left: 0,
    top: 0,
    count: 4,
    radius: {0:250},
    children: {
        shape: ["circle", "rect"],
        points: 5,
        fill: ["white"],
        radius: "rand(30, 60)",
        delay: "stagger(50)",
        easing: ['cubic.out', 'cubic.out', 'cubic.out'],
        scale: {1:0},
        pathScale: "rand(.5, 1)",
        isForce3d: true
    }
});

const c1 = new MO.Shape({
    ...CIRCLE_OPTS,
    radius: 200
});
const c2 = new MO.Shape({
    ...CIRCLE_OPTS,
    radius: 240,
    easing: "cubic.out",
    delay: 300
});

const openBackground = new MO.Shape({
    fill: "#FC2D79",
    left: 0, top: 0,
    scale: { 0: 4.5 },
    isShowStart: true,
    radius: 15,
    isForce3d: true,
    isTimelineLess: true,
    delay: 150,
    easing: "cubic.out",
    backwardEasing: "expo.in"
});

document.addEventListener('click', function (ev) {
    circle.replay();
    burst.tune({ x: ev.pageX, y: ev.pageY }).generate().replay();
    burst2.tune({ x: ev.pageX, y: ev.pageY }).generate().replay();
    c1.replay();
    c2.replay();
    openBackground.tune({ x: ev.pageX, y: ev.pageY }).replay();
});