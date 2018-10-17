/**
 * MyCoveredCylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCoveredCylinder extends CGFobject
{

	constructor(scene, base, top, height, slices, stacks)
	{
      super(scene);

      this.height = height;
      this.cylinder = new MyCylinder(scene, base, top, height, slices, stacks);
      this.circleBase = new MyCircle(scene, slices, base);
      this.circleTop = new MyCircle(scene, slices, top);
  };

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

	updateTexCoords(s, t) {
			this.cylinder.updateTexCoords(s, t);
			this.circleBase.updateTexCoords(s, t);
			this.circleTop.updateTexCoords(s, t);
	}

};
