varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
