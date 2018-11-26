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
		 * @constructor constructor of the class Terrain.
		 * @param {Scene of the application.} scene
		 * @param {File of the terrain color texture.} idTexture
		 * @param {File of the terrain wave map.} idWaveMap
		 * @param {Number of parts. Creates a n x n plane.} parts
		 * @param {Scale factor of the height transformation.} heightScale
		 * @param {Scale factor of the water texture.} texScale
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

		/**
	   * Sets the current shader and displays the terrain.
	   */
		display() {
				this.scene.setActiveShader(this.shader);

				this.idTexture.bind(0);
				this.idWaveMap.bind(1);

				this.nurbsPlane.display();

				this.scene.setActiveShader(this.scene.defaultShader);
		};

		/**
	   * Updates the time factor of the shader based ont time.
	   */
    update() {
        this.factor += 0.005;
        this.factor %= 1;
        this.shader.setUniformsValues({timeFactor: this.factor});
    };
};
