/**
 * MyCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);

		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;
		this.vertices = [];
		this.indices = [];
		this.normals = [];

		// this.minS = minS || 0;
		// this.maxS = maxS || 1;
		// this.minT = minT || 0;
		// this.maxT = maxT || 1;
		// this.texCoords = [];

		this.initBuffers();
	};

	initBuffers()
	{
		// VERTICES DEFINITION
		var degToRad = Math.PI / 180;
		var substack = this.height/this.stacks;
		var radiusInc = (this.top - this.base)/this.stacks;
		var currentRadius = this.base;
		var k = 0;
		var verticesN = this.slices*2;
		var m;
		// var incS = Math.abs(this.maxS - this.minS)/(this.slices);
		// var incT = Math.abs(this.maxT - this.minT)/(this.stacks);

		var z = 0;
		for (var j = 0; j < this.stacks; j++) {
			m = (verticesN + 2) * j;

			var angle = 0;
			k = m;
			for (var i = 0; i < this.slices; i++) {
				// VERTICES DEFINITION
				this.vertices.push(Math.cos(angle * degToRad)*currentRadius, Math.sin(angle * degToRad)*currentRadius, z);
				this.vertices.push(Math.cos(angle * degToRad)*(currentRadius + radiusInc), Math.sin(angle * degToRad)*(currentRadius + radiusInc), z+substack);

				// INDICES DEFINITION
				this.indices.push(k+2, k+1, k);
				this.indices.push(k+1, k+2, k+3);
				k += 2;

				// NORMALS DEFINITION
				this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), 0);
				this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), 0);
				angle += 360/this.slices;

				// TEXTURE COORDS
				// this.texCoords.push(this.minS + i*incS, this.minT + j*incT);
				// this.texCoords.push(this.minS + i*incS, this.minT + (j+1)*incT);
			}
			this.vertices.push(Math.cos(angle * degToRad)*currentRadius, Math.sin(angle * degToRad)*currentRadius, z);
			this.vertices.push(Math.cos(angle * degToRad)*(currentRadius + radiusInc), Math.sin(angle * degToRad)*(currentRadius + radiusInc), z+substack);
			this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), 0);
			this.normals.push(Math.cos(angle * degToRad), Math.sin(angle * degToRad), 0);
			// this.texCoords.push(1,this.minT + j*incT);
			// this.texCoords.push(1,this.minT + (j+1)*incT);

			currentRadius += radiusInc;
			z+= substack;
		}

		this.initGLBuffers();
	};

};
