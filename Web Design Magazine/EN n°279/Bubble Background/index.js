window.addEventListener('load', function () {
    const parent = document.querySelector('main');
    const amount = 10;
    for (let i=0;i<=amount;i++){
        const node = document.createElement('span');
        node.setAttribute("data-bubble", '');
        node.style.top = (Math.random() * parent.offsetHeight) + 'px';
        parent.appendChild(node);
    }
});