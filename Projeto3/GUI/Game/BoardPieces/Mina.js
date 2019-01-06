/**
 * Mina
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Mina class, a 3D representation of the Mina character.
 * @extends BoardPiece
 */
class Mina extends BoardPiece {
    /**
     * Constructor of the class Mina.
     * @param {CGFscene} scene Scene of the application.
     * @param {Number} xPos X coordinate of the Mina character.
     * @param {Number} yPos Y coordinate of the Mina character.
     * @param {Number} zPos Z coordinate of the Mina character.
     */
    constructor(scene, xPos, yPos, zPos) {
        super(scene, xPos, yPos, zPos);

        this.pickingEnabled = true;
        this.type = "player";

        this.minaDress = new MyCoveredCylinder(this.scene, 0.4, 0, 1, 32, 32);
        this.minaHead = new MySphere(this.scene, 0.3, 32, 32);
        this.minaBase = new MyCoveredCylinder(this.scene, 0.5, 0.5, 0.1, 32, 32);
        this.minaSupport = new MyCoveredCylinder(this.scene, 0.075, 0.075, 0.2, 32, 32);

        this.dressAppearance = new CGFappearance(this.scene);
        this.dressAppearance.setAmbient(0.1,0.1,0.1,1);
        this.dressAppearance.setDiffuse(0.6,0.6,0.6,1);
        this.dressAppearance.setSpecular(0.3,0.3,0.3,1);
        this.dressAppearance.setShininess(150);
        this.dressAppearance.loadTexture("../scenes/images/dress.jpg");

        this.skinAppearance = new CGFappearance(this.scene);
        this.skinAppearance.setAmbient(0.7,0.7,0.7,1);
        this.skinAppearance.setDiffuse(0.7,0.7,0.7,1);
        this.skinAppearance.setSpecular(0.3,0.3,0.3,1);
        this.skinAppearance.setShininess(150);
        this.skinAppearance.loadTexture("../scenes/images/skin.jpg");

        this.metalAppearance = new CGFappearance(this.scene);
        this.metalAppearance.setAmbient(0.5,0.5,0.5,1);
        this.metalAppearance.setDiffuse(0.6,0.6,0.6,1);
        this.metalAppearance.setSpecular(0.3,0.3,0.3,1);
        this.metalAppearance.setShininess(150);
        this.metalAppearance.loadTexture("../scenes/images/metal.png");
    };

    /**
     * Mina Display function.
     */
    display() {
        this.scene.registerForPick(102, this);

        var degToRad = Math.PI / 180;

        if (this.animation !== null) {
            this.animate();
        }

        this.scene.pushMatrix();
            this.scene.translate(this.xPos, this.yPos, this.zPos);
            this.scene.scale(0.5, 0.5, 0.5);

            this.scene.pushMatrix();
                this.scene.translate(0, 0.3, 0);
                this.scene.rotate(-90*degToRad, 1, 0, 0);
                this.dressAppearance.apply();
                this.minaDress.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, 1.2, 0);
                this.skinAppearance.apply();
                this.minaHead.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, 0.1, 0);
                this.scene.rotate(-90*degToRad, 1, 0, 0);
                this.metalAppearance.apply();
                this.minaSupport.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(-90*degToRad, 1, 0, 0);
                this.metalAppearance.apply();
                this.minaBase.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.clearPickRegistration();
    }

    /**
     * Clears the animation variable by setting it to null.
     * If the game is still playing or the movie is not playing, the game state updates.
     */
    clearAnimation() {
        this.animation = null;

        if (!this.scene.game.hasGameEnded() && !this.scene.game.isPlayingMovie()) {
            this.scene.game.setState();
        }
    }

    /**
     * Updates the texture coordinates.
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
    updateTexCoords(s, t) {};

 }
