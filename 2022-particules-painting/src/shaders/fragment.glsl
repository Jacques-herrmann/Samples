uniform sampler2D uParticlesPattern;

varying vec3 vColor;

void main() {
    float alpha = texture2D(uParticlesPattern, gl_PointCoord).g;
    alpha = clamp(alpha, 0.0, 1.0);
    gl_FragColor = vec4(vColor, alpha);
}