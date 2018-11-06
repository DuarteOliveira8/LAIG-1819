/**
 * CircularAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * CircularAnimation class, representing an object's circular animation.
  */
class CircularAnimation extends Animation {
	/**
	 * @constructor constructor of the class CircularAnimation.
	 * @param {scene of the application} scene
	 */
	constructor(scene, time, center, radius, initAngle, rotAngle) {
		super(scene, time);
    this.center = center;
    this.radius = radius;
    this.initAngle = initAngle;
    this.rotAngle = rotAngle;

		this.initBuffers();
  };

	apply() {

	};

	update() {

	};
};
