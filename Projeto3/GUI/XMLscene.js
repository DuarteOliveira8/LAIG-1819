var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @extends CGFscene
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.defaultMaterial = new CGFappearance(this);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.period = 10;
        this.currentTime = 0;
        this.previousTime = 0;

        this.rotatingCamera = false;

        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.cameras = [];
        this.cameras.default = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(0, 80, 150), vec3.fromValues(0, 10, 0));
        this.currentCamera = "default";
        this.camera = this.cameras.default;
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light.location[0], light.location[1], light.location[2], light.location[3]);
                this.lights[i].setAmbient(light.ambient[0], light.ambient[1], light.ambient[2], light.ambient[3]);
                this.lights[i].setDiffuse(light.diffuse[0], light.diffuse[1], light.diffuse[2], light.diffuse[3]);
                this.lights[i].setSpecular(light.specular[0], light.specular[1], light.specular[2], light.specular[3]);

                if (light.type == "spot") {
                    this.lights[i].setSpotCutOff(light.angle);
                    this.lights[i].setSpotExponent(light.exponent);
                    this.lights[i].setSpotDirection(light.target[0] - light.location[0], light.target[1] - light.location[1], light.target[2] - light.location[2]);
                }

                this.lights[i].setVisible(true);
                if (light.enabled)
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }


    /**
     * Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.addCameras(this.graph.views.cameras);
        this.currentCamera = this.graph.views.currCam;
        this.camera = this.cameras[this.currentCamera];
        this.interface.setActiveCamera(this.camera);

        //TODO: Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axisLength);

        // TODO: Change ambient and background details according to parsed graph
        this.setGlobalAmbientLight(this.graph.ambient.ambientLight.r, this.graph.ambient.ambientLight.g, this.graph.ambient.ambientLight.b, this.graph.ambient.ambientLight.a);
        this.gl.clearColor(this.graph.ambient.backgroundLight.r, this.graph.ambient.backgroundLight.g, this.graph.ambient.backgroundLight.b, this.graph.ambient.backgroundLight.a)

        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        this.sceneInited = true;

    	this.setUpdatePeriod(this.period);

        this.game = this.graph.primitives["game"];
        this.cameras.rotation = this.game.rotationCamera;
        this.interface.addSettings(this.cameras);
        this.interface.addOptionsGroup();
    }

    /**
     * Picks an object of the scene.
     */
    logPicking() {
        if (this.pickMode == false) {
    		if (this.pickResults != null && this.pickResults.length > 0) {
    			for (var i=0; i< this.pickResults.length; i++) {
    				var obj = this.pickResults[i][0];
    				if (obj instanceof BoardPiece) {
                        this.game.pickPlayer(obj);
    					var customId = this.pickResults[i][1];
    				}
                    else if (obj instanceof BoardCell) {
                        this.game.movePlayer(obj.xPos, obj.yPos, obj.zPos, obj.row, obj.col);
                    }
    			}
    			this.pickResults.splice(0,this.pickResults.length);
    		}
    	}
    }


    /**
     * Displays the scene.
     */
    display() {
    	this.logPicking();
    	this.clearPickRegistration();

        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Updates the components' animations and water movement.
     */
    update(currTime) {
        this.previousTime = this.currentTime;
        this.currentTime = currTime;

        if (this.rotatingCamera) {
            this.game.rotateCamera(this.currentTime-this.previousTime);
        }

        if (!this.game.hasGameEnded() && this.game.turnTime > 0) {
            this.game.updateTurnTime(this.currentTime-this.previousTime);
        }
    }

    /**
     * Updates the camera to the new chosen camera
     * @param  {String} newCamera ID of the new camera.
     */
    updateCamera(newCamera) {
        this.currentCamera = newCamera;
        this.camera = this.cameras[this.currentCamera];
        if (this.currentCamera === "rotation")
            this.interface.setActiveCamera(null);
        else
            this.interface.setActiveCamera(this.camera);
    }

    /**
     * Adds the cameras given to the scene's camera array.
     * @param {Array.<CGFcamera>} cameras Cameras to be added to the scene.
     */
    addCameras(cameras) {
        for (var key in cameras) {
            this.cameras[key] = cameras[key];
        }
    }

    /**
     * Starts the game.
     */
    startGame() {
        this.game.start();
    }

    /**
     * Reverts a move made by a player.
     */
    undoMove() {
        this.game.undo();
    }

    /**
     * Quits the game.
     */
    quitGame() {
        this.game.quit();
    }

    /**
     * Plays the last game's movie.
     */
    gameMovie() {
        this.game.movie();
    }
}
