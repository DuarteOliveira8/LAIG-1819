/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * MyRectangle class, representing the rectangle primitive.
  */
class MyRectangle extends CGFobject
{
	/**
	 * @constructor constructor of the class MyRectangle.
	 * @param {Scene of the application.} scene
	 * @param {x coordinate of the first vertex.} x1
	 * @param {y coordinate of the first vertex.} y1
	 * @param {x coordinate of the opposing vertex.} x2
	 * @param {y coordinate of the opposing vertex.} y2
	 */
	constructor(scene, x1, y1, x2, y2)
	{
		super(scene);

		this.minS = 0.0;
		this.maxS = 1.0;
		this.minT = 0.0;
		this.maxT = 1.0;

		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;

		this.originalTexCoords = [];
		this.texCoords = [];

		this.initBuffers();
	};

	/**
	*	Prepares the buffer to display the rectangle primitive.
	*/
	initBuffers()
	{
		this.vertices = [
			this.x2, this.y2, 0,
			this.x1, this.y2, 0,
			this.x1, this.y1, 0,
			this.x2, this.y1, 0
		];

		this.indices = [
			3, 0, 1,
			1, 2, 3
		];

		this.primitiveType=this.scene.gl.TRIANGLES;

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.originalTexCoords = [
			this.maxS*(this.x2-this.x1), this.minT*(this.y2-this.y1),
			this.minS*(this.x2-this.x1), this.minT*(this.y2-this.y1),
			this.minS*(this.x2-this.x1), this.maxT*(this.y2-this.y1),
			this.maxS*(this.x2-this.x1), this.maxT*(this.y2-this.y1)
		];

		this.texCoords = this.originalTexCoords.slice();

		this.initGLBuffers();
	};

	/**
	* Updates the texture coordinates.
	* @param {s texture coordinate.} s
	* @param {t texture coordinate.} t
	*/
	updateTexCoords(s, t) {
			this.texCoords = this.originalTexCoords.slice();

			for (var i = 0; i < this.texCoords.length; i++) {
					this.texCoords[i] /= s;
					this.texCoords[++i] /= t;
			}

			this.updateTexCoordsGLBuffers();
	};
};
