/**
 * Animation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Animation class, representing an object's animation.
 * @extends CGFobject
 */
class Animation extends CGFobject {
	/**
	 * Constructor of the class Animation.
	 * @param {CGFscene} scene Scene of the application.
	 * @param {Number} time  Total time of the animation in ms.
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
	 * @return {Boolean} Finished state of the animation.
	 */
	hasFinished() {
		return this.finished;
	};

	/**
	 * Abstract method apply.
	 */
	apply() {};

	/**
	 * Calls the apply method based on time.
	 */
	update() {
		this.apply();
	};

	/**
	 * Abstract method copy.
	 */
	copy() {};
};
