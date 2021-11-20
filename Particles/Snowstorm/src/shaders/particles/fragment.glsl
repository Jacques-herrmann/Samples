varying vec3 vColor;
varying vec2 vUv;

void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength =  smoothstep(0.5, 0.1, strength);
//    strength = pow(strength, 4.0);

    gl_FragColor = vec4(vColor, strength);
}