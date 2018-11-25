/**
 * CoveredCylinder2
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * MyCoveredCylinder class, representing the cylinder primitive with covers on each side.
 */
class CoveredCylinder2 extends CGFobject
{
	/**
	 * @constructor Constructor of the class MyCoveredCylinder.
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

      this.height = height;
      this.cylinder = new Cylinder2(scene, base, top, height, slices, stacks);
      this.circleBase = new MyCircle(scene, slices, base);
      this.circleTop = new MyCircle(scene, slices, top);
  };

	/**
	 * Positions the covers on the cylinder primitive and displays the result.
	 */
	display()
	{
      var degToRad = Math.PI / 180;

      this.scene.pushMatrix();
        this.cylinder.display();

        this.scene.pushMatrix();
            this.scene.rotate(180*degToRad,1,0,0);
            this.circleBase.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0,this.height);
            this.circleTop.display();
        this.scene.popMatrix();

      this.scene.popMatrix();
	};

	/**
	 * Updates the texture coordinates.
 	 * @param {s texture coordinate} s
 	 * @param {t texture coordinate} t
	 */
	updateTexCoords(s, t) {
			this.cylinder.updateTexCoords(s, t);
			this.circleBase.updateTexCoords(s, t);
			this.circleTop.updateTexCoords(s, t);
	}

};
