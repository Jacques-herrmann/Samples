window.addEventListener('load', function () {
    const nodes = document.querySelectorAll('[data-expand] [data-control="expand"');
    for (let i=0; i<nodes.length; i++) {
        nodes[i].addEventListener('click', function () {
            const parent = this.parentNode;
            if (parent.getAttribute("data-expand") !== "open") {
                parent.setAttribute("data-expand", "open")
            } else {
                parent.setAttribute("data-expand", "closed");
            }
        });
    }
});