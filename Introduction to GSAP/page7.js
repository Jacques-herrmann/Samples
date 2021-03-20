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
        backgroundColor: "#b676eb",
        border: "1px solid black"
    });

    document.getElementById("page7").appendChild(div);
});

document.addEventListener("click", event => {
    const {x, y} = event;
    if (event.target.id === 'page7') {
        TweenMax.to(divs, 1, {x: x - 376, y: y - 11}) // 376 = page7.margin-left + page7.padding-left + block.width/2
    }
});

