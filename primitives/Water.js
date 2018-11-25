/**
 * Water
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Water class, representing a moving water surface.
  */
class Water extends Plane {
		/**
		 * @constructor constructor of the class Water.
		 * @param {scene of the application} scene
		 */
		constructor(scene, idTexture, idWaveMap, parts, heightScale, texScale) {
				super(scene, parts, parts);

				this.idTexture = new CGFtexture(this.scene, idTexture);
        this.idWaveMap = new CGFtexture(this.scene, idWaveMap);
        this.heightScale = heightScale;
        this.texScale = texScale;
        this.factor = 0;

				this.shader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");
				this.shader.setUniformsValues({heightScale: this.heightScale, texScale: this.texScale, uSampler2: 1});
	  };

		display() {
				this.scene.setActiveShader(this.shader);

				this.idTexture.bind(0);
				this.idWaveMap.bind(1);

				this.nurbsPlane.display();

				this.scene.setActiveShader(this.scene.defaultShader);
		};

    update() {
        this.factor += 0.005;
        this.factor %= 1;
        this.shader.setUniformsValues({timeFactor: this.factor});
    };
};
