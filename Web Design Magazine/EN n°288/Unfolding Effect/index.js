window.addEventListener('load', function () {
   let time = 0;
   const links = document.querySelectorAll("nav.foldout > a");
   let top = links[0].previousElementSibling.offsetHeight;
   for (let i=0; i<links.length; i++) {
       links[i].style.transitionDelay = time + "s";
       links[i].style.top = top + "px";
       links[i].style.zIndex = links.length - i;
       time += 0.2;
       top += links[i].offsetHeight;
   }
   const nodes = document.querySelectorAll("nav.foldout > *:first-child");
   for (let i=0; i<nodes.length; i++) {
       nodes[i].addEventListener('click', function () {
          this.parentNode.classList.toggle("open");
       });
   }
});