window.addEventListener('scroll', function () {
   const nodes = document.querySelectorAll("article");
   nodes.forEach(function (node) {
       if (node.getBoundingClientRect().top <= window.innerHeight) {
           node.classList.add('active');
       }
       else {
           node.classList.remove('active');
       }
   })
});