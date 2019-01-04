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

        this.states = {
            NOT_STARTED: -1,
            FIRST_YUKI_PLAYER: 1,
            FIRST_MINA_PLAYER: 2,
            FIRST_YUKI_COMPUTER: 3,
            FIRST_MINA_COMPUTER: 4,
            MOVING_PIECES: 5,
            YUKI_PLAYER: 6,
            MINA_PLAYER: 7,
            YUKI_COMPUTER: 8,
            MINA_COMPUTER: 9,
            QUIT: -2
        };

        this.currentState = this.states.NOT_STARTED;
        this.previousState = this.states.NOT_STARTED;
        this.currentMode = "Player vs Player";
        this.currentDifficulty = "Easy";
        this.playerPicked = null;
        this.validPlays = [];

        this.server = new Server(this);
    };

    /**
     * Game Display function.
     */
    display() {
        this.board.display();
        this.box.display();
        this.mina.display();
        this.yuki.display();

        this.scene.clearPickRegistration();

        for (var i = 0; i < this.discs.length; i++) {
            this.discs[i].display();
        }
    }

    start() {
        this.box.initDiscs();
        this.mina.setCoordinates(8, 0, 4);
        this.yuki.setCoordinates(8, 0, -4);
        this.discs = [];
        this.setState();
        this.playerPicked = null;
    }

    quit() {
        this.currentState = this.states.QUIT;
        this.setState();
    }

    pickPlayer(player) {
        if ((this.currentState === this.states.FIRST_YUKI_PLAYER || this.currentState === this.states.YUKI_PLAYER) && (player instanceof Yuki)) {
            console.log("Yuki picked");
            this.playerPicked = player;
            return;
        }

        if ((this.currentState === this.states.FIRST_MINA_PLAYER || this.currentState === this.states.MINA_PLAYER) && (player instanceof Mina)) {
            console.log("Mina picked");
            this.playerPicked = player;
            return;
        }

        if (this.currentState === this.states.NOT_STARTED) {
            console.log("The game hasn't started yet!");
            return;
        }

        if (this.currentState === this.states.MOVING_PIECES) {
            console.log("Currently on the move. Wait a minute!");
            return;
        }

        console.log("Wrong player!");
    }

    movePlayer(newX, newY, newZ, row, col) {
        if (this.playerPicked === null) {
            console.log("Please choose a player to move first!");
            return;
        }

        if (this.currentState === this.states.YUKI_PLAYER || this.currentState === this.states.FIRST_YUKI_PLAYER) {
            if (this.isValidPlay(row, col)) {
                let disc = this.box.discs.pop();
                disc.setAnimation(newX, newY, newZ);
                disc.setBoardCoordinates(row, col);
                this.discs.push(disc);

                this.yuki.setAnimation(newX, newY, newZ);
                this.yuki.setBoardCoordinates(row, col);

                this.setState();
            }

            this.playerPicked = null;
            return;
        }

        if (this.currentState === this.states.MINA_PLAYER || this.currentState === this.states.FIRST_MINA_PLAYER) {
            if (this.isValidPlay(row, col)) {
                this.mina.setAnimation(newX, newY, newZ);
                this.mina.setBoardCoordinates(row, col);

                this.setState();
            }
            else {
                console.log("Wrong move!");
            }

            this.playerPicked = null;
            return;
        }
    }

    setState() {
        let tempState = this.currentState;

        switch (tempState) {
            case this.states.NOT_STARTED:
                console.log("Yuki's first play");
                this.currentState = this.states.FIRST_YUKI_PLAYER;
                this.getValidPlays();
                break;

            case this.states.QUIT:
                console.log("Game stopped");
                this.currentState = this.states.NOT_STARTED;
                break;

            case this.states.FIRST_YUKI_PLAYER:
                console.log("Moving yuki");
                this.currentState = this.states.MOVING_PIECES;
                break;

            case this.states.YUKI_PLAYER:
                console.log("Moving yuki");
                this.currentState = this.states.MOVING_PIECES;
                break;

            case this.states.FIRST_MINA_PLAYER:
                console.log("Moving mina");
                this.currentState = this.states.MOVING_PIECES;
                break;

            case this.states.MINA_PLAYER:
                console.log("Moving mina");
                this.currentState = this.states.MOVING_PIECES;
                break;

            case this.states.MOVING_PIECES:
                if (this.previousState === this.states.FIRST_YUKI_PLAYER) {
                    console.log("Mina's first turn");
                    this.currentState = this.states.FIRST_MINA_PLAYER;
                    this.getValidPlays();
                    break;
                }

                if (this.previousState === this.states.YUKI_PLAYER) {
                    console.log("Mina's turn");
                    this.currentState = this.states.MINA_PLAYER;
                    this.getValidPlays();
                    break;
                }

                if (this.previousState === this.states.FIRST_MINA_PLAYER || this.previousState === this.states.MINA_PLAYER) {
                    console.log("Yuki's turn");
                    this.currentState = this.states.YUKI_PLAYER;
                    this.getValidPlays();
                    break;
                }

                console.log("State logic error!");
                break;

            default:
                console.log("State logic error!");
                break;

        }

        this.previousState = tempState;
    }

    getValidPlays() {
        let boardArray = JSON.stringify(this.createBoardArray());
        let game = this;

        let onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.responseText);
                if (response.success) {
                    game.setValidPlays(response.data)
                    return;
                }

                console.log(response.error);
                return;
            }

            if (this.readyState === 4 && this.status !== 200) {
                let response = JSON.parse(this.responseText);
                console.log(response.error);
                return;
            }
        }

        if (this.currentState === this.states.FIRST_MINA_PLAYER) {
            this.server.makeRequest("valid_first_moves("+boardArray+",mina)", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.FIRST_YUKI_PLAYER) {
            this.server.makeRequest("valid_first_moves("+boardArray+",yuki)", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.MINA_PLAYER) {
            this.server.makeRequest("valid_moves("+boardArray+",mina)", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.YUKI_PLAYER) {
            this.server.makeRequest("valid_moves("+boardArray+",yuki)", onreadystatechange);
            return;
        }
    }

    setValidPlays(validPlays) {
        this.validPlays = validPlays;
        console.log(validPlays);
    }

    isValidPlay(row, col) {
        for (var i = 0; i < this.validPlays.length; i++) {
            if (row == this.validPlays[i][1]-1 && col == this.validPlays[i][0]-1) {
                return true;
            }
        }

        return false;
    }

    createBoardArray() {
        let boardArray = [];
        for (var i = 0; i < 10; i++) {
            let boardRow = [];
            for (var j = 0; j < 10; j++) {
                boardRow.push(3);
            }
            boardArray.push(boardRow);
        }

        for (var i = 0; i < this.discs.length; i++) {
            boardArray[this.discs[i].row][this.discs[i].col] = 0;
        }

        if (this.mina.row !== -1) {
            boardArray[this.mina.row][this.mina.col] += 2;
        }
        if (this.yuki.row !== -1) {
            boardArray[this.yuki.row][this.yuki.col] += 1;
        }

        return boardArray;
    }

    /**
     * Updates the texture coordinates.
     * @param {s texture coordinate} s
     * @param {t texture coordinate} t
     */
    updateTexCoords(s, t) {};

}
