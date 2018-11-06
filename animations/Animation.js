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
	 * @param {scene of the application} scene
	 */
	constructor(scene, time) {
		super(scene);
		this.time = time;

		this.initBuffers();
  };

	apply() {

	};

	update() {

	};
};
