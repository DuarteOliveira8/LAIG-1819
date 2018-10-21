/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * MySphere class, representing the sphere primitive.
  */
class MySphere extends CGFobject
{
	/**
	 * @constructor constructor of the class MySphere.
	 */
	constructor(scene, radius, slices, stacks)
	{
		super(scene);

		this.radius = radius;
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

	/**
	*	Prepares the buffer to display the sphere primitive.
	*/
	initBuffers()
	{
		// VERTICES DEFINITION
		var degToRad = Math.PI / 180;
		var k = 0;
		var verticesN = this.slices*2;
		var m;
		var anglePhiInc = 180/this.stacks;
		var angleThetaInc = 360/this.slices;
		var incS = Math.abs(this.maxS - this.minS)/(this.slices);
		var incT = Math.abs(this.maxT - this.minT)/(this.stacks);

		var anglePhi = 0;
		for (var j = 0; j < this.stacks; j++) {
			m = (verticesN + 2) * j;

			var angleTheta = 0;
			k = m;
			for (var i = 0; i <= this.slices; i++) {
				// VERTICES DEFINITION
				this.vertices.push((Math.sin(anglePhi * degToRad) * Math.cos(angleTheta * degToRad))*this.radius, (Math.sin(anglePhi * degToRad) * Math.sin(angleTheta * degToRad))*this.radius, (Math.cos(anglePhi * degToRad))*this.radius);
				this.vertices.push((Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.cos(angleTheta * degToRad))*this.radius, (Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.sin(angleTheta * degToRad))*this.radius, (Math.cos((anglePhi+anglePhiInc) * degToRad))*this.radius);

				// INDICES DEFINITION
				if (i != this.slices) {
						this.indices.push(k, k+1, k+2);
						this.indices.push(k+3, k+2, k+1);
						k += 2;
				}

				// NORMALS DEFINITION
				var nx1 = Math.sin(anglePhi * degToRad) * Math.cos(angleTheta * degToRad);
				var ny1 = Math.sin(anglePhi * degToRad) * Math.sin(angleTheta * degToRad);
				var nz1 = Math.cos(anglePhi * degToRad);
				var length1 = Math.sqrt(nx1*nx1 + ny1*ny1 + nz1*nz1);
				this.normals.push(nx1/length1, ny1/length1, nz1/length1);

				var nx2 = Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.cos(angleTheta * degToRad);
				var ny2 = Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.sin(angleTheta * degToRad);
				var nz2 = Math.cos((anglePhi+anglePhiInc) * degToRad);
				var length2 = Math.sqrt(nx2*nx2 + ny2*ny2 + nz2*nz2);
				this.normals.push(nx2/length2, ny2/length2, nz2/length2);

				// TEXTURE COORDS
				this.originalTexCoords.push(0.5+(Math.sin(anglePhi * degToRad) * Math.cos(angleTheta * degToRad))/2, 0.5-(Math.sin(anglePhi * degToRad) * Math.sin(angleTheta * degToRad))/2);
				this.originalTexCoords.push(0.5+(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.cos(angleTheta * degToRad))/2, 0.5-(Math.sin((anglePhi+anglePhiInc) * degToRad) * Math.sin(angleTheta * degToRad))/2);

				angleTheta += angleThetaInc;
			}

			anglePhi += anglePhiInc;
		}
		this.originalTexCoords.push(0.5, 0.5);

		this.texCoords = this.originalTexCoords.slice();

		this.initGLBuffers();
	};

	/**
	* Updates the texture coordinates.
	* @param {s texture coordinate} s
	* @param {t texture coordinate} t
	*/
	updateTexCoords(s, t) {
			this.texCoords = this.originalTexCoords.slice();

			for (var i = 0; i < this.texCoords.length; i+=2) {
					this.texCoords[i] *= s;
					this.texCoords[i+1] *= t;
			}

			this.updateTexCoordsGLBuffers();
	};

};
