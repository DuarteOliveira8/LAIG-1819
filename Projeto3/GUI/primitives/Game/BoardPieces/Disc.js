/**
 * Disc
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Disc class, representing a 3D object: a disc.
  */
 class Disc extends BoardPiece {
    /**
    * @constructor constructor of the class Disc.
    * @param {Scene of the application} scene
    */
    constructor(scene, xPos, yPos, zPos) {
        super(scene, xPos, yPos, zPos);

        this.disc = new MyCoveredCylinder(this.scene, 0.6, 0.6, 0.2, 32, 32);

        this.whiteAppearance = new CGFappearance(this.scene);
        this.whiteAppearance.setAmbient(0.1,0.1,0.1,1);
        this.whiteAppearance.setDiffuse(0.6,0.6,0.6,1);
        this.whiteAppearance.setSpecular(0.3,0.3,0.3,1);
        this.whiteAppearance.setShininess(150);
    };

    /**
    * Disc Display function.
    */
    display() {
        var degToRad = Math.PI / 180;

        if (this.animation !== null) {
            this.animate();
        }

        this.scene.pushMatrix();
            this.scene.translate(this.xPos, this.yPos, this.zPos);
            this.scene.scale(0.5, 0.5, 0.5);
            this.scene.rotate(-90*degToRad, 1, 0, 0);
            this.whiteAppearance.apply();
            this.disc.display();
        this.scene.popMatrix();
    }

    /**
    * Updates the texture coordinates.
    * @param {s texture coordinate} s
    * @param {t texture coordinate} t
    */
    updateTexCoords(s, t) {};

 }
