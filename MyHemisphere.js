/**
 * MyHemisphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyHemisphere extends CGFobject
{
	constructor(scene, slices, stacks, minS, maxS, minT, maxT) 
	{
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		this.vertices = [];
		this.indices = [];
		this.normals = [];

		this.minS = minS || 0;
		this.maxS = maxS || 1;
		this.minT = minT || 0;
		this.maxT = maxT || 1;
		this.texCoords = [];

		this.initBuffers();
	};

	initBuffers() 
	{
		// VERTICES DEFINITION
		var degToRad = Math.PI / 180;
		var substack = 1/this.stacks;
		var k = 0;
		var verticesN = this.slices*2;
		var m;
		var angleFiInc = 90/this.stacks;
		var incS = Math.abs(this.maxS - this.minS)/(this.slices);
		var incT = Math.abs(this.maxT - this.minT)/(this.stacks);

		var angleFi = 0;
		for (var j = 0; j < this.stacks; j++) {
			m = (this.slices * 2 + 2) * j;

			var angleTeta = 0;
			k = m;
			for (var i = 0; i < this.slices; i++) {
				// VERTICES DEFINITION
				this.vertices.push(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad), Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad), Math.cos(angleFi * degToRad));
				this.vertices.push(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad), Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad), Math.cos((angleFi+angleFiInc) * degToRad));

				// INDICES DEFINITION
				this.indices.push(k, k+1, k+2);
				this.indices.push(k+3, k+2, k+1);
				k += 2;

				// NORMALS DEFINITION
				this.normals.push(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad), Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad), Math.cos(angleFi * degToRad));
				this.normals.push(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad), Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad), Math.cos((angleFi+angleFiInc) * degToRad));

				// TEXTURE COORDS
				this.texCoords.push(0.5+(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad))/2, 0.5-(Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad))/2);
				this.texCoords.push(0.5+(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad))/2, 0.5-(Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad))/2);

				angleTeta += 360/this.slices;
			}
			this.vertices.push(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad), Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad), Math.cos(angleFi * degToRad));
			this.vertices.push(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad), Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad), Math.cos((angleFi+angleFiInc) * degToRad));
			this.normals.push(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad), Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad), Math.cos(angleFi * degToRad));
			this.normals.push(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad), Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad), Math.cos((angleFi+angleFiInc) * degToRad));
			this.texCoords.push(0.5+(Math.sin(angleFi * degToRad) * Math.cos(angleTeta * degToRad))/2, 0.5-(Math.sin(angleFi * degToRad) * Math.sin(angleTeta * degToRad))/2);
			this.texCoords.push(0.5+(Math.sin((angleFi+angleFiInc) * degToRad) * Math.cos(angleTeta * degToRad))/2, 0.5-(Math.sin((angleFi+angleFiInc) * degToRad) * Math.sin(angleTeta * degToRad))/2);

			angleFi += angleFiInc;
		}
		this.texCoords.push(0.5, 0.5);

		this.initGLBuffers();
	};
	
};
