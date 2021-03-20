import { TweenMax } from 'gsap'

const page = document.getElementById("page11");

TweenMax.set(page, {perspective: 200});

Array.from({length: 30})
    .map(() => document.createElement("div"))
    .forEach(box => {
        box.setAttribute("class", "box11");
        page.appendChild(box);
        box.addEventListener("mouseover", () => {
            TweenMax.to(box, 1, {rotationY: "+=180"});
        });
    });