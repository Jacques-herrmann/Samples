window.addEventListener('load', function () {
    const button = document.getElementById('toggle');
    button.addEventListener("click", function () {
        let palette = "0";
        if (document.body.getAttribute("data-palette") === "0") {
            palette = "1";
        }
        document.body.setAttribute("data-palette", palette);
    })
});