window.addEventListener("load", function () {
   const sections = document.querySelectorAll("body > section");
   console.log(sections);
   for (let i=0; i<sections.length; i=i+2) {
       sections[i].style.top = ((i / 2) * 100) + "vh";
       sections[i + 1].style.top = ((i / 2) * 100) + "vh";
   }
});