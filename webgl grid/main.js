import {Renderer, Camera, Transform, Plane, Raycast, Vec2} from "ogl";
import Media from "./Media";

import { lerp } from '/utils/math'
import media from "./Media";

const S = {
    ease: 0.05
}
let mode = 'grid';
let count = 0;
let currentIndex = null;
class App {
    constructor () {
        this.speed = 0;

        this.mouse = new Vec2()
        this.position = new Vec2()
        this.current = new Vec2()
        this.target = new Vec2()
        this.last = new Vec2()
        this.start = new Vec2()
        this.direction = new Vec2()

        this.mouseMoved = false;

        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.createGallery();

        this.onResize();

        this.createGeometry();
        this.createMedias();
        this.createRaycast();

        this.update();

        this.addEventListeners();
    }

    createRenderer() {
        this.renderer = new Renderer({
            alpha: true
        });
        this.gl = this.renderer.gl;

        document.body.appendChild(this.gl.canvas);
    }

    createGallery () {
        this.gallery = document.querySelector('.gallery')
    }

    createCamera() {
        this.camera = new Camera(this.gl);
        this.camera.fov = 45;
        this.camera.position.z = 5;
    }

    createScene() {
        this.scene = new Transform()
    }

    createGeometry() {
        this.planeGeometry = new Plane(this.gl, {
            heightSegments: 10
        })
    }

    createMedias () {
        this.mediasElements = document.querySelectorAll('.gallery__figure');
        this.medias = Array.from(this.mediasElements).map(element => {
            let media = new Media({
                element,
                geometry: this.planeGeometry,
                gl: this.gl,
                height: this.galleryHeight,
                width: this.galleryWidth,
                scene: this.scene,
                screen: this.screen,
                viewport: this.viewport
            });
            count ++;
            return media
        })
    }

    createRaycast () {
        this.raycaster = new Raycast(this.gl, {
            camera: this.camera,
            canvas: this.gl.canvas
        })
    }

    onTouchDown (event) {
        this.isDown = true;

        this.position.x = this.current.x
        this.position.y = this.current.y

        this.start.x = event.touches ? event.touches[0].clientX: event.clientX;
        this.start.y = event.touches ? event.touches[0].clientY : event.clientY;
    }

    onTouchMove (event) {
        const x = event.touches ? event.touches[0].clientX : event.clientX;
        const y = event.touches ? event.touches[0].clientY : event.clientY;
        this.mouse.x = 2 * x / this.screen.width - 1;
        this.mouse.y = 1 - 2 * y / this.screen.height;
        if (!this.isDown) return;
        this.mouseMoved = true;

        const distanceY = (this.start.y - y) * 2;
        const distanceX = (this.start.x - x) * 2;

        this.target.y = this.position.y + distanceY;
        this.target.x = this.position.x + distanceX;
    }

    onTouchUp (event) {
        if(!this.mouseMoved) {
            const selected = this.medias.find(media => media.isHover)
            if(selected) {
                this.onSelected(selected)
            }
        }
        this.isDown = false;
        this.mouseMoved = false;
    }


    onSelected(selected) {
        // mode = 'slider';
        currentIndex = selected.index;
        // console.log(currentIndex)

        const modX = this.target.x % this.galleryBounds.width;
        const modY = this.target.y % this.galleryBounds.height;

        let dX = -modX + selected.bounds.x - this.screen.width / 2 + selected.bounds.width / 2;
        let dY = -modY + selected.bounds.y - this.screen.height / 2 + selected.bounds.height / 2;

        if (Math.abs(dX) > this.galleryBounds.width / 2) {
            dX = - Math.sign(dX) * (this.galleryBounds.width - Math.abs(dX));
        }
        if (Math.abs(dY) > this.galleryBounds.height / 2) {
            dY = - Math.sign(dY) * (this.galleryBounds.height - Math.abs(dY));
        }

        this.target.x += dX
        this.target.y += dY

    }

    onUnselected() {
        mode = 'grid';
        currentIndex = null;
    }

    onResize() {
        this.screen = {
            height: window.innerHeight,
            width: window.innerWidth
        };

        this.renderer.setSize(this.screen.width, this.screen.height);

        this.camera.perspective({
            aspect: this.gl.canvas.width/this.gl.canvas.height
        });

        const fov = this.camera.fov * (Math.PI / 180);
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
        const width = height * this.camera.aspect;

        this.viewport = {
            height,
            width
        };

        this.galleryBounds = this.gallery.getBoundingClientRect();
        this.galleryHeight = this.viewport.height * this.galleryBounds.height / this.screen.height;
        this.galleryWidth = this.viewport.width * this.galleryBounds.width / this.screen.width;

        if (this.medias) {
            this.medias.forEach(media => media.onResize({
                height: this.galleryHeight,
                width: this.galleryWidth,
                screen: this.screen,
                viewport: this.viewport
            }));
        }
    }

    update() {

        this.current.y = lerp(this.current.y, this.target.y, S.ease);
        this.current.x = lerp(this.current.x, this.target.x, S.ease);

        this.direction.y = this.current.y > this.last.y ? 'down' : 'up';
        this.direction.x = this.current.x > this.last.x ? 'right' : 'left';

        if (this.medias) {
            this.raycaster.castMouse(this.camera, this.mouse);
            this.medias.forEach(media => {
                if(media.isHover) {
                    media.onHoverLeave()
                    document.body.style.cursor = 'default'
                }
                media.update(this.current, this.last, this.direction)
            });
            const hits = this.raycaster.intersectBounds(this.medias.map(media => media.plane));
            hits.forEach(mesh => {
                const media = this.medias.find(media => media.plane === mesh);
                if(media.isHover) return

                document.body.style.cursor = 'pointer'
                media.onHoverEnter()
            })
        }

        this.renderer.render({
            scene: this.scene,
            camera: this.camera
        });

        this.last.x = this.current.x;
        this.last.y = this.current.y;

        window.requestAnimationFrame(this.update.bind(this))
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));

        window.addEventListener('mousedown', this.onTouchDown.bind(this));
        window.addEventListener('mousemove', this.onTouchMove.bind(this));
        window.addEventListener('mouseup', this.onTouchUp.bind(this));

        window.addEventListener('touchstart', this.onTouchDown.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
        window.addEventListener('touchend', this.onTouchUp.bind(this));
    }
}

const app = new App();
console.log(app)

const images = document.querySelectorAll('img');
let imagesIndex = 0

Array.from(images).forEach(element => {
  const image = new Image()

  image.src = element.src;
  image.onload = _ => {
    imagesIndex += 1;

    if (imagesIndex === images.length) {
      document.documentElement.classList.remove('loading');
      document.documentElement.classList.add('loaded');
    }
  }
})