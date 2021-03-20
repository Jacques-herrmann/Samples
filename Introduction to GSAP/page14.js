import { gsap, TweenMax, TimelineMax, Power2, Elastic} from 'gsap'
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";
import ScrollMagic from 'scrollmagic'
import '/node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'
import '/node_modules/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'
gsap.registerPlugin(MotionPathPlugin);

// TODO: branch it to a scroll event
const page = document.getElementById("target");
const dots = document.getElementsByClassName("dot");
const paths = document.getElementsByClassName("path");

let step = 0;

for(let i=0; i<paths.length; i++){
    const pathLength = paths[i].getTotalLength();
    paths[i].setAttribute("stroke-dasharray", "5 "+ pathLength);
    paths[i].setAttribute("stroke-dashoffset", pathLength);
};

const controller = new ScrollMagic.Controller();
const scene = new ScrollMagic.Scene({triggerElement: ".trigger", duration: 2400, tweenChanges: true, reverse: false});


const timeline = new TimelineMax();
timeline.to(dots[0], 0.5, {border: "7px solid #3e77f2", boxShadow: "0 0 15px #3e77f2 " ,ease: Elastic.easeOut});

for(let i=0; i<paths.length; i++) {
    if (i === 0) {
        timeline.set(dots[i], {border: "0px solid #3e77f2"});
    }
    else {
        timeline.set(dots[i], {border: "7px solid grey", boxShadow: "0 0 15px grey" });
    }
    timeline.set(paths[i], {visibility: "visible"});
    timeline.to(paths[i], 1.3, {strokeDashoffset: 0, ease: Power2.easeNone});
    timeline.set(paths[i], {visibility: "hidden"});
    timeline.set(paths[i], {strokeDashoffset: paths[i].getTotalLength()});
    timeline.to(dots[i + 1], 0.5, {
        border: "7px solid #3e77f2",
        boxShadow: "0 0 15px #3e77f2 ",
        ease: Elastic.easeOut
    });
    timeline.fromTo("#titleappear" + i, 0.5, {opacity: 0, x:20,y: 600}, {opacity: 1, x:80,y: 600}, "-=0.5")
    timeline.fromTo("#divappear" + i, 0.5, {opacity: 0, x:200,y: 580}, {opacity: 1, x:100,y: 580}, "-=0.5")
};

scene.setTween(timeline);
scene.addIndicators(); // add indicators (requires plugin)
scene.addTo(controller);






// page.addEventListener("click", () => {
//     if (step + 1 === dots.length) {
//         timeline.set(dots[step], {border: "0px solid #3e77f2" });
//         step = 0;
//     }
//     timeline.set(dots[step], {border: "0px solid #3e77f2" });
//     timeline.set(paths[step], {visibility: "visible"});
//     timeline.to(paths[step], 0.8, {strokeDashoffset: 0, ease: Power2.easeNone});
//     timeline.set(paths[step], {visibility: "hidden"});
//     timeline.set(paths[step], {strokeDashoffset: paths[step].getTotalLength()});
//     timeline.to(dots[step + 1], 0.5, {border: "7px solid #3e77f2", boxShadow: "0 0 15px #3e77f2 " ,ease: Elastic.easeOut});
//     step += 1;
// });




