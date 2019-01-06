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
        this.gameBoards = [];

        this.states = {
            NOT_STARTED: -1,
            STARTED: 0,
            FIRST_YUKI_PLAY: 1,
            FIRST_MINA_PLAY: 2,
            MOVING_PIECES: 5,
            YUKI_PLAY: 6,
            MINA_PLAY: 7,
            QUIT: -2,
            GAME_OVER: -3,
            MOVIE: -4
        };

        this.cameraStates = {
            YUKI: 1,
            MINA: 2
        }

        this.currentState = this.states.NOT_STARTED;
        this.previousState = this.states.NOT_STARTED;
        this.currentMode = "Player vs Player";
        this.currentDifficulty = "Easy";
        this.help = true;
        this.playerPicked = null;
        this.validPlays = [];

        this.rotationCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 60, -60), vec3.fromValues(0, 10, 0));
        this.rotationAngle = 0;
        this.currentCameraState = this.cameraStates.YUKI;
        this.cameraAngle = "Rotating";

        this.turnTime = 0;

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
        this.initBoard();
        this.gameBoards = [];
        this.playerPicked = null;

        switch (this.currentMode) {
            case "Player vs Player":
                this.yuki.type = "player";
                this.mina.type = "player";
                break;

            case "Player vs Computer":
                this.yuki.type = "player";
                this.mina.type = "computer";
                break;

            case "Computer vs Player":
                this.yuki.type = "computer";
                this.mina.type = "player";
                break;

            case "Computer vs Computer":
                this.yuki.type = "computer";
                this.mina.type = "computer";
                break;

            default:
                console.log("Mode error!");
                break;
        }

        this.currentState = this.states.STARTED;
        this.updateGamePanel("state", "Game is running");
        this.setCameraYuki();
        this.setState();
    }

    initBoard() {
        this.box.initDiscs();
        this.mina.setCoordinates(8, 0, 4);
        this.yuki.setCoordinates(8, 0, -4);
        this.discs = [];
    }

    quit() {
        if (this.currentState !== this.states.MOVIE && this.currentState !== this.states.NOT_STARTED) {
            this.currentState = this.states.QUIT;
            this.validPlays = [];
            this.highlight();
            this.setState();
        }
    }

    undo() {
        if (this.gameBoards.length > 0) {
            this.gameBoards.pop();

            if (this.gameBoards.length > 1) {
                let board = this.gameBoards[this.gameBoards.length-1];

                if (this.currentState === this.states.FIRST_YUKI_PLAY || this.currentState === this.states.YUKI_PLAY) {
                    let play = this.makePlayFromBoard("mina", board);
                    this.mina.move(play[0], play[1], play[2], play[3], play[4]);
                }
                else if (this.currentState === this.states.FIRST_MINA_PLAY || this.currentState === this.states.MINA_PLAY) {
                    let play = this.makePlayFromBoard("yuki", board);
                    this.yuki.move(play[0], play[1], play[2], play[3], play[4]);
                    let disc = this.discs.pop();
                    this.box.putBack(disc);
                }

                this.setState();
            }
            else {
                if (this.currentState === this.states.FIRST_YUKI_PLAY || this.currentState === this.states.YUKI_PLAY) {
                    this.mina.move(8, 0, 4, -1, -1);
                    this.previousState = this.states.FIRST_YUKI_PLAY;
                    this.currentState = this.states.MOVING_PIECES;
                }
                else if (this.currentState === this.states.FIRST_MINA_PLAY || this.currentState === this.states.MINA_PLAY) {
                    this.yuki.move(8, 0, -4, -1, -1);
                    let disc = this.discs.pop();
                    this.box.putBack(disc);
                    this.currentState = this.states.STARTED;
                }
            }
        }
    }

    movie() {
        if (this.currentState !== this.states.NOT_STARTED) {
            this.updateGamePanel("error", "Game is still running");
            return;
        }

        if (this.gameBoards.length < 1) {
            this.updateGamePanel("error", "No game has been played.");
            return;
        }

        this.initBoard();
        this.updateGamePanel("state", "Movie is being played.");
        this.currentState = this.states.MOVIE;

        for (var i = 0; i < this.gameBoards.length; i++) {
            let board = this.gameBoards[i];
            let j = i;
            setTimeout(function(){
                if (j % 2 === 0) {
                    let play = this.makePlayFromBoard("yuki", board);
                    this.yuki.move(play[0], play[1], play[2], play[3], play[4]);
                    let disc = this.box.discs.pop();
                    disc.move(play[0], play[1], play[2], play[3], play[4]);
                    this.discs.push(disc);
                    this.updateGamePanel("guides", "Moving Yuki...");
                    this.updateGamePanel("score", this.box.discs.length);
                }
                else {
                    let play = this.makePlayFromBoard("mina", board);
                    this.mina.move(play[0], play[1], play[2], play[3], play[4]);
                    this.updateGamePanel("guides", "Moving Mina...");
                }
            }.bind(this), 2000*i);
        }

        setTimeout(function(){
            this.currentState = this.states.NOT_STARTED;
            this.updateGamePanel("state", "The game hasn't started yet.");
        }.bind(this), 2000*this.gameBoards.length);

    }

    isPlayingMovie() {
        return this.currentState === this.states.MOVIE;
    }

    pickPlayer(player) {
        if ((this.currentState === this.states.FIRST_YUKI_PLAY || this.currentState === this.states.YUKI_PLAY) && (player instanceof Yuki)) {
            this.updateGamePanel("guides", "Yuki picked.");
            this.playerPicked = player;
            return;
        }

        if ((this.currentState === this.states.FIRST_MINA_PLAY || this.currentState === this.states.MINA_PLAY) && (player instanceof Mina)) {
            this.updateGamePanel("guides", "Mina picked.");
            this.playerPicked = player;
            return;
        }

        if (this.currentState === this.states.NOT_STARTED) {
            this.updateGamePanel("error", "The game hasn't started yet!");
            return;
        }

        if (this.currentState === this.states.MOVING_PIECES) {
            this.updateGamePanel("error", "Currently on the move. Wait a minute!");
            return;
        }

        if (this.currentState === this.states.MOVIE) {
            this.updateGamePanel("error", "Currently playing the last game movie.");
            return;
        }

        this.updateGamePanel("error", "Wrong player!");
    }

    movePlayer(newX, newY, newZ, row, col) {
        if (this.playerPicked === null) {
            this.updateGamePanel("error", "Please choose a player to move first!");
            return;
        }

        if (this.currentState === this.states.YUKI_PLAY || this.currentState === this.states.FIRST_YUKI_PLAY) {
            if (this.isValidPlay(row, col) || this.yuki.type === "computer") {
                let disc = this.box.discs.pop();
                disc.move(newX, newY, newZ, row, col);
                this.discs.push(disc);
                this.yuki.move(newX, newY, newZ, row, col);
                this.setState();
            }

            this.playerPicked = null;
            return;
        }

        if (this.currentState === this.states.MINA_PLAY || this.currentState === this.states.FIRST_MINA_PLAY) {
            if (this.isValidPlay(row, col) || this.mina.type === "computer") {
                this.mina.move(newX, newY, newZ, row, col);
                this.setState();
            }
            else {
                this.updateGamePanel("error", "Wrong move!");
            }

            this.playerPicked = null;
            return;
        }
    }

    setState() {
        let tempState = this.currentState;

        switch (tempState) {
            case this.states.STARTED:
                this.updateGamePanel("guides", "Yuki's first play.");
                if (this.yuki.type === "player") {
                    this.getValidPlays();
                    this.setTurnTime();
                }
                else if (this.yuki.type === "computer")
                    this.getComputerPlay();
                this.currentState = this.states.FIRST_YUKI_PLAY;
                break;

            case this.states.QUIT:
                this.updateGamePanel("state", "The game hasn't started yet.");
                this.updateGamePanel("guides", "Start the game!");
                this.currentState = this.states.NOT_STARTED;
                break;

            case this.states.GAME_OVER:
                this.updateGamePanel("state", "The game hasn't started yet.");
                this.updateGamePanel("score", this.box.discs.length);
                this.updateGamePanel("guides", "Game Over! Play again!");
                this.currentState = this.states.NOT_STARTED;
                break;

            case this.states.FIRST_YUKI_PLAY:
                console.log("Moving yuki");
                this.updateGamePanel("guides", "Moving yuki...");
                this.updateGamePanel("score", this.box.discs.length);
                if (this.scene.currentCamera === "rotation" && this.cameraAngle === "Rotating") {
                    this.setRotation();
                }
                this.saveGameState();
                if (this.mina.type === "player")
                    this.getValidPlays();
                else
                    this.validPlays = [];
                this.currentState = this.states.MOVING_PIECES;
                break;

            case this.states.YUKI_PLAY:
                this.updateGamePanel("guides", "Moving Yuki...");
                this.updateGamePanel("score", this.box.discs.length);
                if (this.scene.currentCamera === "rotation" && this.cameraAngle === "Rotating") {
                    this.setRotation();
                }
                this.saveGameState();
                if (this.mina.type === "player")
                    this.getValidPlays();
                else
                    this.validPlays = [];
                this.currentState = this.states.MOVING_PIECES;
                break;

            case this.states.FIRST_MINA_PLAY:
                this.updateGamePanel("guides", "Moving Mina...");
                if (this.scene.currentCamera === "rotation" && this.cameraAngle === "Rotating") {
                    this.setRotation();
                }
                this.saveGameState();
                if (this.yuki.type === "player")
                    this.getValidPlays();
                else
                    this.validPlays = [];
                this.currentState = this.states.MOVING_PIECES;
                break;

            case this.states.MINA_PLAY:
                this.updateGamePanel("guides", "Moving Mina...");
                if (this.scene.currentCamera === "rotation" && this.cameraAngle === "Rotating") {
                    this.setRotation();
                }
                this.saveGameState();
                if (this.yuki.type === "player")
                    this.getValidPlays();
                else
                    this.validPlays = [];
                this.currentState = this.states.MOVING_PIECES;
                break;

            case this.states.MOVING_PIECES:
                if (this.help) {
                    this.highlight();
                }

                if (this.previousState === this.states.FIRST_YUKI_PLAY) {
                    this.updateGamePanel("guides", "Mina's first turn");
                    this.currentState = this.states.FIRST_MINA_PLAY;
                    if (this.mina.type === "player")
                        this.setTurnTime();
                    else if (this.mina.type === "computer")
                        this.getComputerPlay();
                    break;
                }

                if (this.previousState === this.states.YUKI_PLAY) {
                    this.updateGamePanel("guides", "Mina's turn");
                    this.currentState = this.states.MINA_PLAY;
                    this.checkGameOver();
                    if (this.mina.type === "player")
                        this.setTurnTime();
                    else if (this.mina.type === "computer")
                        this.getComputerPlay();
                    break;
                }

                if (this.previousState === this.states.FIRST_MINA_PLAY || this.previousState === this.states.MINA_PLAY) {
                    this.updateGamePanel("guides", "Yuki's turn");
                    this.currentState = this.states.YUKI_PLAY;
                    this.checkGameOver();
                    if (this.yuki.type === "player")
                        this.setTurnTime();
                    else if (this.yuki.type === "computer")
                        this.getComputerPlay();
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

        if (this.currentState === this.states.FIRST_YUKI_PLAY) {
            this.server.makeRequest("valid_first_moves("+boardArray+",mina)", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.STARTED) {
            this.server.makeRequest("valid_first_moves("+boardArray+",yuki)", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.YUKI_PLAY) {
            this.server.makeRequest("valid_moves("+boardArray+",mina)", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.MINA_PLAY || this.currentState === this.states.FIRST_MINA_PLAY) {
            this.server.makeRequest("valid_moves("+boardArray+",yuki)", onreadystatechange);
            return;
        }
    }

    setValidPlays(validPlays) {
        this.validPlays = validPlays;
    }

    isValidPlay(row, col) {
        for (var i = 0; i < this.validPlays.length; i++) {
            if (row == this.validPlays[i][1]-1 && col == this.validPlays[i][0]-1) {
                return true;
            }
        }

        return false;
    }

    getComputerPlay() {
        let boardArray = JSON.stringify(this.createBoardArray());
        let game = this;

        let onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.responseText);
                if (response.success) {
                    game.makeComputerPlay(response.data);
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

        let difficulty = (this.currentDifficulty === "Easy") ? 1 : 2;

        if (this.currentState === this.states.FIRST_MINA_PLAY) {
            this.playerPicked = this.mina;
            this.server.makeRequest("computerFirstTurn(mina,"+difficulty+","+boardArray+")", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.STARTED) {
            this.playerPicked = this.yuki;
            this.server.makeRequest("computerFirstTurn(yuki,"+difficulty+","+boardArray+")", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.MINA_PLAY) {
            this.playerPicked = this.mina;
            this.server.makeRequest("computerTurn(mina,"+difficulty+","+boardArray+")", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.YUKI_PLAY) {
            this.playerPicked = this.yuki;
            this.server.makeRequest("computerTurn(yuki,"+difficulty+","+boardArray+")", onreadystatechange);
            return;
        }
    }

    makeComputerPlay(boardArray) {
        var play;

        if (this.currentState === this.states.FIRST_YUKI_PLAY || this.currentState === this.states.YUKI_PLAY) {
            play = this.makePlayFromBoard("yuki", boardArray);
        }

        if (this.currentState === this.states.FIRST_MINA_PLAY || this.currentState === this.states.MINA_PLAY) {
            play = this.makePlayFromBoard("mina", boardArray);
        }

        this.movePlayer(play[0], play[1], play[2], play[3], play[4]);
    }

    makePlayFromBoard(player, boardArray) {
        let newPos = this.getCurrentPlayerPosition(player, boardArray);
        let newPosCoords = this.board.boardCells[newPos[0]][newPos[1]].getCoords();
        let play = newPosCoords.concat(newPos);

        return play;
    }

    getCurrentPlayerPosition(player, boardArray) {
        let pos = [];

        for (var i = 0; i < boardArray.length; i++) {
            for (var j = 0; j < boardArray[i].length; j++) {
                if (player === "yuki") {
                    if (boardArray[i][j] === 1) {
                        pos.push(i);
                        pos.push(j);
                    }
                    continue;
                }

                if (player === "mina") {
                    if (boardArray[i][j] === 2 || boardArray[i][j] === 5) {
                        pos.push(i);
                        pos.push(j);
                    }
                    continue;
                }
            }
        }

        return pos;
    }

    checkGameOver() {
        let boardArray = JSON.stringify(this.createBoardArray());
        let game = this;

        let onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let response = JSON.parse(this.responseText);
                if (response.success) {
                    if (response.data) {
                        game.gameOver();
                    }
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

        if (this.currentState === this.states.MINA_PLAY) {
            this.playerPicked = this.mina;
            this.server.makeRequest("game_over(mina,"+boardArray+")", onreadystatechange);
            return;
        }

        if (this.currentState === this.states.YUKI_PLAY) {
            this.playerPicked = this.yuki;
            this.server.makeRequest("game_over(yuki,"+boardArray+")", onreadystatechange);
            return;
        }
    }

    setTurnTime() {
        this.turnTime = 60000;
    }

    updateTurnTime(deltaTime) {
        this.turnTime -= deltaTime;

        if (this.turnTime <= 0 && this.currentState !== this.states.MOVING_PIECES) {
            this.gameOver();
        }
    }

    gameOver() {
        this.currentState = this.states.GAME_OVER;
        this.setState();
    }

    hasGameEnded() {
        return this.currentState === this.states.NOT_STARTED;
    }

    saveGameState() {
        let boardArray = this.createBoardArray();
        this.gameBoards.push(boardArray);
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

    highlight() {
        for (var i = 0; i < this.board.boardCells.length; i++) {
            for (var j = 0; j < this.board.boardCells[i].length; j++) {
                this.board.boardCells[i][j].highlighted = false;
            }
        }

        for (var i = 0; i < this.validPlays.length; i++) {
            this.board.boardCells[this.validPlays[i][1]-1][this.validPlays[i][0]-1].highlighted = true;
        }
    }

    setRotation() {
        this.rotationAngle = Math.PI;
        this.scene.rotatingCamera = true;

        if (this.currentCameraState === this.cameraStates.YUKI) {
            this.rotationCamera.setPosition(vec3.fromValues(0, 60, -60));
        }
        else if (this.currentCameraState === this.cameraStates.MINA) {
            this.rotationCamera.setPosition(vec3.fromValues(0, 60, 60));
        }
    }

    setCameraYuki() {
        this.rotationCamera.setPosition(vec3.fromValues(0, 60, -60));
        this.currentCameraState = this.cameraStates.YUKI;
    }

    setCameraMina() {
        this.rotationCamera.setPosition(vec3.fromValues(0, 60, 60));
        this.currentCameraState = this.cameraStates.MINA;
    }

    setCameraAngle() {
        if (this.cameraAngle === "Yuki") {
            this.setCameraYuki();
            return;
        }

        if (this.cameraAngle === "Mina") {
            this.setCameraMina();
            return;
        }

        if (this.currentState === this.states.NOT_STARTED) {
            this.setCameraYuki();
            return;
        }

        if (this.currentState === this.states.FIRST_YUKI_PLAY ||
            this.currentState === this.states.YUKI_PLAY ||
            this.previousState === this.states.FIRST_MINA_PLAY ||
            this.previousState === this.states.MINA_PLAY) {
            this.setCameraYuki();
            return;
        }

        if (this.currentState === this.states.FIRST_MINA_PLAY ||
            this.currentState === this.states.MINA_PLAY ||
            this.previousState === this.states.FIRST_YUKI_PLAY ||
            this.previousState === this.states.YUKI_PLAY) {
            this.setCameraMina();
            return;
        }
    }

    rotateCamera(deltaTime) {
        let delta = (Math.PI/2000)*deltaTime;

        if (this.rotationAngle < 0) {
            this.scene.rotatingCamera = false;
            if (this.currentCameraState === this.cameraStates.YUKI) {
                this.rotationCamera.setPosition(vec3.fromValues(0, 60, 60));
                this.currentCameraState = this.cameraStates.MINA;
            }
            else if (this.currentCameraState === this.cameraStates.MINA) {
                this.rotationCamera.setPosition(vec3.fromValues(0, 60, -60));
                this.currentCameraState = this.cameraStates.YUKI;
            }
        }
        else {
            this.rotationCamera.orbit(vec3.fromValues(0, 1, 0), delta);
        }

        this.rotationAngle -= delta;
    }

    updateGamePanel(section, message) {
        switch (section) {
            case "state":
                document.querySelector(".game-state").textContent = message;
                document.querySelector(".errors").textContent = "";
                break;

            case "score":
                document.querySelector(".score-content").textContent = message;
                document.querySelector(".errors").textContent = "";
                break;

            case "guides":
                document.querySelector(".guides-content").textContent = message;
                document.querySelector(".errors").textContent = "";
                break;

            case "error":
                document.querySelector(".errors").textContent = message;
                break;

            default:
                document.querySelector(".errors").textContent = "There's no such section in this panel!";
        }
    }

    /**
     * Updates the texture coordinates.
     * @param {s texture coordinate} s
     * @param {t texture coordinate} t
     */
    updateTexCoords(s, t) {};

}
