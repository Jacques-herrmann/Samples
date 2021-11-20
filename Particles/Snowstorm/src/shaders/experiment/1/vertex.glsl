 uniform float uTime;
 uniform float uSize;
 uniform float uMaxHeight;
 uniform float uMinY;

 attribute float aRandomness;
 attribute float aScale;

 varying vec3 vColor;

 void main() {
     // Falling particle
     vec3 fallingPosition = position;
     fallingPosition.y = uMinY + mod(position.y - (uTime * aRandomness), uMaxHeight);

     // Rotating
     vec3 rotatingPosition = fallingPosition;
     rotatingPosition.x += sin(uTime) * aRandomness / position.x;
     rotatingPosition.z += cos(uTime);

     vec4 modelPosition = modelMatrix * vec4(rotatingPosition, 1.0);
     vec4 viewPosition = viewMatrix * modelPosition;
     vec4 projectedPosition = projectionMatrix * viewPosition;

     gl_Position = projectedPosition * 10.0;
     gl_PointSize = uSize * aScale;

     vColor = color*aRandomness/2.0;
 }