/**
 * Plane
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Plane class, representing a 2D surface.
 * @extends CGFobject
 */
class Plane extends CGFobject {
	/**
	 * Constructor of the class Plane.
	 * @param {CGFscene} scene   [description]
	 * @param {Number} nPartsU [description]
	 * @param {Number} nPartsV [description]
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
		let nurbsSurface = new CGFnurbsSurface(1, 1, [
			[
				[-0.5, 0.0,  0.5, 1 ],
				[-0.5, 0.0, -0.5, 1 ]
			],
			[
				[0.5, 0.0,  0.5, 1 ],
				[0.5, 0.0, -0.5, 1 ]
			]
		]);

		this.nurbsPlane = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface);
	};

	/**
	 * Returns a specific vertex of the cylinder.
	 * @param  {Number} u u coordinate of the point.
	 * @param  {Number} v v coordinate of the point.
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
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
	updateTexCoords(s, t) {};
};
