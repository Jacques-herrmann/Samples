window.addEventListener("load", function () {
    const nodes = document.querySelectorAll(".dropcap");
    nodes.forEach(function (item) {
        item.innerHTML = "<span class='image'>" +
            "<span></span>" +
            "<span></span>" +
            "</span>" +
            "<span>" + item.innerText + "</span>";
    });
});