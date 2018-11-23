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
			this.dists = [];
			this.dirs = [];
			this.delta = 0;
			this.currentPointIndex = 0;
			this.currentDistance = 0;
			this.totalDistance = 0;

			for(let i = 0; i < this.controlPoints.length-1;  i++) {
					let point1 = vec3.fromValues(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z);

					let point2 = vec3.fromValues(this.controlPoints[i+1].x, this.controlPoints[i+1].y, this.controlPoints[i+1].z);

					let pointVec = vec3.create();
					vec3.subtract(pointVec, point2, point1);
					this.dists.push(vec3.length(pointVec));
					this.totalDistance += vec3.length(pointVec);
					this.dirs.push(vec3.normalize(pointVec, pointVec));
			}

			this.delta = (this.totalDistance/this.time)*this.scene.period;
  };

	apply() {
			if(this.currTime <= this.time) {
					let currentPoint = vec3.fromValues(this.controlPoints[this.currentPointIndex].x,
																						 this.controlPoints[this.currentPointIndex].y,
																						 this.controlPoints[this.currentPointIndex].z);

					this.transformation = mat4.create();

					mat4.translate(this.transformation, this.transformation, currentPoint);

					console.log("Current Distance: ", this.currentDistance);
					console.log("Point Distance: ", this.dists[this.currentPointIndex]);
					if(this.currentDistance >= this.dists[this.currentPointIndex]) {
							console.log("Current Point increase.");
							this.currentPointIndex++;
							this.currentDistance = 0;
					}

					let dir = vec3.fromValues(this.dirs[this.currentPointIndex][0], this.dirs[this.currentPointIndex][1], this.dirs[this.currentPointIndex][2]);

					let deltaVec = vec3.create();
					vec3.scale(deltaVec, dir, this.delta);

					this.controlPoints[this.currentPointIndex].x += deltaVec[0];
					this.controlPoints[this.currentPointIndex].y += deltaVec[1];
					this.controlPoints[this.currentPointIndex].z += deltaVec[2];
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
