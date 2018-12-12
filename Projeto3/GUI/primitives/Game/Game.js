/**
 * Game
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Game class, a 3D representation of our game.
 */
class Game extends CGFobject {
    /**
     * @constructor constructor of the class Game.
     * @param {Scene of the application} scene
     */
    constructor(scene) {
        super(scene);

        this.board = new Board(scene);
        this.box = new BoardAuxiliar(scene);
        this.mina = new Mina(scene, 8, 0, 4);
        this.yuki = new Yuki(scene, 8, 0, -4);
        this.discs = [];
    };

    /**
     * Game Display function.
     */
    display() {
        this.board.display();

        this.scene.pushMatrix();
            this.scene.translate(8, 0, 0);
            this.box.display();
        this.scene.popMatrix();

        this.mina.display();

        this.yuki.display();

        for (var i = 0; i < this.discs.length; i++) {
            this.discs[i].display();
        }
    }

    /**
     * Updates the texture coordinates.
     * @param {s texture coordinate} s
     * @param {t texture coordinate} t
     */
    updateTexCoords(s, t) {};

}
