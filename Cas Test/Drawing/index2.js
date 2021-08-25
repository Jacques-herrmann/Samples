const svg = document.getElementById("your-svg");
const path = document.getElementById("your-path");

// SVGPoint is deprecated according to MDN
let point = svg.createSVGPoint();
point.x = 55;
point.y = 52;

// or according to MDN
// let point = new DOMPoint(40, 32);

console.log("In stroke:", path.isPointInStroke(point)); // shows true
console.log("In fill:", path.isPointInFill(point)); // shows false