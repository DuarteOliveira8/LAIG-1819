/**
 * Plane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Plane class, representing a 2D and 3D surfaces.
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

				this.initBuffers();
	  };

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

				this.nurbsPlane = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
		};

		updateTexCoords(s, t) {

		};

		display() {
			this.nurbsPlane.display();
		};
};
