import * as MATTER from "matter-js"

const Engine = MATTER.Engine,
    Render = MATTER.Render,
    Runner = MATTER.Runner,
    Composite = MATTER.Composite,
    Composites = MATTER.Composites,
    Common = MATTER.Common,
    MouseConstraint = MATTER.MouseConstraint,
    Mouse = MATTER.Mouse,
    World = MATTER.World,
    Bodies = MATTER.Bodies

const engine = Engine.create(),
    world = engine.world;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 1500,
        height: 850,
        showAngleIndicator: true,
    }
});
Render.run(render);

const runner = Runner.create()
Runner.run(runner, engine);
//-- First Example --
// // Create circles
// const stack = Composites.stack(20, 20, 20, 5, 0, 0, function(x, y) {
//     return Bodies.circle(x, y, Common.random(10, 20), {
//         friction: 0.00001,
//         restitution: 0.5,
//         density: 0.001
//     });
// });
// World.add(world, stack);
//
// // Create rectangles
// World.add(world, [
//     Bodies.rectangle(250, 150, 700, 5, {isStatic: true, angle: Math.PI * 0.06, render: { visible: true }}),
//     Bodies.rectangle(500, 380, 700, 10, {isStatic: true, angle: -Math.PI * 0.03, render: { visible: true }}),
//     Bodies.rectangle(340, 580, 700, 10, {isStatic: true, angle: Math.PI * 0.05, render: { visible: true }}),
// ])

//-- Second Example --
World.add(world, [
    Bodies.rectangle(400, 600, 1200, 10.5, { isStatic: true})
]);

const stack = Composites.stack(100, 0, 10, 8, 10, 10, function(x, y) {
    return Bodies.circle(x, y, Common.random(15, 30), { restitution: 0.6, friction: 0.1 });
});

World.add(world, [
    stack,
    Bodies.polygon(200, 460, 3, 60),
    Bodies.polygon(400, 460, 5, 60),
    Bodies.rectangle(600, 460, 80, 80)
]);


// Mouse interaction
const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);
// keep the mouse in sync with rendering
render.mouse = mouse;

Render.lookAt(render, Composite.allBodies(world));