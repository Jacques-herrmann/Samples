import { Mesh, Program, Texture } from "ogl";
import gsap from 'gsap';

import fragment from '/shader/fragment.glsl?raw'
import vertex from '/shader/vertex.glsl?raw'

let index = -1;
export default class {
    constructor ({ element, geometry, gl, height, width, scene, screen, viewport }) {
        this.extra = {x: 0, y: 0};

        this.index = index++;

        this.element = element;
        this.image = this.element.querySelector('img');

        this.height = height;
        this.width = width
        this.geometry = geometry;
        this.gl = gl;
        this.scene = scene;
        this.screen = screen;
        this.viewport = viewport;

        this.isHover = false;

        this.createMesh();
        this.createBounds();

        this.onResize();
    }

    createMesh () {
        const image = new Image();
        const texture = new Texture(this.gl, {
            generateMipmaps: false
        });

        image.src = this.image.src;
        image.onload = _ => {
            program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
            texture.image = image
        };

        const program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                tMap: { value: texture },
                uHit: { value: 0 },
                uPlaneSizes: { value: [0, 0] },
                uImageSizes: { value: [0, 0] },
                uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
                uStrength: { value: 0 }
                },
            transparent: true
        });

        this.plane = new Mesh(this.gl, {
            geometry: this.geometry,
            program
        });

        this.plane.setParent(this.scene)
    }

    createBounds () {
        this.bounds = this.element.getBoundingClientRect();

        this.updateScale();
        this.updateX();
        this.updateY();

        this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    }

    onHoverEnter() {
        gsap.to(this.plane.program.uniforms.uHit, {
            duration: 1,
            value: 1,
            ease: 'expo.out'
        })
        this.isHover = true;
    }

    onHoverLeave() {
        gsap.to(this.plane.program.uniforms.uHit, {
            duration: 1,
            value: 0,
            ease: 'expo.out'
        })
        this.isHover = false;
    }

    updateScale () {
        this.plane.scale.x = this.viewport.width * this.bounds.width / this.screen.width;
        this.plane.scale.y = this.viewport.height * this.bounds.height / this.screen.height;
    }

    updateX (x = 0) {
        this.plane.position.x = -(this.viewport.width / 2) + (this.plane.scale.x / 2) + ((this.bounds.left - x) / this.screen.width) * this.viewport.width - this.extra.x;
    }

    updateY (y = 0) {
        this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - ((this.bounds.top - y) / this.screen.height) * this.viewport.height - this.extra.y;
    }

    update (current, last, direction) {
        this.updateX(current.x);
        this.updateY(current.y);

        const planeYOffset = this.plane.scale.y / 2;
        const planeXOffset = this.plane.scale.x / 2;
        const viewportHOffset = this.viewport.height / 2;
        const viewportWOffset = this.viewport.width / 2;

        this.isBefore = this.plane.position.y + planeYOffset < -viewportHOffset;
        this.isAfter = this.plane.position.y - planeYOffset > viewportHOffset;

        this.isLeft = this.plane.position.x - planeXOffset > viewportWOffset;
        this.isRight = this.plane.position.x + planeXOffset < -viewportWOffset;

        if (direction.y === 'up' && this.isBefore) {
          this.extra.y -= this.height;

          this.isBefore = false;
          this.isAfter = false;
        }

        if (direction.y === 'down' && this.isAfter) {
          this.extra.y += this.height;

          this.isBefore = false;
          this.isAfter = false;
        }

        if (direction.x === 'left' && this.isLeft) {
          this.extra.x += this.width;

          this.isLeft = false;
          this.isRight = false;
        }

        if (direction.x === 'right' && this.isRight) {
          this.extra.x -= this.width;

          this.isLeft = false;
          this.isRight = false;
        }

        const s = - Math.max(Math.abs((current.y - last.y)), Math.abs((current.x - last.x)))* 2;
        this.plane.program.uniforms.uStrength.value = (s / this.screen.width) * 10;
    }

    onResize (sizes) {
        this.updateScale();
        this.extra.x = 0;
        this.extra.y = 0;
        if (sizes) {
            const { height,width, screen, viewport } = sizes;

            if (height) this.height = height;
            if (width) this.width = width;
            if (screen) this.screen = screen;
            if (viewport) {
                this.viewport = viewport;

                this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
            }
        }

      this.createBounds();
    }
}