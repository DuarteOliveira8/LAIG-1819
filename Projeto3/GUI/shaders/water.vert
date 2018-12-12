attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float heightScale;
uniform float texScale;
uniform float timeFactor;

uniform sampler2D uSampler2;

varying vec2 vTextureCoord;

void main() {
    vec3 offset = vec3(0.0, 1.0, 0.0);

    vTextureCoord = aTextureCoord*texScale;

    offset = aVertexNormal*texture2D(uSampler2, aTextureCoord+timeFactor).b*heightScale;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
