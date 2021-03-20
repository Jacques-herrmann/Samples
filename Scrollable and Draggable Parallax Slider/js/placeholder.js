import gsap from 'gsap';
import { instances } from '/js/store.js'

class Placeholder {
    constructor() {
        this.dom = {};
        this.dom.el = document.querySelector('.js-placeholder');
        this.dom.images = this.dom.el.querySelectorAll('.js-img-wrap');
        this.dom.buttonOpen = document.querySelector('.js-slider-open');
        this.dom.content = document.querySelector('.js-content');

        this.bounds = this.dom.el.getBoundingClientRect();
        this.state = {
            animating: false
        };
    }
    init() {
        this.dom.buttonOpen.addEventListener('click', this.handleClick);
        this.dom.buttonOpen.addEventListener('mouseenter', this.handleMouseenter);
        this.dom.buttonOpen.addEventListener('mouseleave', this.handleMouseleave);
        window.addEventListener('resize', this.handleResize);
        this.setHoverAnimation();

    }
    // Animation
    setHoverAnimation() {
        this.tl = gsap.timeline({ paused: true });

        this.tl
            .addLabel('start')
            .set(this.dom.el, { autoAlpha: 1 })
            .set(this.dom.images, { scale: 0.5, x: (window.innerWidth/12) * 1.2, rotation: 0 })

            .to(this.dom.images, { duration: 1, stagger: 0.07, ease: 'power3.inOut', x: 0, y: 0 })
            .to(this.dom.images[0], { duration: 1, ease: 'power3inOut', rotation: -4 }, 'start')
            .to(this.dom.images[1], { duration: 1, ease: 'power3.inOut', rotation: -2 }, 'start');
    }
    setExpandAnimation() {
        instances.scroll.enable();
        const x1 = this.bounds.left - instances.slider.items[0].bounds.left - 20;
        const x2 = this.bounds.left - instances.slider.items[1].bounds.left;
        const x3 = this.bounds.left - instances.slider.items[2].bounds.left + 10;

        const y1 = this.bounds.top - instances.slider.items[0].bounds.top + 10;
        const y2 = this.bounds.top - instances.slider.items[1].bounds.top + 30;
        const y3 = this.bounds.top - instances.slider.items[2].bounds.top - 30;

        const intersectX1 = instances.slider.items[0].x;
        const intersectX2 = instances.slider.items[1].x;
        const intersectX3 = instances.slider.items[2].x;

        const scale = instances.slider.items[0].bounds.width / this.bounds.width;

        this.tl = gsap.timeline({
            paused: true,
            onComplete: () => {
                this.state.animating = false;
                this.setHoverAnimation();
            }
        });

        this.tl
            .addLabel('start')
            .to(this.dom.content, { duration: 0.8, autoAlpha: 0 }, 'start')
            .to(this.dom.images[0], { duration: 1.67, ease: 'power3.inOut', x: -x1, y: -y1, scale, rotation: 0 }, 'start')
            .to(this.dom.images[1], { duration: 1.67, ease: 'power3.inOut', x: -x2, y: -y2, scale, rotation: 0 }, 'start')
            .to(this.dom.images[2], { duration: 1.67, ease: 'power3.inOut', x: -x3, y: -y3, scale, rotation: 0 }, 'start')
            .to(this.dom.images[0].querySelector('img'), { duration: 1.67, ease: 'power3.inOut', x: intersectX1 }, 'start')
            .to(this.dom.images[1].querySelector('img'), { duration: 1.67, ease: 'power3.inOut', x: intersectX2 }, 'start')
            .to(this.dom.images[2].querySelector('img'), { duration: 1.67, ease: 'power3.inOut', x: intersectX3 }, 'start',)
            .set(this.dom.el, { autoAlpha: 0 }, 'start+=1.67');
        this.tl.play();
        instances.slider.open();

    }
    // Events
    handleMouseenter = () => {
        if (this.state.animating) return;
        this.tl.play();
    };
    handleMouseleave = () => {
        if (this.state.animating) return;
        this.tl.reverse();
    };
    handleResize = () => {
        this.bounds = this.dom.el.getBoundingClientRect();

        this.setHoverAnimation();
    };
    handleClick = () => {
        if (this.state.animating) return;
        this.state.animating = true;
        this.setExpandAnimation();
    }
}

export default Placeholder