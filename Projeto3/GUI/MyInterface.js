/**
 * MyInterface
 * @constructor
 */

/**
 * MyInterface class, creating a GUI interface.
 * @extends CGFinterface
 */
class MyInterface extends CGFinterface {
    /**
     * Constructor of the class MyInterface.
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {
        var group = this.gui.addFolder("Lights");

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key].enabled;
                group.add(this.scene.lightValues, key);
            }
        }
    }

    /**
     * Adds a dropdown menu containing the game settings.
     * @param {Array.<CGFcamera>} cameras The scene cameras.
     */
    addSettings(cameras) {
        var scene = this.scene;

        var group = this.gui.addFolder("Game settings");

        group.add(this.scene.game, "currentMode", ["Player vs Player", "Player vs Computer", "Computer vs Player", "Computer vs Computer"]).name("Game mode");
        group.add(this.scene.game, "currentDifficulty", ["Easy", "Hard"]).name("Difficulty");
        group.add(this.scene.game, "help").name("Help");
        var panel = group.add(this.scene.game, "panel").name("Panel");
        group.add(this.scene.game, "settingsTurnTime").name("Turn time");
        var dynamicCamera = group.add(this.scene.game, "cameraAngle", ["Rotating", "Yuki", "Mina"]).name("Dynamic camera");

        panel.onChange(function() {
            scene.game.showPanel();
        });

        dynamicCamera.onChange(function(value) {
            scene.game.setCameraAngle();
        });

        var cameraID = [];

        for (var key in cameras)
            cameraID.push(key);

        var cameras = group.add(this.scene.graph.views, "currCam", cameraID).name("Cameras");

        cameras.onChange(function(value) {
            scene.updateCamera(value);
            if (value === "rotation" && scene.game.cameraAngle === "Rotating") {
                scene.game.setCameraAngle();
            }
        });

        var scenes = group.add(this.scene, "currentScene" , ["game-scene-1", "game-scene-2"]).name("Current Scene");

        scenes.onChange(function(value) {
            scene.switchScene(value);
        });

    }

    /**
     * Adds a folder containing game options.
     */
    addOptionsGroup() {
        var group = this.gui.addFolder("Game options");

        group.add(this.scene, "startGame").name("Start game");
        group.add(this.scene, "undoMove").name("Undo move");
        group.add(this.scene, "quitGame").name("Quit game");
        group.add(this.scene, "gameMovie").name("Game movie");
    }

    /**
     * Initiates the keyboard keys.
     */
    initKeys() {
  		this.scene.gui=this;
  		this.processKeyboard=function(){

  		};
  		this.activeKeys={};
  	};

    /**
     * Processes the key down events for keyboard keys.
     * @param  {Event} event Current event.
     */
  	processKeyDown(event) {
        this.activeKeys[event.code]=true;
        if (event.key == 'm' || event.key == 'M') {
            this.scene.graph.currMaterial++;
        }
        this.activeKeys[event.code]=false;
  	};
}
