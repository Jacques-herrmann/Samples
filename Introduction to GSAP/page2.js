import { TweenMax } from 'gsap'

const box = document.getElementById('box2');

TweenMax.set("#box2", {
    backgroundColor: "green",
    width: "120px",
    height: "120px",
    x: "50px",
    y: "50px"
});

document.addEventListener("click", (event) => {
    if (event.target.id === 'page2') {

        TweenMax.to("#box2", 0.5, {
            rotation: "+=60",
            x: "+=60",
        })
    }
})

