/**
 * LinearAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * LinearAnimation class, representing an object's linear animation.
  */
class LinearAnimation extends Animation {
	/**
	 * @constructor constructor of the class LinearAnimation.
	 * @param {scene of the application} scene
	 */
	constructor(scene, time, controlPoints) {
		super(scene, time);
    this.controlPoints = controlPoints;
    this.currentPoint = 0;

		this.initBuffers();
  };

	apply() {
    // let previousPoint = (this.currentPoint-1) == -1 ? (this.controlPoints.length-1) : (this.currentPoint-1);

    // this.scene.translate(this.controlPoints[this.currentPoint].x, this.controlPoints[this.currentPoint].y, this.controlPoints[this.currentPoint].z)
	};

	copy() {
			return new LinearAnimation(this.scene, this.time, this.controlPoints);
	};
};
