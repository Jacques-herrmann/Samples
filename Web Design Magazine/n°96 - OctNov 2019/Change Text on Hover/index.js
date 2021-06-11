window.addEventListener('load' , function () {
   const hover =  {
       "index": 0,
       "originalText": null,
       "interval": null,
       "node": null
   };
   const nodes = document.querySelectorAll(".sequenceRollover");
   nodes.forEach((node) => {
       node.addEventListener("mouseover", function () {
           if (hover.interval == null) {
               hover.node = this;
               hover.originalText = this.innerText;
               hover.index = 0;
               hover.interval = setInterval(function () {
                   if (hover.index < hover.originalText.length) {
                       const chars = ["@", "!", "#", "?"];
                       hover.index ++;
                       const text = hover.originalText.substring(0, hover.index)
                           + chars[Math.floor(Math.random() * chars.length)]
                           + hover.originalText.substring(hover.index + 1);
                       hover.node.innerText = text;
                   } else {
                       hover.node.innerText = hover.originalText;
                       clearInterval(hover.interval);
                       hover.node = null;
                       hover.originalText = null;
                       hover.interval = null;
                   }
               }, 50)
           }
       })
   })
});