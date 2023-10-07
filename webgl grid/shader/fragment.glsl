precision highp float;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform float uHit;
uniform sampler2D tMap;

varying vec2 vUv;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

void main() {
    vec2 ratio = vec2(
        min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
        min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );

    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 tex = texture2D(tMap, uv);
    float h = rgb2hsv(tex.rgb).x;

    float grey = (tex.r + tex.g + tex.b) / 3.0;

    float e = 0.05;
    float r = step(e, h) * (1. - step(1.-e, h));
    vec3 color = mix(vec3(grey, grey, grey), tex.rgb, uHit);
    gl_FragColor.rgb = color;

//    gl_FragColor.rgb = texture2D(tMap, uv).rgb;
    gl_FragColor.a = 1.0;
}