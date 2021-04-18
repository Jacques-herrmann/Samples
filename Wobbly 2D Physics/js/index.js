import Matter from 'matter-js'
import Paper from 'paper'
import bg from '../images/hackerman.jpg'

const SVG_PATH = "M468.5,287Q479,324,447,347Q415,370,378.5,373Q342,376,323.5,397.5Q305,419,277.5,443Q250,467,217.5,458.5Q185,450,166,421Q147,392,114,382.5Q81,373,66,344Q51,315,27.5,282.5Q4,250,15.5,213.5Q27,177,40.5,142Q54,107,105,114Q156,121,167,74.5Q178,28,214,27.5Q250,27,280.5,44.5Q311,62,326.5,93Q342,124,359,141Q376,158,426,167Q476,176,467,213Q458,250,468.5,287Z";
let Engine = Matter.Engine;
let Render = Matter.Render;
let Runner = Matter.Runner;
let World = Matter.World;
let Body = Matter.Body;
let Constraint = Matter.Constraint;
let Bodies = Matter.Bodies;

class app {
    constructor() {
        this.time = 0;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = {
            x: 300,
            y: 300
        };
        this.physics();
        this.initPaper();
        this.createPaths();
        this.addObjects();
        this.mouseEvents();
        this.renderLoop();
    }
    mouseEvents() {
        this.render.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX - this.cursor.positionPrev.x;
            this.mouse.y = e.clientY - this.cursor.positionPrev.y;
        })
    }
    physics() {
        this.engine = Engine.create();
        this.world = this.engine.world;

        this.engine.world.gravity.x = 0;
        this.engine.world.gravity.y = 0;

        this.render = Render.create({
            element: document.getElementById('container'),
            engine: this.engine,
            options: {
                width: this.width,
                height: this.height,
                showVelocity: true
            }
        });
        Render.run(this.render);
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);
    }
    initPaper() {
        this.paperCanvas = document.getElementById('paper');
        this.paper = new Paper.Project(this.paperCanvas);
    }
    createPaths() {
        this.shadow = new Paper.Path (SVG_PATH);
        this.svg = new Paper.Path (SVG_PATH);
        this.shadow.shadowBlur = 30;
        this.shadow.shadowColor = "#444444";
        this.number = this.svg.segments.length;

        this.group = new Paper.Group([this.svg]);
        this.group.clipped = true;

        let image = new Image();
        image.onload = () => {
            let rasterImg = new Paper.Raster(image);
            rasterImg.fitBounds(Paper.view.bounds, true);
            this.group.addChild(rasterImg)
        };
        image.src = bg;
    }
    addObjects() {
        this.cursor = Bodies.circle(300, 300, 50, {
            isStatic: false
        });
        this.center = Bodies.circle(this.width / 2, 350, 50, {
            isStatic: true
        });
        this.circles = [];
        this.anchors = [];
        this.links = [];

        for(let i = 0; i < this.number; i++) {
            this.circles.push(
                Bodies.circle(
                    (this.width / 2) - 250 + this.svg.segments[i].point.x,
                    100 + this.svg.segments[i].point.y,
                    10, {
                        density: 0.005,
                        restitution: 0
                    }
                )
            );
            this.anchors.push(
                Bodies.circle(
                    (this.width / 2) - 250 + this.svg.segments[i].point.x,
                    100 + this.svg.segments[i].point.y,
                    10, {
                        density: 0.005,
                        restitution: 0
                    }
                )
            )
        }
        for(let i = 0; i < this.number; i++) {
            this.links.push(
                Constraint.create({
                    bodyA: this.circles[i],
                    bodyB: this.anchors[i],
                    stiffness: 0.01
                })
            );
            let next = this.circles[(i + 1)% this.number];
            this.links.push(
                Constraint.create({
                    bodyA: this.circles[i],
                    bodyB: next,
                    stiffness: 1
                })
            );
            let nextnext = this.circles[(i + 2)% this.number];
            this.links.push(
                Constraint.create({
                    bodyA: this.circles[i],
                    bodyB: nextnext,
                    stiffness: 0.04
                })
            );
        }
        World.add(this.engine.world, this.circles);
        World.add(this.engine.world, this.links);
        World.add(this.engine.world, this.center);
        World.add(this.engine.world, this.cursor);
    }
    renderLoop() {
        this.time += 0.05;
        this.svg.smooth();
        for (let i = 0; i < this.number; i++) {
            this.svg.segments[i].point.x = this.circles[i].position.x;
            this.svg.segments[i].point.y = this.circles[i].position.y;
            this.shadow.segments[i].point.x = this.circles[i].position.x;
            this.shadow.segments[i].point.y = this.circles[i].position.y;
        }
        Body.translate(this.cursor, {
            x: this.mouse.x,
            y: this.mouse.y
        });
        window.requestAnimationFrame(this.renderLoop.bind(this))
    }
}

new app();