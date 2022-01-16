uniform float uSize;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uTextureRatio;
uniform vec2 uCursor;
uniform float uLoopRadius;
uniform float uLoopScale;
uniform float uColorMask;
uniform float uProgress;

varying vec3 vColor;

void main() {
    float progress = 1.0;
    vec2 picCoord = vec2(0.5 + (position.x / 2.0), 0.5 + (position.y / (2.0 * uTextureRatio)));

    // Loop effect
    float distance = distance(uCursor, position.xy);
    bool isMovingX = ((1.0 - step(uLoopRadius, distance)) != 0.0) && uCursor.x != 0.0;
    bool isMovingY = ((1.0 - step(uLoopRadius, distance)) != 0.0) && uCursor.y != 0.0;

    vec2 displacement = vec2(
    - 0.15 * (position.x - uCursor.x),
    - 0.15 * (position.y - uCursor.y)
    );

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x += float(isMovingX) * displacement.x;
    modelPosition.y += float(isMovingY) * displacement.y;

    // Exploding effect
    modelPosition.x += float(isMovingX) *  uProgress * 2.0 * (modelPosition.x - uCursor.x);
    modelPosition.y += float(isMovingY) * uProgress * 2.0 * (modelPosition.y - uCursor.y);
    modelPosition.z += float(isMovingX || isMovingY) * 4.0 * uProgress * modelPosition.z;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = uSize * 0.5 + float(isMovingX || isMovingY) * uLoopScale;

    vec4 picColor = texture(uTexture, picCoord);

    // Color Mask
    picColor.r = mod((picColor.r + uColorMask), 1.01);
    picColor.g = mod((picColor.g + uColorMask), 1.01);
    picColor.b = mod((picColor.b + uColorMask), 1.01);

    vColor = picColor.rgb;
}