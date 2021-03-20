import { TweenMax } from 'gsap'

TweenMax.set("#box6", {
    backgroundColor: "#82bb93",
    width: "120px",
    height: "120px",
    x: "50px",
    y: "50px"
});

const box6 = document.getElementById('box6');
const x6_value = box.getBoundingClientRect().left + box6.offsetWidth/2;
const y6_value = box.getBoundingClientRect().top + box6.offsetHeight/2;

document.addEventListener("click", (event) => {
    const {x, y} = event;
    if (event.target.id === 'page6') {
        TweenMax.from("#box6", 1, {x: x - x6_value, y: y - y6_value});  // from x, y to the first position
        // TweenMax.fromTo("#box6", 0.5, {clientX, clientY},  {x: 600, y: 600}) // from x, y to the second position (here :600, 600)
    }
});


