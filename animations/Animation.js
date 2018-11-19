/**
 * Animation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Animation class, representing an object's animation.
  */
class Animation extends CGFobject { //abstract?
	/**
	 * @constructor constructor of the class Animation.
	 * @param {scene of the application} scene
	 */
	constructor(scene, time) {
			super(scene);
			this.time = time;
			this.currTime = 0;
			this.transformation = new mat4.create();
			this.degToRad = Math.PI / 180;

			this.initBuffers();
  };

	apply() {

	};

	update() {
			this.apply();
	};
};
