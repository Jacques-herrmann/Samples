uniform vec2 iResolution;
uniform float iTime;
varying vec2 vUv;
vec3 col1 = vec3(1.0, 0.8, 0.5);
vec3 col2 = vec3(0.8, 0.8, 1.0);
void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
//    uv = vUv;
    vec3 col = mix(col1, col2, (uv.y - uv.x) * sin(iTime * .5));
    gl_FragColor = vec4(col , 0.0);
}