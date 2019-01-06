/**
 * MyTorus
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * MyTorus class, representing the torus primitive.
 * @extends CGFobject
 */
class MyTorus extends CGFobject {
	/**
	 * Constructor of the class MyTorus.
	 * @param {CGFscene} scene Scene of the application.
	 * @param {Number} inner Inner radius.
	 * @param {Number} outer Outer radius.
	 * @param {Number} slices Number of torus slices.
	 * @param {Number} loops Number of torus loops.
	 */
	constructor(scene, inner, outer, slices, loops) {
		super(scene);

		this.inner = inner;
		this.outer = outer;
		this.slices = slices;
		this.loops = loops;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.originalTexCoords = [];
		this.texCoords = [];

		this.minS = 0;
		this.maxS = 1;
		this.minT = 0;
		this.maxT = 1;

		this.initBuffers();
  	};

	/**
	 * Prepares the buffer to display the torus primitive.
	 */
	initBuffers() {
		var degToRad = Math.PI / 180;
		var innerAngleInc = 360/this.slices;
		var outerAngleInc = 360/this.loops;
		var verticesN = this.slices*2;
		var m, k;
		var incS = 1/this.loops;
		var incT = 1/this.slices;

	    var outerAngle = 0;

	    for (var i = 0; i < this.loops; i++) {
	        var innerAngle = 0;
			m = (verticesN + 2) * i;
			k = m;
	        for (var j = 0; j <= this.slices; j++) {
				var x1 = (this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos(outerAngle*degToRad);
				var y1 = (this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin(outerAngle*degToRad);
				var z1 = this.inner*Math.sin(innerAngle*degToRad);
	            this.vertices.push(x1, y1, z1);

				var x2 = (this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos((outerAngle + outerAngleInc)*degToRad);
				var y2 = (this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin((outerAngle + outerAngleInc)*degToRad);
				var z2 = this.inner*Math.sin(innerAngle*degToRad);
				this.vertices.push(x2, y2, z2);

				if (j != this.slices) {
					this.indices.push(k, k+1, k+2);
					this.indices.push(k+3, k+2, k+1);
					k += 2;
				}

				var nx1 = this.inner*Math.cos(innerAngle*degToRad)*Math.cos(outerAngle*degToRad);
				var ny1 = this.inner*Math.cos(innerAngle*degToRad)*Math.sin(outerAngle*degToRad);
				var nz1 = this.inner*Math.sin(innerAngle*degToRad);
				var length1 = Math.sqrt(nx1*nx1 + ny1*ny1 + nz1*nz1);
    			this.normals.push(nx1/length1, ny1/length1, nz1/length1);

				var nx2 = this.inner*Math.cos(innerAngle*degToRad)*Math.cos((outerAngle + outerAngleInc)*degToRad);
				var ny2 = this.inner*Math.cos(innerAngle*degToRad)*Math.sin((outerAngle + outerAngleInc)*degToRad);
				var nz2 = this.inner*Math.sin(innerAngle*degToRad);
				var length2 = Math.sqrt(nx2*nx2 + ny2*ny2 + nz2*nz2);
				this.normals.push(nx2/length2, ny2/length2, nz2/length2);

				this.originalTexCoords.push(1-i*incS, 1-j*incT);
				this.originalTexCoords.push(1-(i+1)*incS, 1-j*incT);

	            innerAngle += innerAngleInc;
	        }

	        outerAngle += outerAngleInc;
	    }

		this.primitiveType=this.scene.gl.TRIANGLES;

		this.texCoords = this.originalTexCoords.slice();

		this.initGLBuffers();
	};

	/**
     * Updates the texture coordinates.
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
	updateTexCoords(s, t) {
		this.texCoords = this.originalTexCoords.slice();

		for (var i = 0; i < this.texCoords.length; i+=2) {
			this.texCoords[i] /= s;
			this.texCoords[i+1] /= t;
		}

		this.updateTexCoordsGLBuffers();
	};

};
