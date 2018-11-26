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
	 * @param {Scene of the application.} scene
	 * @param {Total time of the animation in ms.} time
	 * @param {Array containing the control points of the animation.} controlPoints
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
			this.dirAngle = 0;

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

	/**
	 * Applies the current animation state to the transformation matrix and prepares the next transformation.
	 * When the current time of the animation exceeds the span specified, it terminates the animation.
	 * @param {Current unix time in ms.} currTime
	 */
	apply(currTime) {
			if(this.currTime <= this.time) {
					if(this.currentDistance >= this.dists[this.currentPointIndex]) {
							this.currentPointIndex++;
							this.currentDistance = 0;

							let nextDir = vec2.fromValues(this.dirs[this.currentPointIndex][0],
																						this.dirs[this.currentPointIndex][2]);

							let previousDir = vec2.fromValues(this.dirs[this.currentPointIndex-1][0],
																							  this.dirs[this.currentPointIndex-1][2]);

							this.dirAngle -= Math.acos(vec2.dot(nextDir, previousDir)/(vec2.length(nextDir)*vec2.length(previousDir)));
					}

					let currentPoint = vec3.fromValues(this.controlPoints[this.currentPointIndex].x,
																						 this.controlPoints[this.currentPointIndex].y,
																						 this.controlPoints[this.currentPointIndex].z);

					this.transformation = mat4.create();

					mat4.translate(this.transformation, this.transformation, currentPoint);
					mat4.rotateY(this.transformation, this.transformation, this.dirAngle);

					if (this.previousTime != 0) {
							this.deltaTime = currTime-this.previousTime;
							this.delta = (this.totalDistance/this.time)*this.deltaTime;
					}
					this.previousTime = currTime;

					let dir = vec3.fromValues(this.dirs[this.currentPointIndex][0], this.dirs[this.currentPointIndex][1], this.dirs[this.currentPointIndex][2]);
					let deltaVec = vec3.create();
					vec3.scale(deltaVec, dir, this.delta);

					this.controlPoints[this.currentPointIndex].x += deltaVec[0];
					this.controlPoints[this.currentPointIndex].y += deltaVec[1];
					this.controlPoints[this.currentPointIndex].z += deltaVec[2];
					this.currentDistance += this.delta;

					this.currTime += this.deltaTime;
			}
			else {
					this.finished = true;
			}
	};

	/**
	 * Returns a copy the current class.
	 */
	copy() {
			return new LinearAnimation(this.scene, this.time, this.controlPoints);
	};
};
