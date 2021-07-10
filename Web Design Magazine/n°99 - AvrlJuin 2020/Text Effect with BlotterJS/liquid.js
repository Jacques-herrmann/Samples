window.onload = () => {
    const text = new Blotter.Text("Liquid", {
        family: "'Ed Garamond', serif",
        size: 150,
        fill: "#fff",
        paddingLeft: 10,
        paddingRight: 50,
    });
    const material = new Blotter.LiquidDistortMaterial();
    material.uniforms.uSpeed.value = 0.3;
    material.uniforms.uVolatility.value = 0.10;
    material.uniforms.uSeed.value = .1;

    const blotter = new Blotter(material, { texts: text });
    const scope = blotter.forText(text);
    let elem = document.getElementById("Liquid");
    scope.appendTo(elem);
}
