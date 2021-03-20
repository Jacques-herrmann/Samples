uniform float u_progress;
uniform float u_direction;
uniform float u_offset;
uniform float u_time;
varying vec2 vUv;

void main(){
    vec3 pos = position.xyz;
    float distance = length(uv.xy - 0.5);
    float maxDistance = length(vec2(0.5, 0.5));
    float normalizedDistance = distance/maxDistance;

    // Stick
	float stickOutEffect = normalizedDistance;
	float stickInEffect = -normalizedDistance;
	float stickEffect = mix(stickOutEffect, stickInEffect, u_direction);

	// Wave
	float stick = 0.5;
    float waveIn = u_progress*(1. / stick); // 0 -> 1 -> 2
    float waveOut =  -( u_progress - 1.) * (1./(1.-stick) ); // 2 -> 1 -> 0
    waveOut = pow(smoothstep(0.,1.,waveOut),0.7); // Smooth
    float stickProgress = min(waveIn, waveOut); // 0 -> 1 -> 1 * smooth

    // Move Backward and Forward
    float offsetIn = clamp(waveIn,0.,1.);
    float offsetOut = clamp(1.-waveOut,0.,1.);
	float offsetProgress = mix(offsetIn,offsetOut,u_direction);

	pos.z += stickEffect * u_offset * stickProgress - u_offset * offsetProgress;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vUv = uv;
}