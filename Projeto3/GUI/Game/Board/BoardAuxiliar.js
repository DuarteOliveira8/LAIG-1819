/**
 * BoardAuxiliar
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * BoardAuxiliar class, a 3D representation of our game board auxiliar support for white discs.
 * @extends CGFobject
 */
class BoardAuxiliar extends CGFobject {
    /**
     * Constructor of the class BoardAuxiliary.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);

        this.initDiscs();

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
     * BoardAuxiliar Display function. Displays the box and all discs inside it.
     */
    display() {
        var degToRad = Math.PI / 180;
        var delta = 2/Math.sqrt(2);
        var quadHeight = 0.2;

        this.woodAppearance.apply();

        this.scene.pushMatrix();
            this.scene.translate(8, 0, 0);

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
        this.scene.popMatrix();


        for (var i = 0; i < this.discs.length; i++) {
            this.scene.pushMatrix();
                this.discs[i].display();
            this.scene.popMatrix();
        }
    }

    /**
     * Creates all the discs and places them in the box.
     */
    initDiscs() {
        this.discs = [];

        var x = 70, y = 0, z = -23;

        for (var i = 0; i < 70; i++) {
            this.discs.push(new Disc(this.scene, x/10, y/10, z/10));

            if (y == 3) {
                if (x == 91) {
                    y = 0;
                    x = 70;
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
    }

    /**
     * Puts a disc back to the auxiliar box.
     * @param {Disc} disc The disc to be placed back in the box.
     */
    putBack(disc) {
        let lastDisc = this.discs[this.discs.length-1];
        var newX, newY, newZ;

        if (lastDisc.yPos*10 == 3) {
            if (lastDisc.xPos*10 == 91) {
                newY = 0;
                newX = 7;
                newZ = lastDisc.zPos+0.7;
            }
            else {
                newY = 0;
                newX = lastDisc.xPos+0.7;
                newZ = lastDisc.zPos;
            }
        }
        else {
            newX = lastDisc.xPos;
            newY = lastDisc.yPos+0.1;
            newZ = lastDisc.zPos;
        }

        disc.move(newX, newY, newZ, -1, -1);
        this.discs.push(disc);
    }

    /**
     * Updates the texture coordinates.
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
    updateTexCoords(s, t) {};
}
