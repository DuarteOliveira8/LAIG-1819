/**
 * Plane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Plane class, representing a 2D surface.
  */
class Plane extends CGFobject {
		/**
		 * @constructor constructor of the class Plane.
		 * @param {scene of the application} scene
		 */
		constructor(scene, nPartsU, nPartsV) {
				super(scene);

				this.nPartsU = nPartsU;
				this.nPartsV = nPartsV;

				this.createSurface();
	  };

		/**
	   * Creates the NURBS surface using the WebCGF library.
	   */
		createSurface() {
				let nurbsSurface = new CGFnurbsSurface(1, 1,
						[
								[
										[-0.5, 0.0,  0.5, 1 ],
										[-0.5, 0.0, -0.5, 1 ]
								],
								[
										[0.5, 0.0,  0.5, 1 ],
										[0.5, 0.0, -0.5, 1 ]
								]
						]
				);

				this.nurbsPlane = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface);
		};

		/**
		 * Returns a specific vertex of the plane.
		 * @param {u coordinate of the point.} u
		 * @param {v coordinate of the point.} v
		 */
		getPoint(u, v) {
				this.nurbsPlane.evalObj.getPoint(u, v);
		};

		/**
		 * Displays the plane surface.
		 */
		display() {
				this.nurbsPlane.display();
		};

		/**
		 * Updates the texture coordinates.
	 	 * @param {s texture coordinate.} s
	 	 * @param {t texture coordinate.} t
		 */
		updateTexCoords(s, t) {};
};
