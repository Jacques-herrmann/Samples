// Each matrix will transform the position until we get the final clip space coordinates.
// To apply a matrix we need to multiply it. they must have the same size as the coordinate (mat4 for vec4)
// -- uniform mat4 projectionMatrix; // Transform the coordinates into the clip space coordinates
// -- uniform mat4 viewMatrix; // Apply transformations relative to the camera (position, rotation, FoV, ...)
// -- uniform mat4 modelMatrix; // Apply transformations relative to the Mesh (position, rotation and scale)

// Shorter version where the viewMatrix and the modelMatrix are combined into a modelViewMatrix.

// Custom uniforms
uniform vec2 uFrequency;
uniform float uTime;

// -- attribute vec3 position; // Position of the vertex given by the ThreeJS geometry
// -- attribute vec2 uv;
attribute float aRandom; // Custom attribute

varying float vElevation;
varying vec2 vUv;

void main() {
    // gl_Position is an existing variable that we need to assign. It will contain the position of the vertex on the
    // screen.
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1; // Waving the plane in fuction of the x position
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1; // Waving the plane in fuction of the y position
    modelPosition.z += elevation;
    // modelPosition.z += aRandom * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vElevation = elevation;
    vUv = uv;
}