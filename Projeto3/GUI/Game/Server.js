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
     * @constructor constructor of the class Server.
     * @param {Scene of the application} scene
     */
    constructor(game, port) {
        this.game = game;
        this.port = port || 8081;
    };

    makeRequest(action, onreadystatechange) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = onreadystatechange;
        request.open("GET", "http://localhost:"+this.port+"/"+action, true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send();
    };
}
