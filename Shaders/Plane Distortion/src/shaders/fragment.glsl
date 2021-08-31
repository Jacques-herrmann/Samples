uniform float mixer;
uniform sampler2D tCurrentView;
uniform sampler2D tNextView;
uniform vec2 uCenter;
varying vec2 vUv;

//ide
//https://www.decarpentier.nl/lens-distortion

//distort method from 
// https://www.imaginationtech.com/blog/speeding-up-gpu-barrel-distortion-correction-in-mobile-vr/


vec2 offsetX(vec2 st, float offset) {
    vec2 offsetPosition = st;
    offsetPosition.x = mod(st.x + offset - 0.5, 1.0);
    return offsetPosition;
}

vec2 distort(vec2 st, float alpha, float expo ){
    vec2 p1 = vec2(2.0 * st - 1.0); // Transform pixel position to -1 - 1

    // float distanceToCenter = distance(p1, uCenter); // Anime arround the center
    float distanceToCenter = length(p1);
    vec2 p2 = p1 / (1.0 - alpha * distanceToCenter * expo);

    return (p2 + 1.0) * 0.5;
}


void main() {

    float t = mixer;
    float tr = smoothstep( 0.75,1., t );
    float e = t * 4.;
    // vec2 offsetPosition = offsetX(vUv, uCenter.x);
    vec2 uv = vUv;
    
    
    //stretch out current scene
    if(mixer != 0.0) { 
        uv = distort(vUv, -10. * pow( .5 + t * .5, 32. ), e );
        uv = offsetX(uv, uCenter.x);
    }
    
    vec4 currentView = texture2D( tCurrentView, uv );
    
    //pinch in new scene
    uv = distort(vUv, -10. * ( 1. - tr ), e );
    uv = offsetX(uv, uCenter.x);
    vec4 nextView = texture2D( tNextView, uv );
    
    gl_FragColor = mix( currentView, nextView, tr );
}