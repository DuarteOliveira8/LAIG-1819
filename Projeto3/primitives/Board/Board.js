/**
 * Board
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Board class, a 3D representation of our game board.
 */
class Board extends CGFobject {
    /**
     * @constructor constructor of the class Board.
     * @param {Scene of the application} scene
     */
    constructor(scene) {
        super(scene);

        this.boardCell = new BoardCell(scene);
        this.boardWrapper = new BoardWrapper(scene);
        this.boardAuxiliar = new BoardAuxiliar(scene);
        this.width = 10;
        this.height = 10;
    };

    /**
     * Board Display function.
     */
    display() {
        var degToRad = Math.PI / 180;

        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                this.scene.pushMatrix();
                    this.scene.translate(-4.5+i, 0, -4.5+j);
                    this.boardCell.display();
                this.scene.popMatrix();
            }
        }

        this.boardWrapper.display();

        this.scene.pushMatrix();
            this.scene.translate(8, 0, 0);
            this.boardAuxiliar.display();
        this.scene.popMatrix();
    }

    /**
     * Updates the texture coordinates.
     * @param {s texture coordinate} s
     * @param {t texture coordinate} t
     */
    updateTexCoords(s, t) {};

}
