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
		this.vecDist = [];
		this.delta = 0;
		this.currentPoint = 0;
		this.currentDistance = 0;
		this.totalDistance = 0;

		for(let i = 1; i < this.controlPoints.length;  i++) {
			let point1 = vec3.fromValues(this.controlPoints[i-1].x, this.controlPoints[i-1].y, this.controlPoints[i-1].z);
			let point2 = vec3.fromValues(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);
			let pointVec = vec3.create();
			vec3.subtract(pointVec, point2, point1);
			this.vecDist.push(pointVec);

			this.totalDistance += vec3.length(pointVec);
		}

		this.delta = this.totalDistance/this.time;

		this.initBuffers();
  };

	apply() {

		if(this.currTime <= this.time) {

			let firstPoint = vec3.fromValues(this.controlPoints[0].x, this.controlPoints[0].y, this.controlPoints[0].z);

			this.transformation = mat4.create();

			mat4.translate(this.transformation, this.transformation, firstPoint);

			let dir = vec3.create();

			vec3.set(dir, (this.controlPoints[this.currentPoint+1].x - this.controlPoints[this.currentPoint].x),
			  (this.controlPoints[this.currentPoint+1].y - this.controlPoints[this.currentPoint].y),
			  (this.controlPoints[this.currentPoint+1].z - this.controlPoints[this.currentPoint].z));

			vec3.normalize(dir, dir);

			let deltaVec = vec3.create();
			vec3.scale(deltaVec, dir, this.delta);

			this.controlPoints[this.currentPoint].x += deltaVec[0];
			this.controlPoints[this.currentPoint].y += deltaVec[1];
			this.controlPoints[this.currentPoint].z += deltaVec[2];

			mat4.translate(this.transformation, this.transformation, deltaVec);

			console.log("Current Distance: ", this.currentDistance);
			console.log("Point Distance: ", vec3.length(this.vecDist[this.currentPoint]));
			if(this.currentDistance >= vec3.length(this.vecDist[this.currentPoint])) {
				console.log("Current Point increase.");
				this.currentPoint++;
			}

			this.currentDistance += this.delta;
			console.log("Increased current distance: ", this.currentDistance);
			console.log(this.currTime);
			this.currTime += this.scene.period;
		}

	};

	copy() {
			return new LinearAnimation(this.scene, this.time, this.controlPoints);
	};
};
