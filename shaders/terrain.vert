mat4 uMVMatrix;
mat4 uPMatrix;
mat4 uNMatrix;

bool uUseTexture;

vec3 aVertexPosition;
vec3 aVertexNormal;
vec2 aTextureCoord;

varying vec2 vTextureCoord;

uniform float heightScale;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = aTextureCoord;
}
