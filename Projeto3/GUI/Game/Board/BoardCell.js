/**
 * BoardCell
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * BoardCell class, a 3D representation of our game board cell.
 * @extends CGFobject
 */
class BoardCell extends CGFobject {
    /**
     * Constructor of the class BoardCell.
     * @param {CGFscene} scene Scene of the application.
     * @param {Number} xPos X coordinate of the board cell.
     * @param {Number} zPos Z coordinate of the board cell.
     * @param {Number} row Row of the board cell in the board.
     * @param {Number} col Column of the board cell in the board.
     */
    constructor(scene, xPos, zPos, row, col) {
        super(scene);

        this.xPos = xPos;
        this.yPos = 0;
        this.zPos = zPos;
        this.row = row;
        this.col = col;
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

        this.highlightedAppearance = new CGFappearance(this.scene);
        this.highlightedAppearance.setAmbient(0.07,0.1,0.07,1);
        this.highlightedAppearance.setDiffuse(0.4,0.6,0.4,1);
        this.highlightedAppearance.setSpecular(0.2,0.3,0.2,1);
        this.highlightedAppearance.setShininess(150);
        this.highlightedAppearance.loadTexture("../scenes/images/boardCell.jpg");
    };

    /**
     * BoardCell Display function. Displays the cell and if it is highlighted, the cell becomes green.
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

                if (this.highlighted)
                    this.highlightedAppearance.apply();
                else
                    this.topCellAppearance.apply();

                this.quad.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }

    /**
     * Gets the coordinates of the cell.
     * @return {Number[]} Coordinates of the cell.
     */
    getCoords() {
        return [this.xPos, this.yPos, this.zPos];
    }

    /**
     * Updates the texture coordinates.
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
    updateTexCoords(s, t) {};

}
