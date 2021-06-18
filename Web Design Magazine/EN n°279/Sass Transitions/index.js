const body = document.body;
const button = document.querySelector(".more-btn");

const loadPage = () => {
    body.classList.add("load-page");
};
const initReading = e => {
    let txt = e.target;
    body.classList.toggle("is-reading");
    if (body.classList.contains("is-reading")) {
        txt.innerText = "Show Image";
    } else {
        txt.innerText = "Read More";
    }
};

button.addEventListener("click", initReading);
window.onload = loadPage;