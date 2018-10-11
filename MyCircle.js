/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCircle extends CGFobject
{

	constructor(scene, slices)
	{
		super(scene);
		this.slices = slices;
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		this.initBuffers();
  };

	initBuffers()
	{
		// VERTICES DEFINITION
		var degToRad = Math.PI / 180;

		var angle = 0;
		for (var i = 0; i < this.slices; i++) {
			this.vertices.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), 0);
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
			this.texCoords.push(0.5+Math.cos(angle*degToRad)/2, 0.5-Math.sin(angle*degToRad)/2);
			angle += 360/this.slices;
		}
		this.texCoords.push(0.5, 0.5);


		this.primitiveType=this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};
};
