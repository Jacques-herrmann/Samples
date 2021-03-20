import gsap from 'gsap';
import { instances } from '/js/store.js'

class Slider {
    constructor() {
        this.dom = {};
        this.dom.el = document.querySelector('.js-slider');
        this.dom.container = this.dom.el.querySelector('.js-container');
        this.dom.items = this.dom.el.querySelectorAll('.js-item');
        this.dom.images = this.dom.el.querySelectorAll('.js-img-wrap');
        this.dom.headings = this.dom.el.querySelectorAll('.js-heading');
        this.dom.progressWrap = this.dom.el.querySelector('.js-progress-wrap');
        this.dom.progress = this.dom.el.querySelector('.js-progress');
        this.dom.content = document.querySelector('.js-content');

        this.state = {
            open: false,
            scrollEnabled: false,
            progress: 0,
        };
    }
    init() {
        gsap.ticker.add(this.render);
        this.setCache();
        window.addEventListener('resize', this.handleResize);
    }
    handleResize = () => {
        this.setCache();
    };
    open = () => {
        const tl = gsap.timeline({ paused: true });
        tl
            .addLabel('start')

            .set(this.dom.items, { autoAlpha: 0 })
            .set(this.dom.el, { autoAlpha: 1 })

            .set(this.dom.headings, { y: -this.dom.headings[0].offsetHeight, rotation: -5 })

            .set(this.dom.progressWrap, { autoAlpha: 0 })
            .set(this.dom.items, { autoAlpha: 1 }, 'start+=1.5')
            .set(this.dom.images, { autoAlpha: 0 }, 'start+=0.5')
            .set(this.dom.images, { autoAlpha: 1 }, 'start+=1.67')
            .call(() => {
                // reset scroll position
                instances.scroll.state.current = 0;
                instances.scroll.state.last = 0;
                this.state.scrollEnabled = true;
            })
            .to(this.dom.headings, { duration: 1.60, stagger: 0.15, ease: 'in-out-smooth', y: 0, rotation: 0 }, 'start+=0.8')
            .to(this.dom.progressWrap, { duration: 0.6, ease: 'in-out-smooth', autoAlpha: 1 }, 'start+=0.73');

        tl.play();
    };
    render = () => {
        const scrollLast = Math.abs(instances.scroll.state.last);

        this.items.forEach((item) => {
            const {bounds} = item;
            const inView = scrollLast + window.innerWidth >= bounds.left && scrollLast < bounds.right;
            if (inView) {
                const min = bounds.left - window.innerWidth;
                const max = bounds.right;
                const percentage = ((scrollLast - min) * 100) / (max - min);

                const newMin = -(window.innerWidth / 12) * 3;
                const newMax = 0;
                item.x = ((percentage - 0) / (100 - 0)) * (newMax - newMin) + newMin;
                item.img.style.transform = `translate3d(${item.x}px, 0, 0) scale(1.75)`;
            }
        });

        if (this.state.scrollEnabled) {
            const min = 0;
            const max = -instances.scroll.state.bounds.width + window.innerWidth;
            this.state.progress = ((instances.scroll.state.last - min) * 100) / (max - min) / 100;
            this.dom.progress.style.transform = `scaleX(${this.state.progress})`;
        }
    };
    setCache() {
        this.items = [];
        [...this.dom.items].forEach((el) => {
            const bounds = el.getBoundingClientRect();

            this.items.push({
                img: el.querySelector('img'),
                bounds,
                x: 0,
            });
        });
    }
}

export default Slider