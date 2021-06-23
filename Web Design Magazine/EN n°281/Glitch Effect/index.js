const loader = document.getElementById("loader");

window.addEventListener('load', function f() {
    loader.classList.remove('loading');
    loader.classList.add('loaded');
    document.body.classList.add('imgloaded');
});