/**
 * Vehicle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 class Vehicle extends CGFobject
 {

     constructor(scene)
     {
         super(scene);

         this.mainFrameSphere = new MySphere(this.scene, 1, 64, 64);
         this.frameCylinderArm = new CoveredCylinder2(this.scene, 0.4, 0.15, 2, 64, 64);
         this.armHelix = new CoveredCylinder2(this.scene, 0.1, 0.1, 0.2, 64, 64);
         this.verticalBaseSupport = new CoveredCylinder2(this.scene, 0.2, 0.2, 1, 64, 64);
         this.horizontalBaseSupport = new Cylinder2(this.scene, 0.2, 0.2, 1, 8, 8);

         this.initBuffers();
     };

     display()
     {
       var degToRad = Math.PI / 180;

        // Main Frame
        this.scene.pushMatrix();
          this.scene.scale(1.5, 0.7, 1.5);
          this.mainFrameSphere.display();
        this.scene.popMatrix();

        // Four Arms Connected to the Frame
        this.scene.pushMatrix();
          this.scene.scale(2, 1.05, 1);
          this.scene.translate(0, 0, 1);
          this.frameCylinderArm.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.scale(1, 1.05, 2);
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.translate(0, 0, 1);
          this.frameCylinderArm.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.scale(2, 1.05, 1);
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.translate(0, 0, 1);
          this.frameCylinderArm.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.scale(1, 1.05, 2);
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.translate(0, 0, 1);
          this.frameCylinderArm.display();
        this.scene.popMatrix();

        // Edge Supporters
        this.scene.pushMatrix();
          this.scene.translate(0, 0.15, 3);
          this.scene.rotate(90*degToRad, 1, 0, 0);
          this.scene.scale(3, 3, 1.5);
          this.armHelix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.translate(0, 0.15, 3);
          this.scene.rotate(90*degToRad, 1, 0, 0);
          this.scene.scale(3, 3, 1.5);
          this.armHelix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.translate(0, 0.15, 3);
          this.scene.rotate(90*degToRad, 1, 0, 0);
          this.scene.scale(3, 3, 1.5);
          this.armHelix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.translate(0, 0.15, 3);
          this.scene.rotate(90*degToRad, 1, 0, 0);
          this.scene.scale(3, 3, 1.5);
          this.armHelix.display();
        this.scene.popMatrix();

        // Helix Supporters
        this.scene.pushMatrix();
          this.scene.scale(1, 2, 1);
          this.scene.translate(0, 0.3, 3);
          this.scene.rotate(90*degToRad, 1, 0, 0);
          this.armHelix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.scale(1, 2, 1);
          this.scene.translate(0, 0.3, 3);
          this.scene.rotate(90*degToRad, 1, 0, 0);
          this.armHelix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.scale(1, 2, 1);
          this.scene.translate(0, 0.3, 3);
          this.scene.rotate(90*degToRad, 1, 0, 0);
          this.armHelix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.scale(1, 2, 1);
          this.scene.translate(0, 0.3, 3);
          this.scene.rotate(90*degToRad, 1, 0, 0);
          this.armHelix.display();
        this.scene.popMatrix();

        // Vertical Support Frame
        this.scene.pushMatrix();
          this.scene.scale(0.5,5,0.5);

          this.scene.rotate(90*degToRad, 1, 0, 0);
          this.scene.rotate(60*degToRad, 0, 1, 0);
          this.verticalBaseSupport.display();
        this.scene.popMatrix();
     }

     updateTexCoords(s, t) {};

 }
