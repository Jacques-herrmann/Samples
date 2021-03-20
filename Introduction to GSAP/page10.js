import { TweenMax } from 'gsap'

const box = document.createElement("div");
box.setAttribute("class", "box10");
document.getElementById("page10").appendChild(box);

TweenMax.set(box, {transformPerspective: 100});

box.addEventListener("click", () => {
    TweenMax.to(box, 1, {rotationY: "+=180"});
});