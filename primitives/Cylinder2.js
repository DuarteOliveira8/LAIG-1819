/**
 * Cylinder2
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Cylinder2 class, representing the NURBS version of the cylinder primitive without covers.
  */
class Cylinder2 extends CGFobject {
	/**
	 * @constructor Constructor of the class Cylinder2.
 	 * @param {scene of the application.} scene
 	 * @param {base radius.} base
 	 * @param {top radius.} top
 	 * @param {height of the cylinder.} height
 	 * @param {slices of the cylinder.} slices
 	 * @param {stacks of the cylinder.} stacks
	 */
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);

		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.createSurface();
	};

	/**
   * Creates the NURBS surface using the WebCGF library. It creates a quarter of a cylinder.
   */
  createSurface() {
			let weight = Math.pow(2, 1/2)/2;
			let controlPoints = [
											        [
																	[this.base, 0, 0, 1],
																	[this.top, 0, this.height, 1]
											        ],
															[
																	[this.base, this.base, 0, weight],
																	[this.top, this.top, this.height, weight]
											        ],
											        [
																	[0, this.base, 0, 1],
																	[0, this.top, this.height, 1]
											        ]
										      ];

			let nurbsSurface = new CGFnurbsSurface(2, 1, controlPoints);

			this.nurbsPlane = new CGFnurbsObject(this.scene, this.slices/4, this.stacks/4, nurbsSurface);
  };

	/**
	 * Returns a specific vertex of the cylinder.
	 * @param {u coordinate of the point.} u
	 * @param {v coordinate of the point.} v
	 */
	getPoint(u, v) {
			this.nurbsPlane.evalObj.getPoint(u, v);
	};

	/**
	 * Displays all four quarters of the cylinder.
	 */
	display() {
			this.nurbsPlane.display();

			this.scene.pushMatrix();
					this.scene.rotate(Math.PI/2, 0, 0, 1);
					this.nurbsPlane.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
					this.scene.rotate(Math.PI, 0, 0, 1);
					this.nurbsPlane.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
					this.scene.rotate(3*Math.PI/2, 0, 0, 1);
					this.nurbsPlane.display();
			this.scene.popMatrix();
	};

	/**
	 * Updates the texture coordinates.
 	 * @param {s texture coordinate} s
 	 * @param {t texture coordinate} t
	 */
	updateTexCoords(s, t) {};

};
