/**
 * BoardAuxiliar
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * BoardAuxiliar class, a 3D representation of our game board auxiliar support for white discs.
 */
class BoardAuxiliar extends CGFobject {
    /**
     * @constructor constructor of the class BoardAuxiliary.
     * @param {Scene of the application} scene
     */
    constructor(scene) {
        super(scene);

        this.discs = [];

        var x = -10, y = 0, z = -23;

        for (var i = 0; i < 70; i++) {
            this.discs.push(new Disc(scene, x/10, y/10, z/10));

            if (y == 3) {
                if (x == 11) {
                    y = 0;
                    x = -10;
                    z += 7;
                }
                else {
                    y = 0;
                    x += 7;
                }
            }
            else {
                y += 1;
            }
        }

        this.quad = new MyCoveredCylinder(scene, 1, 1, 0.2, 4, 32);

        this.woodAppearance = new CGFappearance(this.scene);
        this.woodAppearance.setAmbient(0.1,0.1,0.1,1);
        this.woodAppearance.setDiffuse(0.6,0.6,0.6,1);
        this.woodAppearance.setSpecular(0.3,0.3,0.3,1);
        this.woodAppearance.setShininess(150);
        this.woodAppearance.loadTexture("../scenes/images/dark-wood.jpg");

        this.hinge = new MyCoveredCylinder(scene, 0.1, 0.1, 1, 32, 32);

        this.metalAppearance = new CGFappearance(this.scene);
        this.metalAppearance.setAmbient(0.1,0.1,0.1,1);
        this.metalAppearance.setDiffuse(0.6,0.6,0.6,1);
        this.metalAppearance.setSpecular(0.3,0.3,0.3,1);
        this.metalAppearance.setShininess(150);
        this.metalAppearance.loadTexture("../scenes/images/metal.png");
    };

    /**
     * BoardAuxiliar Display function.
     */
    display() {
        var degToRad = Math.PI / 180;
        var delta = 2/Math.sqrt(2);
        var quadHeight = 0.2;

        // Picking functions
        this.logPicking();
      	this.scene.clearPickRegistration();

        this.woodAppearance.apply();

        this.scene.pushMatrix();
            this.scene.scale(delta*1.5, 1, delta*3);
            this.scene.rotate(-45*degToRad, 0, 1, 0);
            this.scene.rotate(90*degToRad, 1, 0, 0);
            this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(1.7, (delta/4)-0.2, 0);
            this.scene.rotate(-90*degToRad, 0, 0, 1);
            this.scene.scale(0.5, 1, delta*3);
            this.scene.rotate(-45*degToRad, 0, 1, 0);
            this.scene.rotate(90*degToRad, 1, 0, 0);
            this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-1.5, (delta/4)-0.2, 0);
            this.scene.rotate(-90*degToRad, 0, 0, 1);
            this.scene.scale(0.5, 1, delta*3);
            this.scene.rotate(-45*degToRad, 0, 1, 0);
            this.scene.rotate(90*degToRad, 1, 0, 0);
            this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0, (delta/4)-0.2, 2.8);
            this.scene.scale(delta*1.5, 0.5, 1);
            this.scene.rotate(-45*degToRad, 0, 0, 1);
            this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0, (delta/4)-0.2, -3);
            this.scene.scale(delta*1.5, 0.5, 1);
            this.scene.rotate(-45*degToRad, 0, 0, 1);
            this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(delta*2.1, delta-0.2, 0);
            this.scene.rotate(-150*degToRad, 0, 0, 1);
            this.scene.scale(delta*1.5, 1, delta*3);
            this.scene.rotate(-45*degToRad, 0, 1, 0);
            this.scene.rotate(90*degToRad, 1, 0, 0);
            this.quad.display();
        this.scene.popMatrix();

        this.metalAppearance.apply();

        this.scene.pushMatrix();
            this.scene.translate(1.7, 0.5, 1);
            this.hinge.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(1.7, 0.5, -2);
            this.hinge.display();
        this.scene.popMatrix();


        for (var i = 0; i < this.discs.length; i++) {
            this.scene.pushMatrix();
                this.scene.registerForPick(i, this.discs[i]); /* TODO: INCREMENT i WHEN THERE ARE OTHER PIECES ON THE BOARD */
                this.discs[i].display();
            this.scene.popMatrix();
        }
      	this.scene.clearPickRegistration();
    }

    /**
     * Updates the texture coordinates.
     * @param {s texture coordinate} s
     * @param {t texture coordinate} t
     */
    updateTexCoords(s, t) {};

    logPicking() {
    	if (this.scene.pickMode == false) {
    		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
    			for (var i=0; i< this.scene.pickResults.length; i++) {
    				var obj = this.scene.pickResults[i][0];
    				if (obj)
    				{
    					var customId = this.scene.pickResults[i][1];
    					console.log("Picked object: " + obj + ", with pick id " + customId);
    				}
    			}
    			this.scene.pickResults.splice(0,this.scene.pickResults.length);
    		}
    	}
    };

}
