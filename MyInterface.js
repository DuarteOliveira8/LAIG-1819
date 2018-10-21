/**
 * MyInterface class, creating a GUI interface.
 * @constructor
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor Constructor of the class MyInterface.
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
        group.open();

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
     * Adds a dropdown menu containing the IDs of the cameras passed as parameter.
     * @param {array} cameras
     */
    addCameras(cameras) {
        var cameraID = [];

        for (var key in cameras)
            cameraID.push(key);

        var scene = this.scene;

        var controller = this.gui.add(this.scene.graph.views, "currCam", cameraID).name("Cameras");

        controller.onChange(function(value) {
            scene.updateCamera(value);
        });
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
     * @param {current event} event
     */
  	processKeyDown(event) {
      this.activeKeys[event.code]=true;
      if (event.key == 'm' || event.key == 'M') {
          this.scene.graph.currMaterial++;
      }
      this.activeKeys[event.code]=false;
  	};
}
