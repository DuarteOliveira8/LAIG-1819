/**
 * Patch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Patch class, representing a 2D or 3D surfaces.
 * @extends CGFobject
 */
class Patch extends CGFobject {
	/**
	 * Constructor of the class Patch.
	 * @param {CGFscene} scene Scene of the application.
	 * @param {Number} nPointsU Number of U points in the patch.
	 * @param {Number} nPointsV Number of V points in the patch.
	 * @param {Number} nPartsU Number of U parts in the patch.
	 * @param {Number} nPartsV Number of V parts in the patch.
	 * @param {Number[]} controlPoints Array of control points of the patch.
	 */
	constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
		super(scene);

		this.nPointsU = nPointsU;
		this.nPointsV = nPointsV;
		this.nPartsU = nPartsU;
		this.nPartsV = nPartsV;
		this.controlPoints = controlPoints;

		this.createSurface();
	};

	/**
	 * Creates the NURBS surface using the WebCGF library.
	 */
	createSurface() {
		let controlPoints = [];
		for (var i = 0, k = 0; i < this.nPointsU; i++) {
		    let uPoint = [];
		    for (var j = 0; j < this.nPointsV; j++, k++) {
		        this.controlPoints[k].push(1);
		        uPoint.push(this.controlPoints[k]);
		    }
		    controlPoints.push(uPoint);
		}

		let nurbsSurface = new CGFnurbsSurface(this.nPointsU-1, this.nPointsV-1, controlPoints);

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
	 * Displays the patch surface.
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
