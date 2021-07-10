window.onload = () => {
    const text = new Blotter.Text("Ants !", {
        family: "serif",
        size: 150,
        fill: "#80604D"
    });
    const material = new Blotter.FliesMaterial();
    material.uniforms.uPointCellWidth.value = 0.01;
    material.uniforms.uPointRadius.value = 0.8;
    material.uniforms.uSpeed.value = 5;

    const blotter = new Blotter(material, { texts: text });
    const scope = blotter.forText(text);
    let elem = document.getElementById("Ants");
    scope.appendTo(elem);
}
