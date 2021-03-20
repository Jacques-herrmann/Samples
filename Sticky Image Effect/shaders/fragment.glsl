uniform sampler2D u_texture;
uniform vec2 u_textureFactor;
varying vec2 vUv;


void main() {
    vec2 uv = vec2(0.5) + vUv * u_textureFactor - u_textureFactor*0.5;

    gl_FragColor = vec4(texture2D(u_texture, uv));
}