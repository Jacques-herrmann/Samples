import { TweenMax, TimelineMax } from 'gsap'

TweenMax.set("#box5", {
    backgroundColor: "aqua",
    width: "120px",
    height: "120px",
    x: "50px",
    y: "50px"
});

document.addEventListener("click", (event) => {
    if (event.target.id === 'page5') {

        TweenMax.to("#box5", 0.5, {
            rotation: "+=60",
        })
    }
});

const timeline = new TimelineMax({repeat: -1}); // repeat: -1 => infinite

timeline.pause();  //disabled auto run

timeline.to("#box5", 0.5, {x: 200});
timeline.to("#box5", 0.5, {y: 200});
timeline.to("#box5", 0.5, {x: 50});
timeline.to("#box5", 0.5, {y: 50});

document.querySelector("#box5").addEventListener("click", () => {
    if(timeline.isActive()) {
        timeline.pause() //Pause the animation
    }
    else {
        timeline.resume()  // Run the following animation
    }
});

document.addEventListener("wheel", event => {
    console.log(event.deltaY);
    if (event.deltaY > 0)  {
        // timeline.progress(timeline.progress() + 0.1)
        TweenMax.to(timeline, 0.25, {progress: "+=0.1"})
    }
    else {
        // timeline.progress(timeline.progress() - 0.1)
        TweenMax.to(timeline, 0.25, {progress: "-=0.1"})
    }
});

