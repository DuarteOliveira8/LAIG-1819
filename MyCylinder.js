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

		this.minS = 0;
		this.maxS = 1;
		this.minT = 0;
		this.maxT = 1;
		this.originalTexCoords = [];
		this.texCoords = [];

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
		var incS = Math.abs(this.maxS - this.minS)/(this.slices);
		var incT = Math.abs(this.maxT - this.minT)/(this.stacks);
		console.log((Math.atan((radiusInc/substack))/degToRad));
		var inclineAngle = 90-(Math.atan((substack/this.base))/degToRad);

		var z = 0;
		for (var j = 0; j < this.stacks; j++) {
			m = (verticesN + 2) * j;

			var angle = 0;
			k = m;
			for (var i = 0; i <= this.slices; i++) {
				// VERTICES DEFINITION
				this.vertices.push(Math.cos(angle * degToRad)*currentRadius, Math.sin(angle * degToRad)*currentRadius, z);
				this.vertices.push(Math.cos(angle * degToRad)*(currentRadius + radiusInc), Math.sin(angle * degToRad)*(currentRadius + radiusInc), z+substack);

				// INDICES DEFINITION
				if (i != this.slices) {
						this.indices.push(k+2, k+1, k);
						this.indices.push(k+1, k+2, k+3);
						k += 2;
				}

				// NORMALS DEFINITION
				var nx1 = Math.cos(angle * degToRad);
				var ny1 = Math.sin(angle * degToRad);
				var nz1 = Math.sin(inclineAngle * degToRad);
				var length1 = Math.sqrt(nx1*nx1 + ny1*ny1 + nz1*nz1);
				this.normals.push(nx1/length1, ny1/length1, nz1/length1);

				var nx2 = Math.cos(angle * degToRad);
				var ny2 = Math.sin(angle * degToRad);
				var nz2 = Math.sin(inclineAngle * degToRad);
				var length2 = Math.sqrt(nx2*nx2 + ny2*ny2 + nz2*nz2);
				this.normals.push(nx2/length2, ny2/length2, nz2/length2);

				angle += 360/this.slices;

				// TEXTURE COORDS
				this.originalTexCoords.push(this.minS + i*incS, this.minT + j*incT);
				this.originalTexCoords.push(this.minS + i*incS, this.minT + (j+1)*incT);
			}

			currentRadius += radiusInc;
			z+= substack;
		}

		this.texCoords = this.originalTexCoords.slice();

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
