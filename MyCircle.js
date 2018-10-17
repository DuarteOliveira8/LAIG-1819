/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCircle extends CGFobject
{

	constructor(scene, slices, radius)
	{
		super(scene);
		this.radius = radius;
		this.slices = slices;
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.originalTexCoords = [];
		this.texCoords = [];

		this.initBuffers();
  };

	initBuffers()
	{
		// VERTICES DEFINITION
		var degToRad = Math.PI / 180;

		var angle = 0;
		for (var i = 0; i < this.slices; i++) {
			this.vertices.push(Math.cos(angle * degToRad)*this.radius, Math.sin(angle * degToRad)*this.radius, 0);
			angle += 360/this.slices;
		}
		this.vertices.push(0,0,0);

		// INDICES DEFINITION
		for (var i = 0; i < this.slices; i++) {
			this.indices.push(this.vertices.length/3-1,i,(i+1)%this.slices);
		}

		// NORMALS DEFINITION
		angle = 0;
		for (var i = 0; i < this.vertices.length/3; i++) {
			this.normals.push(0, 0, 1);
		}

		//TEXTURE DEFINITION
		var angle = 0;
		for (var i = 0; i < this.slices; i++) {
			this.originalTexCoords.push(0.5+Math.cos(angle*degToRad)/2, 0.5-Math.sin(angle*degToRad)/2);
			angle += 360/this.slices;
		}
		this.originalTexCoords.push(0.5, 0.5);
		this.texCoords = this.originalTexCoords.slice();


		this.primitiveType=this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};

	updateTexCoords(s, t) {
			this.texCoords = this.originalTexCoords.slice();

			for (var i = 0; i < this.texCoords.length; i+=2) {
					this.texCoords[i] *= s;
					this.texCoords[i+1] *= t;
			}

			this.updateTexCoordsGLBuffers();
	}
};
