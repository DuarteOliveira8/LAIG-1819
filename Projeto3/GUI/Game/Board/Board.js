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

        this.boardCells = [];
        var width = 10;
        var height = 10;

        for (var i = 0; i < height; i++) {
            let boardCellsList = []
            for (var j = 0; j < width; j++) {
                boardCellsList.push(new BoardCell(scene, -4.5+j, -4.5+i, i, j));
            }
            this.boardCells.push(boardCellsList);
        }

        this.boardWrapper = new BoardWrapper(scene);
    };

    /**
     * Board Display function.
     */
    display() {
        var degToRad = Math.PI / 180;

        for (var i = 0; i < this.boardCells.length; i++) {
            for (var j = 0; j < this.boardCells[i].length; j++) {
            	this.scene.registerForPick(j*10+i+1, this.boardCells[i][j]);
                this.boardCells[i][j].display();
            }
        }

        this.scene.clearPickRegistration();

        this.boardWrapper.display();
    }

    /**
     * Updates the texture coordinates.
     * @param {s texture coordinate} s
     * @param {t texture coordinate} t
     */
    updateTexCoords(s, t) {};

}
