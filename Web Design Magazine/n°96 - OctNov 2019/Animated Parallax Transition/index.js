import Rellax from "rellax";

window.onload = function () {
    const rellax = new Rellax('.rellax', {
        callback: function (position) {
            console.log(position);
        }
    });
};
