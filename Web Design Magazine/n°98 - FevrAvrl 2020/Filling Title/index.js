window.addEventListener('load', (ev) => {
   let nodes = document.querySelectorAll(".pauseButton") ;
   nodes.forEach((item) => {
       item.addEventListener('click', function() {
           this.parentNode.classList.toggle('paused');
       });
   });
});