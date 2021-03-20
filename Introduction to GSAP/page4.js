import { TweenMax, TimelineMax } from 'gsap'

TweenMax.set("#box4", {
    backgroundColor: "orange",
    width: "120px",
    height: "120px",
    x: "50px",
    y: "50px"
});

document.addEventListener("click", (event) => {
    if (event.target.id === 'page4') {

        TweenMax.to("#box4", 0.5, {
            rotation: "+=60",
        })
    }
});

const timeline = new TimelineMax({repeat: -1}); // repeat: -1 => infinite

timeline.pause();  //disabled auto run

timeline.to("#box4", 0.5, {x: 200});
timeline.to("#box4", 0.5, {y: 200});
timeline.to("#box4", 0.5, {x: 50});
timeline.to("#box4", 0.5, {y: 50});

document.querySelector("#box4").addEventListener("click", () => {
    if(timeline.isActive()) {
        timeline.pause() //Pause the animation
    }
    else {
        timeline.resume()  // Run the following animation
    }
});

