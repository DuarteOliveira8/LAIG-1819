attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float heightScale;

uniform sampler2D uSampler2;

varying vec2 vTextureCoord;

void main() {
    vec3 offset = vec3(0.0, 1.0, 0.0);

    vTextureCoord = aTextureCoord;

    offset = aVertexNormal*texture2D(uSampler2, aTextureCoord).b*heightScale;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
