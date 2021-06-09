window.addEventListener('load', () => {
    let nodes = document.querySelectorAll('[data-popup]');
    nodes.forEach((node) => {
        node.addEventListener('click', function () {
            let target = document.getElementById(this.getAttribute('data-popup'));
            let container = document.createElement('div');
            container.classList.add('popup');
            let box = document.createElement('div');
            box.appendChild(target.cloneNode(true));
            let closeBtn = box.querySelector('[data-popup-close]');
            closeBtn.popup = container;
            closeBtn.addEventListener('click', function () {
                this.popup.remove();
            });
            container.appendChild(box);
            document.body.appendChild(container);
        })
    });
});