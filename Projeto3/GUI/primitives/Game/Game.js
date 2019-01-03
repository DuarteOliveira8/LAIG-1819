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
        this.boxOffset = 8;
        this.mina = new Mina(scene, 8, 0, 4);
        this.yuki = new Yuki(scene, 8, 0, -4);
        this.discs = [];

        this.turns = {
            YUKI: 1,
            MINA: 2,
        }

        this.currentTurn = this.turns.YUKI;
        this.playerToMove = null;
    };

    /**
     * Game Display function.
     */
    display() {
        this.board.display();

        this.scene.pushMatrix();
            this.scene.translate(this.boxOffset, 0, 0);
            this.box.display();
        this.scene.popMatrix();

        this.mina.display();

        this.yuki.display();

        this.scene.clearPickRegistration();

        for (var i = 0; i < this.discs.length; i++) {
            this.discs[i].display();
        }
    }

    setPlayerToMove(player) {
        if (this.currentTurn === this.turns.YUKI && (player instanceof Yuki)) {
            console.log("Yuki's turn");
            this.playerToMove = player;
            return;
        }

        if (this.currentTurn === this.turns.MINA && (player instanceof Mina)) {
            console.log("Mina's turn");
            this.playerToMove = player;
            return;
        }

        console.log("Wrong player!");
    }

    movePlayer(newX, newY, newZ) {
        if (this.playerToMove === null) {
            console.log("Please choose a player to move first!");
            return;
        }

        if (this.currentTurn === this.turns.YUKI) {
            console.log("Moving yuki");

            let disc = this.box.discs.pop();
            console.log(disc);

            disc.setAnimation(
                new BezierAnimation(
                    this.scene,
                    2000,
                    [
                        {"x":this.boxOffset+disc.xPos, "y":disc.yPos, "z":disc.zPos},
                        {"x":this.boxOffset+disc.xPos, "y":disc.yPos+5, "z":disc.zPos},
                        {"x":newX, "y":newY+5, "z":newZ},
                        {"x":newX, "y":newY, "z":newZ}
                    ]
                )
            );

            this.discs.push(disc);

            this.yuki.setAnimation(
                new BezierAnimation(
                    this.scene,
                    2000,
                    [
                        {"x":this.yuki.xPos, "y":this.yuki.yPos, "z":this.yuki.zPos},
                        {"x":this.yuki.xPos, "y":this.yuki.yPos+5, "z":this.yuki.zPos},
                        {"x":newX, "y":newY+5, "z":newZ},
                        {"x":newX, "y":newY, "z":newZ}
                    ]
                )
            );

            this.currentTurn = this.turns.MINA;
            this.playerToMove = null;
            return;
        }

        if (this.currentTurn === this.turns.MINA) {
            console.log("Moving mina");

            this.mina.setAnimation(
                new BezierAnimation(
                    this.scene,
                    2000,
                    [
                        {"x":this.mina.xPos, "y":this.mina.yPos, "z":this.mina.zPos},
                        {"x":this.mina.xPos, "y":this.mina.yPos+5, "z":this.mina.zPos},
                        {"x":newX, "y":newY+5, "z":newZ},
                        {"x":newX, "y":newY, "z":newZ}
                    ]
                )
            );

            this.currentTurn = this.turns.YUKI;
            this.playerToMove = null;
            return;
        }
    }

    /**
     * Updates the texture coordinates.
     * @param {s texture coordinate} s
     * @param {t texture coordinate} t
     */
    updateTexCoords(s, t) {};

}
