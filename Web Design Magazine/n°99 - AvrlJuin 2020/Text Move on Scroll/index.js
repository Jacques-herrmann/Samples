window.addEventListener('load', () => {
    window.lastScrollY = 0;
    const MAX_HEIGHT = document.querySelector('body').clientHeight * 2/8;
    const MAX_Y = 400;
    const MIN_SPEED = MAX_HEIGHT / MAX_Y;
    const parent = document.querySelector('h1');
    const text = parent.innerText;
    parent.innerText = "";

    for(let i=0; i < text.length; i++) {
        const letter = document.createElement("span");
        letter.speed = Math.floor(Math.random() * 10) + MIN_SPEED;
        letter.y = Math.floor(Math.random() * MAX_Y) + 2;
        letter.originY = letter.y;
        letter.opacity = 1;
        letter.innerText = text[i];
        letter.style.top = letter.y + 'px';
        parent.appendChild(letter);
    }

    window.addEventListener('scroll', (ev) => {
        console.log(window.scrollY);
        let scrollUp = (window.lastScrollY < window.scrollY);
        const nodes = document.querySelectorAll('h1 > *');
        if (window.scrollY < MAX_HEIGHT) {
            for(let i=0; i < nodes.length; i++) {
                const speed = nodes[i].speed;
                if (scrollUp) {
                    nodes[i].y -= speed;
                    if (nodes[i].y <= 0) nodes[i].y = 0;
                }
                else {
                    nodes[i].y += speed;
                    if (nodes[i].y > nodes[i].originY) nodes[i].y = nodes[i].originY;
                }
                nodes[i].style.top = nodes[i].y + 'px';
            }
        }
        else {
            for (let i=0; i < nodes.length; i++) {
                if (scrollUp && nodes[i].opacity > 0) {
                    nodes[i].opacity -= 1/(1 + i * 10);
                }
                else if (!scrollUp && nodes[i].opacity < 1) {
                    nodes[i].opacity += 1/(1 + i * 10);
                }
                nodes[i].style.opacity = nodes[i].opacity;
            }
        }
        window.lastScrollY = window.scrollY
    })
});