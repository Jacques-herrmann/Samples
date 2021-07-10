window.onload = () => {
    const text = new Blotter.Text("Signals", {
        family: "Montserrat",
        size: 150,
        fill: "#000",
        paddingLeft: 10,
        paddingRight: 50,
    });
    const material = new Blotter.ChannelSplitMaterial();
    material.uniforms.uOffset.value = 0.05;
    material.uniforms.uRotation.value = 50;
    material.uniforms.uApplyBlur.value = 1;
    material.uniforms.uAnimateNoise.value = 0.3;

    const blotter = new Blotter(material, { texts: text });
    const scope = blotter.forText(text);
    let elem = document.getElementById("Channel");
    scope.appendTo(elem);

    document.onmousemove = (ev) => {
        material.uniforms.uRotation.value = ev.clientX * .1;
        material.uniforms.uOffset.value = ev.clientX * .0001;
    }
}
