import { TweenMax, Elastic } from 'gsap'

const page = document.getElementById("page12");
const larbin = page.querySelector("#larbin");


TweenMax.to(larbin, 1,  {
    scale: 1.5,
    rotation: 15,
    repeat: -1,
    yoyo: true,
    ease: Elastic.easeInOut
});
