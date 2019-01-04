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
    constructor(port) {
        this.port = port || 8081;
    };

    onreadystatechange() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            console.log(response);
            return;
        }

        if (this.readyState === 4 && this.status !== 200) {
            let response = JSON.parse(this.responseText);
            console.log(response);
            return;
        }
    }

    makeRequest(action) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = this.onreadystatechange;
        request.open("GET", "http://localhost:"+this.port+"/"+action, true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send();
    }
}
