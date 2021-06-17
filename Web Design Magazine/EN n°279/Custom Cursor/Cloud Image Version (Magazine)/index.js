const speed = 12;
let _x = 0,
    _y = 0,
    endX = 0,
    endY = 0;
const glow = document.getElementById("glow");

document.addEventListener('mousemove',function (e) {
    endX = e.pageX;
    endY = e.pageY
});

function animate() {
    requestAnimationFrame(animate);
    _x += (endX - _x) / speed;
    _y += (endY - _y) / speed;
    glow.style.top = _y - 33 +'px';
    glow.style.left = _x - 33 +'px';
}
animate();