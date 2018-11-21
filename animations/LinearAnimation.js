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

		let totalDistance = 0;

		for(let i = 1; i < this.controlPoints.length;  i++) {
			let point1 = vec3.fromValues(this.controlPoints[i-1].x, this.controlPoints[i-1].y, this.controlPoints[i-1].z);
			let point2 = vec3.fromValues(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);
			totalDistance += vec3.distance(point1, point2);
		}

		let firstPoint = vec3.fromValues(controlPoints[0].x, controlPoints[0].y, controlPoints[0].z);

		mat4.translate(this.transformation, this.transformation, firstPoint);

		this.initBuffers();
  };

	apply() {

		if(this.currTime <= this.time) {
			this.previousPoint = this.currentPoint;
			this.currentPoint++;

			if(this.currentPoint < this.controlPoints.length) {
				let point = vec3.fromValues(this.controlPoints[this.currentPoint].x, this.controlPoints[this.currentPoint].y, this.controlPoints[this.currentPoint].z);
				mat4.translate(this.transformation, this.transformation, point);
			}

			this.currTime += this.scene.period;
		}

	};

	copy() {
			return new LinearAnimation(this.scene, this.time, this.controlPoints);
	};
};
