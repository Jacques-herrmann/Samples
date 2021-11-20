 uniform float uSize;
 uniform float uTime;

 attribute float aScale;

 varying vec3 vColor;

 void main() {
     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
     vec4 viewPosition = viewMatrix * modelPosition;
     vec4 projectedPosition = projectionMatrix * viewPosition;

     gl_Position = projectedPosition * 10.0;
     gl_PointSize = uSize * aScale;

     vColor = color;
 }