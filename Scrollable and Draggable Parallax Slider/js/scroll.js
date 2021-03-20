import VirtualScroll from "virtual-scroll/src";
import gsap from "gsap";
import { lerp, clamp } from "./utils";


export default class Scroll {
    constructor() {
        this.vs = new VirtualScroll();
        this.vs.options.mouseMultiplier = 0.45;
        this.dom = {
            container: document.querySelector('[data-scroll]')
        };
        this.options = {
            ease: 0.1,
            dragSpeed: 1.5,
        };
        this.state = {
            bounds: {},
            current: 0,
            last: 0,
            dragStart: 0,
            dragEnd: 0,
            dragging: false,
        };
    }
    init() {
        this.handleResize();
        this.vs.on(this.calc);
        gsap.ticker.add(this.smooth);
        this.addListeners();
        // this.disable()
    }
    destroy() {
        this.disable();
        this.vs.destroy();
        this.removeListeners();
    }
    addListeners() {
        this.dom.container.addEventListener('mouseup', this.handleMouseup);
        this.dom.container.addEventListener('mousedown', this.handleMousedown);
        this.dom.container.addEventListener('mouseleave', this.handleMouseleave);
        this.dom.container.addEventListener('mousemove', this.handleMousemove);
    }
    removeListeners() {
        this.dom.container.removeEventListener('mouseup', this.handleMouseup);
        this.dom.container.removeEventListener('mousedown', this.handleMousedown);
        this.dom.container.removeEventListener('mouseleave', this.handleMouseleave);
        this.dom.container.removeEventListener('mousemove', this.handleMousemove);
    }
    handleResize = () => {
        this.state.bounds = this.dom.container.getBoundingClientRect();
    };
    handleMouseup = () => {
        this.state.dragging = false;
        this.state.dragEnd = this.state.current;
        document.body.classList.remove('is-dragging');
    };
    handleMousedown = (e) => {
        this.state.dragging = true;
        this.state.dragEnd = this.state.current;
        this.state.dragStart = e.clientX;
        document.body.classList.add('is-dragging');
    };
    handleMouseleave = () => {
        this.state.dragging = false;
        this.state.dragEnd = this.state.current;
        document.body.classList.remove('is-dragging');
    };
    handleMousemove = (e) => {
        if (!this.state.dragging) return;
        this.state.current = this.state.dragEnd + ((e.clientX - this.state.dragStart) * this.options.dragSpeed);
        this.state.current = clamp(this.state.current, 0, -this.state.bounds.width + window.innerWidth);
    };
    smooth = () => {
        this.state.last = lerp(this.state.last, this.state.current, this.options.ease);
        this.dom.container.style.transform = `translate3d(${this.state.last}px, 0, 0)`;
    };
    calc = (e) => {
        this.state.current += e.deltaY;
        this.state.current = Math.max((this.state.bounds.width - window.innerWidth) * -1, this.state.current);
        this.state.current = Math.min(0, this.state.current);
    };
    enable() {
        this.vs.on(this.calc);
        gsap.ticker.add(this.smooth);
    }
    disable() {
        this.vs.off(this.calc);
        gsap.ticker.remove(this.smooth);
    }
}