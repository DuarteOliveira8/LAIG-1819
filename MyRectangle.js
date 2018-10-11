/**
 * MyRectangle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyRectangle extends CGFobject
{
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

		this.initBuffers();
	};

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

		this.texCoords = [
			this.maxS, this.minT,
			this.minS, this.minT,
			this.minS, this.maxT,
			this.maxS, this.maxT
		];

		this.initGLBuffers();
	};
};
