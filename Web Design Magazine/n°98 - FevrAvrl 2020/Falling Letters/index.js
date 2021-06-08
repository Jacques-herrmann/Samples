window.addEventListener('load', (ev) => {
    const nodes = document.querySelectorAll(".letters");
    for (let i = 0; i < nodes.length; i++) {
        let text = nodes[i].innerText;
        for (let l=0; l < text.length; l++) {
            let node = document.createElement('span');
            node.style.animationDelay = l + 's';
            node.style.left = 10 + Math.random() * 80 + 'vw';
            node.innerText = text[l];
            nodes[i].appendChild(node);
        }
    }
});