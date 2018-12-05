/**
 * CoveredCylinder2
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * CoveredCylinder2 class, representing the NURBS version of the cylinder primitive with covers.
 */
class CoveredCylinder2 extends CGFobject
{
	/**
	 * @constructor Constructor of the class CoveredCylinder2.
 	 * @param {Scene of the application.} scene
 	 * @param {Base radius.} base
 	 * @param {Top radius.} top
 	 * @param {Height of the cylinder.} height
 	 * @param {Slices of the cylinder.} slices
 	 * @param {Stacks of the cylinder.} stacks
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
