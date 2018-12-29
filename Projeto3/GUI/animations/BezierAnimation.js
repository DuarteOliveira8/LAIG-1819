/**
 * BezierAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * BezierAnimation class, representing an object's bezier curve animation.
  */
class BezierAnimation extends Animation {
	/**
	 * @constructor constructor of the class BezierAnimation.
	 * @param {Scene of the application.} scene
	 * @param {Total time of the animation in ms.} time
	 * @param {Array containing the control points of the animation.} controlPoints
	 */
	constructor(scene, time, controlPoints) {
		super(scene, time);
	    this.controlPoints = controlPoints;

  };

  /**
   * Applies the current animation state to the transformation matrix and prepares the next transformation.
   * When the current time of the animation exceeds the span specified, it terminates the animation.
   */
  apply() {

  };

  /**
   * Returns a copy the current class.
   */
  copy() {
          return new BezierAnimation(this.scene, this.time, this.controlPoints);
  };
};
