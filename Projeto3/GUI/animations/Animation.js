/**
 * Animation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Animation class, representing an object's animation.
  */
class Animation extends CGFobject {
	/**
	 * @constructor constructor of the class Animation.
	 * @param {Scene of the application.} scene
	 * @param {Total time of the animation in ms.} time
	 */
	constructor(scene, time) {
			super(scene);
			this.time = time;
			this.currTime = 0;
			this.transformation = new mat4.create();
			this.degToRad = Math.PI / 180;
			this.previousTime = 0;
			this.deltaTime = this.scene.period;
			this.finished = false;

			this.initBuffers();
  };

	/**
	 * Checks if the animation has finished or not.
	 */
	hasFinished() {
			return this.finished;
	};

	/**
	 * Abstract method apply.
	 * @param {Current unix time in ms.} currTime
	 */
	apply() {};

	/**
	 * Calls the apply method based on time.
	 * @param {Current unix time in ms.} currTime
	 */
	update() {
			this.apply();
	};

	/**
	 * Abstract method copy.
	 */
	copy() {};
};
