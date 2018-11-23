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
	 * @constructor Constructor of the class MyCylinder.
 	 * @param {scene of the application} scene
 	 * @param {base radius} base
 	 * @param {top radius} top
 	 * @param {height of the cylinder} height
 	 * @param {slices of the cylinder} slices
 	 * @param {stacks of the cylinder} stacks
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

  createSurface() {
			let weight = Math.pow(2, 1/2)/2;
			let controlPoints = [
											        [
												          [ 0, -0.5*this.height, 1*this.base, weight ],
												          [ 0,  0.5*this.height, 1*this.top, weight ]
											        ],
															[
																	[ 1*this.base, -0.5*this.height, 1*this.base, weight ],
																	[ 1*this.top,  0.5*this.height, 1*this.top, weight ]
											        ],
											        [
																	[ 1*this.base, -0.5*this.height, 0, 1/weight ],
																	[ 1*this.top,  0.5*this.height, 0, 1/weight ]
											        ],
											        [
																	[ 1*this.base, -0.5*this.height, -1*this.base, weight ],
																	[ 1*this.top,  0.5*this.height, -1*this.top, weight ]
											        ],
											        [
																	[ 0, -0.5*this.height, -1*this.base, weight ],
																	[ 0,  0.5*this.height, -1*this.top, weight ]
											        ]
										      ];

			let nurbsSurface = new CGFnurbsSurface(4, 1, controlPoints);

			this.nurbsPlane = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);
  };

	getPoint(u, v) {
			this.nurbsPlane.evalObj.getPoint(u, v);
	};

	display() {
			this.nurbsPlane.display();

			this.scene.pushMatrix();
					this.scene.rotate(Math.PI, 0, 1, 0);
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
