/**
 * Terrain
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Terrain class, representing a 3D terrain surface.
 * @extends Plane
 */
class Terrain extends Plane {
	/**
	 * Constructor of the class Terrain.
	 * @param {CGFscene} scene Scene of the application.
	 * @param {String} idTexture File of the terrain color texture.
	 * @param {String} idHeightMap File of the terrain height map.
	 * @param {Number} parts Number of parts. Creates a n x n plane.
	 * @param {Number} heightScale Scale factor of the height transformation.
	 */
	constructor(scene, idTexture, idHeightMap, parts, heightScale) {
		super(scene, parts, parts);

		this.idTexture = new CGFtexture(this.scene, idTexture);
	    this.idHeightMap = new CGFtexture(this.scene, idHeightMap);
	    this.heightScale = heightScale;

		this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
		this.shader.setUniformsValues({heightScale: this.heightScale, uSampler2: 1});
  	};

	/**
	 * Sets the current shader and displays the terrain.
	 */
	display() {
		this.scene.setActiveShader(this.shader);

		this.idTexture.bind();
		this.idHeightMap.bind(1);

		this.nurbsPlane.display();

		this.scene.setActiveShader(this.scene.defaultShader);
	};
};
