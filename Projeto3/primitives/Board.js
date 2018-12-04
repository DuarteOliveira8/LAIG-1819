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
    };

    /**
    * Board Display function.
    */
    display() {
        var degToRad = Math.PI / 180;

        this.boardCell.display();
    }

    /**
    * Updates the texture coordinates.
    * @param {s texture coordinate} s
    * @param {t texture coordinate} t
    */
    updateTexCoords(s, t) {};

}
