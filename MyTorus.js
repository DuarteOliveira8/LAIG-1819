/**
 * MyTorus
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTorus extends CGFobject
{

	constructor(scene, inner, outer, slices, loops)
	{
		super(scene);
		this.inner = inner;
		this.outer = outer;
		this.slices = slices;
		this.loops = loops;
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		// this.texCoords = [];

		this.initBuffers();
  };

	initBuffers()
	{
		var degToRad = Math.PI / 180;
    var innerAngleInc = 360/this.slices;
    var outerAngleInc = 360/this.loops;
		var verticesN = this.slices*2;
		var m, k;

    var outerAngle = 0;

    for (var i = 0; i < this.loops; i++) {
        var innerAngle = 0;
				m = (verticesN + 2) * i;
				k = m;
        for (var j = 0; j < this.slices; j++) {
            this.vertices.push((this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos(outerAngle*degToRad),
															 (this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin(outerAngle*degToRad),
														 	 this.inner*Math.sin(innerAngle*degToRad)
														 	);
						this.vertices.push((this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos((outerAngle + outerAngleInc)*degToRad),
															 (this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin((outerAngle + outerAngleInc)*degToRad),
														 	 this.inner*Math.sin(innerAngle*degToRad)
														 	);

						this.indices.push(k, k+1, k+2);
						this.indices.push(k+3, k+2, k+1);
						k += 2;

						this.normals.push((this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos(outerAngle*degToRad),
														  (this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin(outerAngle*degToRad),
													 	  this.inner*Math.sin(innerAngle*degToRad)
														 );
						this.normals.push((this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos((outerAngle + outerAngleInc)*degToRad),
															(this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin((outerAngle + outerAngleInc)*degToRad),
															this.inner*Math.sin(innerAngle*degToRad)
														 );

            innerAngle += innerAngleInc;
        }
				this.vertices.push((this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos(outerAngle*degToRad),
													 (this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin(outerAngle*degToRad),
													 this.inner*Math.sin(innerAngle*degToRad)
													);
				this.vertices.push((this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos((outerAngle + outerAngleInc)*degToRad),
													 (this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin((outerAngle + outerAngleInc)*degToRad),
													 this.inner*Math.sin(innerAngle*degToRad)
													);
				this.normals.push((this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos(outerAngle*degToRad),
													(this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin(outerAngle*degToRad),
													this.inner*Math.sin(innerAngle*degToRad)
												 );
				this.normals.push((this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.cos((outerAngle + outerAngleInc)*degToRad),
													(this.outer + this.inner*Math.cos(innerAngle*degToRad))*Math.sin((outerAngle + outerAngleInc)*degToRad),
													this.inner*Math.sin(innerAngle*degToRad)
												 );


        outerAngle += outerAngleInc;
    }

		this.primitiveType=this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};
};
