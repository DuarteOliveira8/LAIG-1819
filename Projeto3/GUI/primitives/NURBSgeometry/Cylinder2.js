/**
 * Cylinder2
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Cylinder2 class, representing the NURBS version of the cylinder primitive without covers.
 * @extends CGFobject
 */
class Cylinder2 extends CGFobject {
	/**
	 * Constructor of the class Cylinder2.
	 * @param {CGFscene} scene Scene of the application.
	 * @param {Number} base Base radius.
	 * @param {Number} top Top radius.
	 * @param {Number} height Height of the cylinder.
	 * @param {Number} slices Slices of the cylinder.
	 * @param {Number} stacks Stacks of the cylinder.
	 */
	constructor(scene, base, top, height, slices, stacks) {
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
	 * @param  {Number} u u coordinate of the point.
	 * @param  {Number} v v coordinate of the point.
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
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
	updateTexCoords(s, t) {};

};
