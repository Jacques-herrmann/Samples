window.onload = () => {
    const text = new Blotter.Text("Doors", {
        family: "Montserrat",
        size: 150,
        fill: "#fff",
        paddingLeft: 50,
        paddingRight: 50,
    });
    const material = new Blotter.SlidingDoorMaterial();
    material.uniforms.uDivisions.value = 10;
    material.uniforms.uDivisionWidth.value = .2;
    material.uniforms.uAnimateHorizontal.value = 1;
    material.uniforms.uFlipAnimationDirection.value = 1;
    material.uniforms.uSpeed.value = .3;

    const blotter = new Blotter(material, { texts: text });
    const scope = blotter.forText(text);
    let elem = document.getElementById("Sliding");
    scope.appendTo(elem);
}
