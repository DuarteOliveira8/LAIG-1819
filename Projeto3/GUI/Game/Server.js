/**
 * Server
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Server class, a communication interface with prolog server.
 */
class Server {
    /**
     * Constructor of the class Server.
     * @param {Game} game The game of the application.
     * @param {Number} port The port to make the connection. Default is 8081.
     */
    constructor(game, port) {
        this.game = game;
        this.port = port || 8081;
    };

    /**
     * Makes an action request to the prolog server and applies a given function on state changes.
     * @param  {String} action A prolog command.
     * @param  {Function} onreadystatechange Function to be applied on state changes.
     */
    makeRequest(action, onreadystatechange) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = onreadystatechange;
        request.open("GET", "http://localhost:"+this.port+"/"+action, true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send();
    };
}
