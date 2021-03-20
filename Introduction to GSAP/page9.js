import { TweenMax } from 'gsap'

const box = document.createElement("div");
box.setAttribute("class", "box9");
document.getElementById("page9").appendChild(box);

box.addEventListener("mouseover", () => {
    // TweenMax.to(box, 0.25, { className: "+=hover"})// deprecated see why. -> https://greensock.com/forums/topic/21962-gsap-3-not-work-add-classes/
    TweenMax.to(box, 0.25, { boxShadow: "0 1rem 1rem"})

});

box.addEventListener("mouseout", () => {
    // TweenMax.to(box, 0.25, { className: "-=hover"})
    TweenMax.to(box, 0.25, { boxShadow: "none"})
});

box.addEventListener("mousedown", () => {
    TweenMax.to(box, 0.25, { backgroundColor: "#263a9e"})
});

box.addEventListener("mouseup", () => {
    TweenMax.to(box, 0.25, { backgroundColor: "#7feb76"})
});

