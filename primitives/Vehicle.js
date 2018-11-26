/**
 * Vehicle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Vehicle class, representing a 3D object: a drone.
  */
 class Vehicle extends CGFobject
 {
     /**
     * @constructor constructor of the class Vehicle.
     * @param {scene of the application} scene
     */
     constructor(scene)
     {
         super(scene);

         this.mainFrameSphere = new MySphere(this.scene, 1, 64, 64);
         this.frameCylinderArm = new CoveredCylinder2(this.scene, 0.4, 0.15, 2, 64, 64);
         this.armHelix = new CoveredCylinder2(this.scene, 0.1, 0.1, 0.2, 64, 64);
         this.verticalBaseSupport = new CoveredCylinder2(this.scene, 0.2, 0.2, 1, 64, 64);
         this.helix = new CoveredCylinder2(this.scene, 0.01, 0.1, 0.5, 64, 64);

         this.droneBodyAppearance = new CGFappearance(this.scene);
         this.droneBodyAppearance.setAmbient(0.4,0.4,0.4,1);
      	 this.droneBodyAppearance.setDiffuse(0.4,0.4,0.4,1);
      	 this.droneBodyAppearance.setSpecular(0.5,0.5,0.5,1);
      	 this.droneBodyAppearance.setShininess(150);
         this.droneBodyAppearance.loadTexture("../scenes/images/drone.jpg");

         this.helixBodyAppearance = new CGFappearance(this.scene);
         this.helixBodyAppearance.setAmbient(0.6,0.6,0.6,1);
      	 this.helixBodyAppearance.setDiffuse(0.7,0.7,0.7,1);
      	 this.helixBodyAppearance.setSpecular(0.7,0.7,0.7,1);
      	 this.helixBodyAppearance.setShininess(150);
         this.helixBodyAppearance.loadTexture("../scenes/images/metal.png");

         this.initBuffers();
     };

     /**
     * Vehicle Display function.
     */
     display()
     {
       var degToRad = Math.PI / 180;

        // Main Frame
        this.scene.pushMatrix();
          this.scene.scale(1.5, 0.7, 1.5);
          this.droneBodyAppearance.apply();
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
          this.scene.translate(-1,0,0.75);
          this.scene.rotate(60*degToRad, 1, 0, 0);
          this.scene.scale(0.5, 0.5, 1.5);
          this.verticalBaseSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(-1,0,-0.75);
          this.scene.rotate(120*degToRad, 1, 0, 0);
          this.scene.scale(0.5, 0.5, 1.5);
          this.verticalBaseSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(1,0,-0.75);
          this.scene.rotate(120*degToRad, 1, 0, 0);
          this.scene.scale(0.5, 0.5, 1.5);
          this.verticalBaseSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(1,0,0.75);
          this.scene.rotate(60*degToRad, 1, 0, 0);
          this.scene.scale(0.5, 0.5, 1.5);
          this.verticalBaseSupport.display();
        this.scene.popMatrix();

        // Horizontal Support Frame
        this.scene.pushMatrix();
          this.scene.translate(1,-1.25,-1.5);
          this.scene.scale(0.5, 0.5, 3);
          this.verticalBaseSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(-1,-1.25,-1.5);
          this.scene.scale(0.5, 0.5, 3);
          this.verticalBaseSupport.display();
        this.scene.popMatrix();

        // First Pair of Helix
        this.scene.pushMatrix();
          this.scene.translate(0,0.5,1.5);
          this.scene.scale(1,0.5,3);
          this.helixBodyAppearance.apply();
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(0,0.5,4.5);
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.translate(0,0.5,1.5);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.translate(0,0.5,4.5);
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.translate(0,0.5,1.5);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.translate(0,0.5,4.5);
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.translate(0,0.5,1.5);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.translate(0,0.5,4.5);
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        // Second Pair of Helix
        this.scene.pushMatrix();
          this.scene.translate(-1.5,0.5,3);
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(1.5,0.5,3);
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.translate(-1.5,0.5,3);
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.translate(1.5,0.5,3);
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.translate(-1.5,0.5,3);
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(180*degToRad, 0, 1, 0);
          this.scene.translate(1.5,0.5,3);
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.translate(-1.5,0.5,3);
          this.scene.rotate(90*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.translate(1.5,0.5,3);
          this.scene.rotate(-90*degToRad, 0, 1, 0);
          this.scene.scale(1,0.5,3);
          this.helix.display();
        this.scene.popMatrix();


     }

     /**
      * Updates the texture coordinates.
      * @param {s texture coordinate} s
      * @param {t texture coordinate} t
      */
     updateTexCoords(s, t) {};

 }
