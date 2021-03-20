import { TweenMax } from 'gsap'

const divs = Array.from({ length: 100 }, () =>
    document.createElement("div")
);

divs.forEach(div => {
    TweenMax.set(div, {
        position: "absolute",
        x: `${Math.random() * window.innerWidth}px`,
        y: `${Math.random() * window.innerHeight}px`,
        height: 20,
        width: 20,
        backgroundColor: "#eba876",
        border: "1px solid black"
    });

    document.getElementById("page8").appendChild(div);
});

TweenMax.to(divs, 10, {x: 100, y: 100});

document.addEventListener("click", event => {
    if (event.target.id ==='page8') {
        TweenMax.killTweensOf(event.target);  // Stop the target animation

        // Deprecated -> see gsap.globalTimeline.pause()
        // TweenMax.killAll();  // Stop all tween animation
        // TweenMax.killAll(true);  // Stop and finish all tween animation
    }
});

