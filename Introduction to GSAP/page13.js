import { TweenMax, TimelineMax, Elastic } from 'gsap'
 import larbinsrc from "./public/mr larbin.png"
import larbinaudio from "./public/larbin.mp3"

const page = document.getElementById("page13");
const larbinbox = page.querySelector("#larbinbox");
let tl = new TimelineMax({repeat: -1});
const audio = new Audio(larbinaudio);


larbinbox.addEventListener("click", () => {
   TweenMax.to(larbinbox, 0.1, {
       scale: 0.95,
       repeat: 1,
       yoyo: true,
   }); // larbin box animation

    // Adding a new Mr Larbin
    let larbin = document.createElement("img");

    larbin.setAttribute("src", larbinsrc);
    larbin.setAttribute("class", "larbinimg");
    const size = Math.max(50, `${Math.random() *250}`);
    TweenMax.set(larbin, {
        position: "absolute",
        x: `${Math.random() *1100}px`,
        y: `${Math.random() * 800}px`,
        height: size,
        // width: size,
        zIndex: 1,
        cursor: "pointer"
    });

    page.appendChild(larbin);
    audio.play();

    larbin.addEventListener("click", (event)=> {
        event.target.remove();
    });
    // Adding animation to larbin
    TweenMax.to(larbin, 1,  {
        scale: 1.5,
        rotation: 15,
        repeat: -1,
        yoyo: true,
        ease: Elastic.easeInOut
    });

    tl.to(larbin, 3.5, {
        x: `${Math.random() * 1230}px`,
        y: `${Math.random() * 800}px`,
        onComplete: function () {
            this.vars.x= `${Math.random() * 1230}px`;
            this.vars.y = `${Math.random() * 800}px`;
            this.invalidate();
        }
    }, "-=3.5");
});


// TweenMax.to(".larbinimg", 1.5, {
//     x: `${Math.random() * 1230}px`,
//     y: `${Math.random() * 570}px`,
//     repeat: -1
// });
//

