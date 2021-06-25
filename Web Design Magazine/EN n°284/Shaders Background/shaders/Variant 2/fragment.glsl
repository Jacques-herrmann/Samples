uniform vec2 iResolution;
uniform float iTime;
varying vec2 vUv;
vec3 col1 = vec3(0.0, 0.8, 0.5);
vec3 col2 = vec3(0.8, 0.8, 1.0);
void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec3 col = mix(col1, col2, uv.y);
    // Plus on s'éloigne du centre de l'écran, plus p devient grand (entre 0 et 1)
    vec2 p = 2.0 * uv - 1.0;
    // Idem pour l mais plus rapidement
    float l = length(p * 1.8);
    float t = iTime * .2;// On ralentit le temps
    for(int i=0; i<3; i++) {
        // Donc p / l devient de plus en plus petit
        // t devient de plus en plus grand avec le temps
        uv += p / l * (cos(t - l + 20.0));
        col[i] = .08 / length(mod(uv, 5.0) - 2.5);
    }
    col /= mix(col1, col2, uv.y);
    gl_FragColor = vec4(col / l, 0.0);
}