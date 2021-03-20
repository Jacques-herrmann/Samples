import { TweenMax, TimelineMax } from 'gsap'

TweenMax.set("#box3", {
    backgroundColor: "red",
    width: "120px",
    height: "120px",
    x: "50px",
    y: "50px"
});

document.addEventListener("click", (event) => {
    if (event.target.id === 'page3') {

        TweenMax.to("#box3", 0.5, {
            rotation: "+=60",
        })
    }
});

const timeline = new TimelineMax();

timeline.pause();  //disabled auto run

timeline.to("#box3", 0.5, {x: 400});
timeline.to("#box3", 0.5, {y: 400});
timeline.to("#box3", 0.5, {x: 50});
timeline.to("#box3", 0.5, {y: 50});

document.querySelector("#box3").addEventListener("click", () => {
    timeline.resume()  // Run the animation on first click
});

