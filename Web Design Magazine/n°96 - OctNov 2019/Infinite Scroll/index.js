let scroll = {
    index: 0,
    sections: [],
    timestamp: 0,
    lastY: 0,
    difference: 0
};

window.addEventListener('load', function () {
   scroll.sections = Array.from(document.querySelectorAll("body > section"));
});
window.addEventListener('scroll', function () {
    let section = null;
    if (window.scrollY > scroll.lastY) {
       // Scroll down
        section = scroll.sections[0];
        if(window.scrollY > section.offsetTop + section.offsetHeight) {
            scroll.sections.push(section);
            scroll.sections.shift();
            section.parentNode.appendChild(section)
        }
    } else {
        // Scroll up
        section = scroll.sections[0];
        if (window.scrollY < section.offsetTop + 250) {
            const lastIndex = scroll.sections.length - 1;
            const last = scroll.sections[lastIndex];
            scroll.sections.unshift(last);
            scroll.sections.pop();
            section.parentNode.insertBefore(last, section.parentNode.childNodes[0])
        }
    }
    scroll.difference = window.scrollY - scroll.lastY;
    scroll.lastY = window.scrollY;
});