// -- precision mediump float; // Mandatory | Decide how precise can a float be.

uniform vec3 uColor;
uniform sampler2D uTexture;
// To take pixel colors from a texture and apply them in the fragment shader, we must use the texture2D() function. The
// first parameter is the texture, the second parameter are the coordinates of where to pick the color on that texture.

varying float vElevation;
varying vec2 vUv;

void main() {

    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.5;

    // gl_FragColor is an existing variable that we need to assign. It will contain the color of the fragment
    // -> vec4(r, g, b, a). Don't forget to activate the transparent to use the alpha.
    //  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    //  gl_FragColor = vec4(uColor, 1.0);
    //  gl_FragColor.z = vElevation * 5.0;

    gl_FragColor = textureColor;
}