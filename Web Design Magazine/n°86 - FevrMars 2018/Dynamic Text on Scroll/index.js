window.addEventListener('load', function () {
    const parent = document.querySelector('h1');
    const text = parent.innerText;
    parent.innerText = "";

    for(let i=0; i<text.length;i++) {
        const letter = document.createElement('span');
        letter.innerText = text[i];
        letter.style.top = "0";
        letter.setAttribute("data-speed", Math.floor(Math.random() * 10) * 2);
        parent.appendChild(letter);
    }

    window.addEventListener('scroll', function () {
        const nodes = document.querySelectorAll("h1 > *");
        for (let i=0; i<nodes.length; i++) {
            const speed = window.scrollY / parseInt(nodes[i].getAttribute('data-speed'));
            nodes[i].style.top = speed + "px";
        }
    });
});