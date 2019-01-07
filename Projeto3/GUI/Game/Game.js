/**
 * Game
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Game class, a 3D representation of our game.
 * @extends CGFobject
 */
class Game extends CGFobject {
    /**
     * Constructor of the class Game.
     * @param {CGFscene} scene Scene of the application.
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
        this.settingsTurnTime = 60;

        this.panel = true;

        this.server = new Server(this);
    };

    /**
     * Game Display function. Displays the board, auxiliar box and pieces of the game.
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

    /**
     * Starts a new game. Initializes all the variable to the starting state.
     */
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
        this.setCamera("rotation");
        this.setCameraYuki();
        this.setState();
    }

    /**
     * Initializes the board by initializing the box with all the discs, puts both characters outside the board and clears the array of discs on the board.
     */
    initBoard() {
        this.box.initDiscs();
        this.mina.setCoordinates(8, 0, 4);
        this.yuki.setCoordinates(8, 0, -4);
        this.discs = [];
    }

    /**
     * Quits the game by setting the state to QUIT, cleaning the valid plays and dehighlighting the board cells.
     */
    quit() {
        if (this.currentState !== this.states.MOVIE && this.currentState !== this.states.NOT_STARTED) {
            this.currentState = this.states.QUIT;
            this.validPlays = [];
            this.dehighlight();
            this.setState();
            this.setCamera("default");
        }
    }

    /**
     * Reverts the last play made by any character.
     */
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
                this.setRotation();
                this.validPlays.pop();
            }
            else {
                if (this.currentState === this.states.FIRST_YUKI_PLAY || this.currentState === this.states.YUKI_PLAY) {
                    this.mina.move(8, 0, 4, -1, -1);
                    this.previousState = this.states.FIRST_YUKI_PLAY;
                    this.currentState = this.states.MOVING_PIECES;
                    this.setRotation();
                    this.validPlays.pop();
                    this.highlight(this.validPlays[this.validPlays.length-1]);
                }
                else if (this.currentState === this.states.FIRST_MINA_PLAY || this.currentState === this.states.MINA_PLAY) {
                    this.yuki.move(8, 0, -4, -1, -1);
                    let disc = this.discs.pop();
                    this.box.putBack(disc);
                    this.currentState = this.states.STARTED;
                    this.setRotation();
                    this.dehighlight();
                }
            }
        }
    }

    /**
     * Plays the movie of the last game if there was any until now.
     */
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

    /**
     * Checks if the movie is playing.
     * @return {Boolean} False if it's not playing. True if it's playing the movie.
     */
    isPlayingMovie() {
        return this.currentState === this.states.MOVIE;
    }

    /**
     * Picks a player by setting the playerPick attribute to the player picked.
     * @param  {BoardPiece} player Player picked.
     */
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

    /**
     * Moves the current player to a new cell if it's a valid play.
     * @param  {Number} newX new X coordinate of the player.
     * @param  {Number} newY new Y coordinate of the player.
     * @param  {Number} newZ new Z coordinate of the player.
     * @param  {Number} row New board row of the player.
     * @param  {Number} col New board column of the player.
     */
    movePlayer(newX, newY, newZ, row, col) {
        if (this.playerPicked === null) {
            this.updateGamePanel("error", "Please choose a player to move first!");
            return;
        }

        if (this.currentState === this.states.YUKI_PLAY || this.currentState === this.states.FIRST_YUKI_PLAY) {
            if (this.isValidPlay(row, col)) {
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
            if (this.isValidPlay(row, col)) {
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

    /**
     * Moves computer player to the new destination.
     * @param  {Number} newX new X coordinate of the player.
     * @param  {Number} newY new Y coordinate of the player.
     * @param  {Number} newZ new Z coordinate of the player.
     * @param  {Number} row New board row of the player.
     * @param  {Number} col New board column of the player.
     */
    moveComputer(newX, newY, newZ, row, col) {
        if (this.currentState === this.states.YUKI_PLAY || this.currentState === this.states.FIRST_YUKI_PLAY) {
            let disc = this.box.discs.pop();
            disc.move(newX, newY, newZ, row, col);
            this.discs.push(disc);
            this.yuki.move(newX, newY, newZ, row, col);
            this.setState();

            this.playerPicked = null;
            return;
        }

        if (this.currentState === this.states.MINA_PLAY || this.currentState === this.states.FIRST_MINA_PLAY) {
            this.mina.move(newX, newY, newZ, row, col);
            this.setState();

            this.playerPicked = null;
            return;
        }
    }

    /**
     * Sets the current state to a new state according to the current and/or the previous state.
     * Prepares the current state by getting valid plays and highlighting them, moving the computer, rotating the camera, setting turn times or updating game panel.
     */
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
                if (this.previousState === this.states.FIRST_YUKI_PLAY) {
                    this.updateGamePanel("guides", "Mina's first turn");
                    this.currentState = this.states.FIRST_MINA_PLAY;
                    if (this.mina.type === "player") {
                        if (this.help)
                            this.highlight(this.validPlays[this.validPlays.length-1]);

                        this.setTurnTime();
                    }
                    else if (this.mina.type === "computer")
                        this.getComputerPlay();
                    break;
                }

                if (this.previousState === this.states.YUKI_PLAY) {
                    this.updateGamePanel("guides", "Mina's turn");
                    this.currentState = this.states.MINA_PLAY;
                    this.checkGameOver();
                    if (this.mina.type === "player"){
                        if (this.help)
                            this.highlight(this.validPlays[this.validPlays.length-1]);

                        this.setTurnTime();
                    }
                    else if (this.mina.type === "computer")
                        this.getComputerPlay();
                    break;
                }

                if (this.previousState === this.states.FIRST_MINA_PLAY || this.previousState === this.states.MINA_PLAY) {
                    this.updateGamePanel("guides", "Yuki's turn");
                    this.currentState = this.states.YUKI_PLAY;
                    this.checkGameOver();
                    if (this.yuki.type === "player") {
                        if (this.help)
                            this.highlight(this.validPlays[this.validPlays.length-1]);

                        this.setTurnTime();
                    }
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

    /**
     * Creates a request to the prolog server to get the valid plays according to the game state.
     */
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

    /**
     * Pushes to the valid plays array the new set of valid plays.
     * @param {Number[][]} validPlays New valid plays.
     */
    setValidPlays(validPlays) {
        this.validPlays.push(validPlays);
    }

    /**
     * Checks if a given play is valid by checking if the row and column of the destination is on the valid plays array.
     * @param  {Number}  row Destination row.
     * @param  {Number}  col Destination column.
     * @return {Boolean} True if it's a valid play, false otherwise.
     */
    isValidPlay(row, col) {
        let validPlays = this.validPlays[this.validPlays.length-1];

        for (var i = 0; i < validPlays.length; i++) {
            if (row == validPlays[i][1]-1 && col == validPlays[i][0]-1) {
                return true;
            }
        }

        return false;
    }

    /**
     * Creates a request to the prolog server to get the new computer play according to the player and applies the play.
     */
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

    /**
     * Makes a computer play according to the new board state given by the prolog server.
     * @param  {Number[][]} boardArray New board state.
     */
    makeComputerPlay(boardArray) {
        var play;

        if (this.currentState === this.states.FIRST_YUKI_PLAY || this.currentState === this.states.YUKI_PLAY) {
            play = this.makePlayFromBoard("yuki", boardArray);
        }

        if (this.currentState === this.states.FIRST_MINA_PLAY || this.currentState === this.states.MINA_PLAY) {
            play = this.makePlayFromBoard("mina", boardArray);
        }

        this.moveComputer(play[0], play[1], play[2], play[3], play[4]);
    }

    /**
     * Creates a play from a given board state array.
     * @param  {String} player Player to make the play. Can be "mina" or "yuki".
     * @param  {Number[][]} boardArray New board state.
     * @return {Number[]} The new play creates. An array with the X, Y and Z coordinates and the row and column of the new play.
     */
    makePlayFromBoard(player, boardArray) {
        let newPos = this.getPlayerPosition(player, boardArray);
        let newPosCoords = this.board.boardCells[newPos[0]][newPos[1]].getCoords();
        let play = newPosCoords.concat(newPos);

        return play;
    }

    /**
     * Gets the given player position on a board state array.
     * @param  {String} player Player to get the position. Can be "mina" or "yuki".
     * @param  {Number[][]} boardArray The board state array.
     * @return {Number[]} Array containing the row and column of the player.
     */
    getPlayerPosition(player, boardArray) {
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

    /**
     * Creates a request to the prolog server to check if the game has ended.
     */
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

    /**
     * Ends the game by setting the game state to GAME_OVER and setting it again to NOT_STARTED.
     */
    gameOver() {
        this.currentState = this.states.GAME_OVER;
        this.setCamera("default");
        this.setState();
    }

    /**
     * Checks if the game has ended.
     * @return {Boolean} True if the game has ended, False otherwise.
     */
    hasGameEnded() {
        return this.currentState === this.states.NOT_STARTED;
    }

    /**
     * Saves the game board by creating a board state array and putting it in the previous game boards continainer.
     */
    saveGameState() {
        let boardArray = this.createBoardArray();
        this.gameBoards.push(boardArray);
    }

    /**
     * Creates a board state array based on the current game.
     * @return {Number[][]} New board state array.
     */
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
     * Dehighlights all the highlithed board cells.
     */
    dehighlight() {
        for (var i = 0; i < this.board.boardCells.length; i++) {
            for (var j = 0; j < this.board.boardCells[i].length; j++) {
                this.board.boardCells[i][j].highlighted = false;
            }
        }
    }

    /**
     * Dehighlights all the board cells and Highlights all the board cells that are a valid destination for the current player.
     * @param  {Number[][]} validPlays Current valid plays for the player.
     */
    highlight(validPlays) {
        this.dehighlight();

        for (var i = 0; i < validPlays.length; i++) {
            this.board.boardCells[validPlays[i][1]-1][validPlays[i][0]-1].highlighted = true;
        }
    }

    /**
     * Sets the scene camera to the camera given.
     * @param {String} camera New camera to be set.
     */
    setCamera(camera) {
        this.scene.updateCamera(camera);
        document.querySelectorAll('select')[3].value = camera;
    }

    /**
     * Starts a new camera rotation.
     */
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

    /**
     * Sets the camera to Yuki's side.
     */
    setCameraYuki() {
        this.rotationCamera.setPosition(vec3.fromValues(0, 60, -60));
        this.currentCameraState = this.cameraStates.YUKI;
    }

    /**
     * Sets the camera to Mina's side.
     */
    setCameraMina() {
        this.rotationCamera.setPosition(vec3.fromValues(0, 60, 60));
        this.currentCameraState = this.cameraStates.MINA;
    }

    /**
     * Sets the camera according to the cameraAngle attribute modified by the interface controls.
     */
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

    /**
     * Rotates the camera according to the elapsed time.
     * @param  {Number} deltaTime Elapsed time since the last update.
     */
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

    /**
     * Resets the turn timer to the time specified in the interface settings.
     */
    setTurnTime() {
        this.turnTime = this.settingsTurnTime*1000;
    }

    /**
     * Updates the turn timer according to the elapsed time.
     * @param  {Number} deltaTime Elapsed time since the last update.
     */
    updateTurnTime(deltaTime) {
        this.turnTime -= deltaTime;

        this.updateGamePanel("time", Math.floor(Math.ceil(this.turnTime/1000)/60)+":"+Math.floor(Math.ceil(this.turnTime/1000)%60));

        if (this.turnTime <= 0 && this.currentState !== this.states.MOVING_PIECES) {
            this.gameOver();
        }
    }

    /**
     * Updates a game panel section with the the message provided.
     * @param  {String} section Game panel section.
     * @param  {String} message Message to be set in the game panel section.
     */
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

            case "time":
                document.querySelector(".time-content").textContent = message;
                break;

            case "error":
                document.querySelector(".errors").textContent = message;
                break;

            default:
                document.querySelector(".errors").textContent = "There's no such section in this panel!";
        }
    }

    /**
     * Toggles panel visibility.
     */
    showPanel() {
        if (this.panel)
            document.querySelector(".game-panel").hidden = false;
        else
            document.querySelector(".game-panel").hidden = true;
    }

    /**
     * Updates the texture coordinates.
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
    updateTexCoords(s, t) {};

}
