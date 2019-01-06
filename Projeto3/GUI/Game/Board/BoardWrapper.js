/**
 * BoardWrapper
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * BoardWrapper class, a wrapper for the board game.
 * @extends CGFobject
 */
class BoardWrapper extends CGFobject {
    /**
     * Constructor of the class BoardWrapper.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);

        this.cylinder = new CoveredCylinder2(scene, 0.2, 0.2, 10.4, 32, 32);
        this.sphere = new MySphere(scene, 0.2, 32, 32);

        this.wrapperAppearance = new CGFappearance(this.scene);
        this.wrapperAppearance.setAmbient(0.1,0.1,0.1,1);
        this.wrapperAppearance.setDiffuse(0.6,0.6,0.6,1);
        this.wrapperAppearance.setSpecular(0.3,0.3,0.3,1);
        this.wrapperAppearance.setShininess(150);
        this.wrapperAppearance.loadTexture("../scenes/images/metal.png");
    };

    /**
     * BoardWrapper Display function.
     */
    display() {
        var degToRad = Math.PI / 180;

        this.scene.pushMatrix();
            this.wrapperAppearance.apply();

            this.scene.pushMatrix();
                this.scene.translate(-5.2, 0, -5.2);
                this.cylinder.display();
                this.sphere.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(5.2, 0, -5.2);
                this.cylinder.display();
                this.sphere.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(-5.2, 0, -5.2);
                this.scene.rotate(90*degToRad, 0, 1, 0);
                this.cylinder.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(5.2, 0, 5.2);
                this.sphere.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(-5.2, 0, 5.2);
                this.scene.rotate(90*degToRad, 0, 1, 0);
                this.cylinder.display();
                this.sphere.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }

    /**
     * Updates the texture coordinates.
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
    updateTexCoords(s, t) {};

}
