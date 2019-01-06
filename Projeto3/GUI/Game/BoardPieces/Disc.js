/**
 * Disc
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Disc class, a 3D representation of a disc piece.
 * @extends BoardPiece
 */
class Disc extends BoardPiece {
    /**
     * Constructor of the class Disc.
     * @param {CGFscene} scene Scene of the application.
     * @param {Number} xPos X coordinate of the disc.
     * @param {Number} yPos Y coordinate of the disc.
     * @param {Number} zPos Z coordinate of the disc.
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
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
    updateTexCoords(s, t) {};

 }
