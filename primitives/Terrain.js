/**
 * Terrain
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Terrain class, representing a 3D surface.
  */
class Terrain extends Plane {
		/**
		 * @constructor constructor of the class Terrain.
		 * @param {scene of the application} scene
		 */
		constructor(scene, idTexture, idHeightMap, parts, heightScale) {
				super(scene, parts, parts);

				this.idTexture = new CGFtexture(this.scene, idTexture);
        this.idHeightMap = new CGFtexture(this.scene, idHeightMap);
        this.heightScale = heightScale;

				this.shader = new CGFshader(this.scene.gl, "./shaders/terrain.vert", "./shaders/terrain.frag");
				this.shader.setUniformsValues({heightScale: this.heightScale, uSampler2: 1});
	  };

		display() {
				this.scene.setActiveShader(this.shader);

				this.idTexture.bind();
				this.idHeightMap.bind(1);

				this.nurbsPlane.display();

				this.scene.setActiveShader(this.scene.defaultShader);
		};
};
