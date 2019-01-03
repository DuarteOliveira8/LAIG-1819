/**
 * BoardCell
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * BoardCell class, a 3D representation of our game board cell.
 */
class BoardCell extends CGFobject {
    /**
     * @constructor constructor of the class BoardCell.
     * @param {Scene of the application} scene
     */
    constructor(scene, xPos, zPos) {
        super(scene);

        this.xPos = xPos;
        this.yPos = 0;
        this.zPos = zPos;
        this.pickingEnabled = true;
        this.highlighted = false;

        this.quad = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);

        this.topCellAppearance = new CGFappearance(this.scene);
        this.topCellAppearance.setAmbient(0.1,0.1,0.1,1);
        this.topCellAppearance.setDiffuse(0.6,0.6,0.6,1);
        this.topCellAppearance.setSpecular(0.3,0.3,0.3,1);
        this.topCellAppearance.setShininess(150);
        this.topCellAppearance.loadTexture("../scenes/images/boardCell.jpg");

        this.whiteAppearance = new CGFappearance(this.scene);
        this.whiteAppearance.setAmbient(0.1,0.1,0.1,1);
        this.whiteAppearance.setDiffuse(0.6,0.6,0.6,1);
        this.whiteAppearance.setSpecular(0.3,0.3,0.3,1);
        this.whiteAppearance.setShininess(150);
    };

    /**
     * BoardCell Display function.
     */
    display() {
        var degToRad = Math.PI / 180;

        this.scene.pushMatrix();
            this.scene.translate(this.xPos, this.yPos, this.zPos);
            this.scene.scale(1, 0.1, 1);

            this.whiteAppearance.apply();

            this.scene.pushMatrix();
                this.scene.translate(0, 0, 0.5);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, 0, -0.5);
                this.scene.rotate(180*degToRad, 1, 0, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0.5, 0, 0);
                this.scene.rotate(90*degToRad, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(-0.5, 0, 0);
                this.scene.rotate(-90*degToRad, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, -0.5, 0);
                this.scene.rotate(90*degToRad, 1, 0, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, 0.5, 0);
                this.scene.rotate(-90*degToRad, 1, 0, 0);
                this.topCellAppearance.apply();
                this.quad.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }

    /**
     * Updates the texture coordinates.
     * @param {s texture coordinate} s
     * @param {t texture coordinate} t
     */
    updateTexCoords(s, t) {};

}
