uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vElevation;

void main() {
    gl_FragColor = vec4(mix(uColorA, uColorB, vElevation), 1.0);
}