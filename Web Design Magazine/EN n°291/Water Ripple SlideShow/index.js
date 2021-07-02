import * as C from 'curtainsjs';

window.onload = function () {
    const webGLCurtain = new C.Curtains({ container: "canvas" });
    const planeElements = document.getElementsByClassName("multi-textures");
    const slideshowState = {
        activeTextureIndex: 1,
        nextTextureIndex: 2,
        maxTextures: planeElements[0].querySelectorAll("img").length - 1,
        isChanging: false,
        transitionTimer: 0
    };
    const pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1.0;

    // handling errors
    webGLCurtain.onError(function() {
        // we will add a class to the document body to display original images
        document.body.classList.add("image-1");

        // handle simple slides management here
        planeElements[0].addEventListener("click", function() {
            if(slideshowState.activeTextureIndex < slideshowState.maxTextures) {
                slideshowState.nextTextureIndex = slideshowState.activeTextureIndex + 1;
            }
            else {
                slideshowState.nextTextureIndex = 1;
            }
            document.body.classList.add("image-" + slideshowState.nextTextureIndex);
            slideshowState.activeTextureIndex = slideshowState.nextTextureIndex;
        });
    });

    // disable drawing for now
    webGLCurtain.disableDrawing();

    // some basic parameters
    // we don't need to specifiate vertexShaderID and fragmentShaderID because we already passed it via the data attributes of the plane HTML element
    const params = {
        uniforms: {
            resolution: {
                name: "uResolution",
                type: "2f",
                value: [pixelRatio * planeElements[0].clientWidth, pixelRatio * planeElements[0].clientHeight],
            },
            transitionTimer: {
                name: "uTransitionTimer",
                type: "1f",
                value: 0,
            },
        },
    };
    const multiTexturesPlane = new C.Plane(webGLCurtain, planeElements[0], params);

    if(multiTexturesPlane) {
        multiTexturesPlane.onReady(function () {
            // the idea here is to create two additionnal textures
            // the first one will contain our visible image
            // the second one will contain our entering (next) image
            // that we will deal with only activeTex and nextTex samplers in the fragment shader
            // and the could work with more images in the slideshow...

            // first we set our very first image as the active texture
            const activeTex = multiTexturesPlane.createTexture({
                sampler: "activeTex",
                fromTexture: multiTexturesPlane.textures[slideshowState.activeTextureIndex]
            });
            // next we set the second image as next texture but this is not mandatory
            // as we will reset the next texture on slide change
            const nextTex = multiTexturesPlane.createTexture({
                sampler: "nextTex",
                fromTexture: multiTexturesPlane.textures[slideshowState.nextTextureIndex]
            });

            planeElements[0].addEventListener('click', function () {
                if (!slideshowState.isChanging) {
                    // enable drawing for now
                    webGLCurtain.enableDrawing();
                    slideshowState.isChanging = true;
                    // check what will be next image
                    if (slideshowState.activeTextureIndex < slideshowState.maxTextures) {
                        slideshowState.nextTextureIndex = slideshowState.activeTextureIndex + 1;
                    } else {
                        slideshowState.nextTextureIndex = 1;
                    }
                    // apply it to our next texture
                    nextTex.setSource(multiTexturesPlane.images[slideshowState.nextTextureIndex]);
                    setTimeout(function () {
                        // disable drawing now that the transition is over
                        webGLCurtain.disableDrawing();
                        slideshowState.isChanging = false;
                        slideshowState.activeTextureIndex = slideshowState.nextTextureIndex;
                        // our next texture becomes our active texture
                        activeTex.setSource(multiTexturesPlane.images[slideshowState.activeTextureIndex]);
                        // reset timer
                        slideshowState.transitionTimer = 0;

                    }, 1700); // add a bit of margin to the timer
                }
            });
        }).onRender(function () {
            // increase or decrease our timer based on the active texture value
            if (slideshowState.isChanging) {
                slideshowState.transitionTimer = Math.min(90, slideshowState.transitionTimer + 1);
            }

            // update our transition timer uniform
            multiTexturesPlane.uniforms.transitionTimer.value = slideshowState.transitionTimer;
        });
    }
};