window.addEventListener('load', function () {
   const nodes = document.querySelectorAll(".dropout > img");
   for (let i=0; i<nodes.length; i++) {
       nodes[i].style.zIndex = i;
       nodes[i].addEventListener('click', function () {
           this.classList.add("closing");
       });
       nodes[i].addEventListener('animationend', function () {
           const children = this.parentNode.children;
           for (let n=0; n<children.length; n++) {
               const index = parseInt(children[n].style.zIndex) + 1;
               children[n].style.zIndex = index;
           }
           this.style.zIndex = 0;
           this.classList.remove("closing");
       });
   }
});