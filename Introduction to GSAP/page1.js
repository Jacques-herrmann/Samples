import { TweenMax } from 'gsap'

// TweenMax.set("#box", { xPercent: -50, yPercent: -50});
const box = document.getElementById('box');
const x_value = box.getBoundingClientRect().left + box.offsetWidth/2;
const y_value = box.getBoundingClientRect().top + box.offsetHeight/2;

document.addEventListener("click", event => {
    const {clientX, clientY} = event;
    if (event.target.id === 'page1') {
        TweenMax.to("#box", 1 , {x: clientX - x_value, y: clientY - y_value})
    }
})