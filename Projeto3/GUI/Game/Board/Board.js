/**
 * Board
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Board class, a 3D representation of our game board.
 * @extends CGFobject
 */
class Board extends CGFobject {
    /**
     * Constructor of the class Board.
     * @param {CGFscene} scene Scene of the application.
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
     * Board Display function. Displays all the board cells and registers them for picking.
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
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
    updateTexCoords(s, t) {};

}
