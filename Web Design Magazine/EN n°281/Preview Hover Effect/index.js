const cursor = document.getElementById("cursor");
const ball = document.getElementById("ball");

window.addEventListener('load', function () {
   let _x = 0 ,_y = 0;
   document.onmousemove = function (ev) {
       _x = ev.clientX;
       _y = ev.clientY;
   };
   function animate() {
     requestAnimationFrame(animate);
     cursor.style.left = (_x - 15) + 'px';
     cursor.style.top = (_y - 15) + 'px';
   }
   animate();
});

function change(elt) {
    if (elt === 'first') {
        ball.classList.add("first")
    }
    if (elt === 'second') {
        ball.classList.add("second")
    }
}

function leave(elt) {
    if (elt === 'first') {
        ball.classList.remove("first")
    }
    if (elt === 'second') {
        ball.classList.remove("second")
    }
}