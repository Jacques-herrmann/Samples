import { lerp } from "../utils/math";

const getMousePos = (e) => {
    let xpos = 0;
    let ypos = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
        xpos = e.pageX;
        ypos = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        xpos = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        ypos = e.clientY + document.body.scrollWidth + document.documentElement.scrollTop;
    }
    return { x: xpos, y: ypos}
};

class Cursor {
    constructor(el) {
        this.dom = {};
        this.dom.el = el;
        this.dom.dot = this.dom.el.querySelector('.cursor__inner--dot');
        this.dom.circle = this.dom.el.querySelector('.cursor__inner--circle');
        this.bounds = {
            dot: this.dom.dot.getBoundingClientRect(),
            circle: this.dom.circle.getBoundingClientRect(),
        };
        this.state = {
            scale: 1,
            lastScale: 1,
            opacity: 1,
            mousePos: { x: 0, y: 0 },
            lastMousePos: {
                dot:    {x: 0, y: 0},
                circle: {x: 0, y: 0},
            },
        };
        this.init();
        requestAnimationFrame(() => { this.render() })
    }
    init() {
        window.addEventListener('mousemove', ev => this.state.mousePos = getMousePos(ev))
    }
    render() {
        this.state.lastMousePos.dot.x = lerp(this.state.lastMousePos.dot.x, this.state.mousePos.x - this.bounds.dot.width/2, 1);
        this.state.lastMousePos.dot.y = lerp(this.state.lastMousePos.dot.y, this.state.mousePos.y - this.bounds.dot.height/2, 1);
        this.state.lastMousePos.circle.x = lerp(this.state.lastMousePos.circle.x, this.state.mousePos.x - this.bounds.circle.width/2, 0.15);
        this.state.lastMousePos.circle.y = lerp(this.state.lastMousePos.circle.y, this.state.mousePos.y - this.bounds.circle.height/2, 0.15);

        this.state.lastScale = lerp(this.state.lastScale, this.state.scale, 0.15);
        this.dom.dot.style.transform = `translateX(${(this.state.lastMousePos.dot.x)}px) translateY(${this.state.lastMousePos.dot.y}px)`;
        this.dom.circle.style.transform =  `translateX(${(this.state.lastMousePos.circle.x)}px) translateY(${this.state.lastMousePos.circle.y}px) scale(${this.state.lastScale})`;
        requestAnimationFrame(() => this.render());
    }
    enter() {
        this.scale = 1.5;
        this.DOM.dot.style.display = 'none';
    }
    leave() {
        this.scale = 1;
        this.DOM.dot.style.display = '';
    }
}

export default Cursor;