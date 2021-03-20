import Cursor from "./js/cursor"
import GLManager from "./js/GLManager"
import Grab from "./js/Grab";
import { spring, parallel } from "popmotion";

class App {
    constructor() {
        this.container = document.getElementById("app");
        this.cursor = new Cursor(document.querySelector('.cursor'));
        this.glManager = new GLManager();
        this.grab = new Grab({
            onGrabStart: this.onGrabStart.bind(this),
            onGrabMove: this.onGrabMove.bind(this),
            onGrabEnd: this.onGrabEnd.bind(this),
        });
        this.glManager.mount(this.container);
        this.glManager.render();

        this.progress = 0;
        this.direction = 1;
        this.waveIntensity = 0;
    };
    init() {
        window.addEventListener("resize", this.onResize);
        window.addEventListener("mouseMove", this.onMouseMove);
    };
    onResize = () => {
        this.glManager.onResize();
    };
    onMouseMove() {};
    onGrabStart = () => {
        if (this.GLStickPop) {
            this.GLStickPop.stop();
        }
        const directionSpring = spring({
            from: this.progress === 0 ? 0 : this.direction,
            to: 0,
            mass: 1,
            stiffness: 800,
            damping: 2000,
        });
        const progressSpring = spring({
            from: this.progress,
            to: 1,
            mass: 5,
            stiffness: 350,
            damping: 500,
        });
        const waveIntensitySpring = spring({
            from: this.waveIntensity,
            to: 0.5,
            mass: 5,
            stiffness: 10,
            damping: 200
        });
        this.glManager.scheduleLoop();
        this.GLStickPop = parallel(progressSpring, directionSpring, waveIntensitySpring).start({
            update: (values)=> {
                this.progress = values[0];
                this.direction = values[1];
                this.waveIntensity = values[2];

                this.glManager.updateStickEffect({
                    progress: this.progress,
                    direction: this.direction,
                    waveIntensity: this.waveIntensity
                });
            }
        })
    };
    onGrabMove = () => {};
    onGrabEnd = () => {
        if (this.GLStickPop) {
            this.GLStickPop.stop();
        }
        const directionSpring = spring({
            from: this.progress === 1 ? 1 : this.direction,
            to: 1,
            mass: 1,
            stiffness: 800,
            damping: 2000
        });
        const progressSpring = spring({
            from: this.progress,
            to: 0,
            mass: 4,
            stiffness: 400,
            damping: 70,
            restDelta: 0.0001
        });
        const waveIntensitySpring = spring({
            from: this.waveIntensity,
            to: 0,
            mass: 0.1,
            stiffness: 800,
            damping: 50
        });

        this.GLStickPop = parallel(progressSpring, directionSpring, waveIntensitySpring).start({
            update: values => {
                this.progress = values[0];
                this.direction = values[1];
                this.waveIntensity = values[2];
                this.glManager.updateStickEffect({
                    progress: this.progress,
                    direction: this.direction,
                    waveIntensity: this.waveIntensity
                });
            },
            complete: () => {
                this.glManager.cancelLoop();
            }
        });
    };
}
const app = new App();
app.init();