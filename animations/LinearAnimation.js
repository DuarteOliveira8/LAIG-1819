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

		let firstPoint = vec3.create();
		vec3.set(firstPoint, controlPoints[0].x, controlPoints[0].y, controlPoints[0].z);
		vec3.normalize(firstPoint, firstPoint);

		let objectDir = vec3.create();
		vec3.set(objectDir, 0, 0, 1); //z axis

		let rotateAngle = Math.atan2(firstPoint[2], firstPoint[0]) - Math.atan2(objectDir[2], objectDir[0]);

		mat4.rotateY(this.transformation, this.transformation, rotateAngle);
		mat4.translate(this.transformation, this.transformation, firstPoint);

		this.initBuffers();
  };

	apply() {

	};

	copy() {
			return new LinearAnimation(this.scene, this.time, this.controlPoints);
	};
};
