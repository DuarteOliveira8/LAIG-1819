/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MySphere extends CGFobject
{
	constructor(scene, radius, slices, stacks)
	{
		super(scene);

		this.radius = radius;
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
		var substack = (this.radius*2)/this.stacks;
		var k = 0;
		var verticesN = this.slices*2;
		var m;
		var anglePhiInc = 180/this.stacks;
		var angleThetaInc = 360/this.slices;
		// var incS = Math.abs(this.maxS - this.minS)/(this.slices);
		// var incT = Math.abs(this.maxT - this.minT)/(this.stacks);

		var anglePhi = 0;
		for (var j = 0; j < this.stacks; j++) {
			m = (verticesN + 2) * j;

			var angleTheta = 0;
			k = m;
			for (var i = 0; i < this.slices; i++) {
				// VERTICES DEFINITION
				this.vertices.push(Math.sin(anglePhi * degToRad) * Math.cos(angleTheta * degToRad), Math.sin(anglePhi * degToRad) * Math.sin(angleTheta * degToRad), Math.cos(anglePhi * degToRad));
				this.vertices.push(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.cos(angleTheta * degToRad), Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.sin(angleTheta * degToRad), Math.cos((anglePhi+anglePhiInc) * degToRad));

				// INDICES DEFINITION
				this.indices.push(k, k+1, k+2);
				this.indices.push(k+3, k+2, k+1);
				k += 2;

				// NORMALS DEFINITION
				this.normals.push(Math.sin(anglePhi * degToRad) * Math.cos(angleTheta * degToRad), Math.sin(anglePhi * degToRad) * Math.sin(angleTheta * degToRad), Math.cos(anglePhi * degToRad));
				this.normals.push(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.cos(angleTheta * degToRad), Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.sin(angleTheta * degToRad), Math.cos((anglePhi+anglePhiInc) * degToRad));

				// TEXTURE COORDS
				// this.texCoords.push(0.5+(Math.sin(anglePhi * degToRad) * Math.cos(angleTheta * degToRad))/2, 0.5-(Math.sin(anglePhi * degToRad) * Math.sin(angleTheta * degToRad))/2);
				// this.texCoords.push(0.5+(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.cos(angleTheta * degToRad))/2, 0.5-(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.sin(angleTheta * degToRad))/2);

				angleTheta += angleThetaInc;
			}
			this.vertices.push(Math.sin(anglePhi * degToRad) * Math.cos(angleTheta * degToRad), Math.sin(anglePhi * degToRad) * Math.sin(angleTheta * degToRad), Math.cos(anglePhi * degToRad));
			this.vertices.push(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.cos(angleTheta * degToRad), Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.sin(angleTheta * degToRad), Math.cos((anglePhi+anglePhiInc) * degToRad));
			this.normals.push(Math.sin(anglePhi * degToRad) * Math.cos(angleTheta * degToRad), Math.sin(anglePhi * degToRad) * Math.sin(angleTheta * degToRad), Math.cos(anglePhi * degToRad));
			this.normals.push(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.cos(angleTheta * degToRad), Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.sin(angleTheta * degToRad), Math.cos((anglePhi+anglePhiInc) * degToRad));
			// this.texCoords.push(0.5+(Math.sin(anglePhi * degToRad) * Math.cos(angleTheta * degToRad))/2, 0.5-(Math.sin(anglePhi * degToRad) * Math.sin(angleTheta * degToRad))/2);
			// this.texCoords.push(0.5+(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.cos(angleTheta * degToRad))/2, 0.5-(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.sin(angleTheta * degToRad))/2);

			anglePhi += anglePhiInc;
		}
		// this.texCoords.push(0.5, 0.5);

		this.initGLBuffers();
	};

};
