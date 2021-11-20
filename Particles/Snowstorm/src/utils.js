function sphericalToCartesian(r, t, p) {
    return {
        x: r * Math.sin(p) * Math.cos(t),
        y: r * Math.sin(p) * Math.sin(t),
        z: r * Math.cos(p),
    }
}
export {
    sphericalToCartesian,
}