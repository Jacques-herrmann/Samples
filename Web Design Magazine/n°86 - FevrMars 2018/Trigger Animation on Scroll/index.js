window.addEventListener('load', function () {
    window.addEventListener('scroll', function () {
        const nodes = document.querySelectorAll("[data-animation]");
        for(let i=0; i<nodes.length; i++) {
            const bound = nodes[i].getBoundingClientRect();
            if (bound.top >= 0 && bound.bottom <= window.innerHeight) {
                nodes[i].classList.add("active");
            } else {
              nodes[i].classList.remove("active")
            }
        }
    })
});