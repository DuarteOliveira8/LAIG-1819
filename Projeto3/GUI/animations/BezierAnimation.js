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
		this.delta = 0;
		this.angle = 0;

		this.point1 = this.controlPoints[0];
		this.point2 = this.controlPoints[1];
		this.point3 = this.controlPoints[2];
		this.point4 = this.controlPoints[3];

		this.currPoint = this.point1;

		let l1 = vec3.fromValues(this.point1);
		let vecP2 = vec3.fromValues(this.point2.x, this.point2.y, this.point2.z);
		let vecP3 = vec3.fromValues(this.point3.x, this.point3.y, this.point3.z);
		let r4 = vec3.fromValues(this.point4.x, this.point4.y, this.point4.z);
		let divBy2Vec = vec3.fromValues(2,2,2);

		let l2 = vec3.create();
		let h = vec3.create();
		let l3 = vec3.create();
		let r3 = vec3.create();
		let r2 = vec3.create();

		/* l2 */
		vec3.add(l2, l1, vecP2);
		vec3.divide(l2, l2, divBy2Vec);

		/* h */
		vec3.add(h, vecP2, vecP3);
		vec3.divide(h, h, divBy2Vec);

		/* l3 */
		vec3.add(l3, l2, h);
		vec3.divide(l3, l3, divBy2Vec);

		/* r3 */
		vec3.add(r3, vecP3, r4);
		vec3.divide(r3, r3, divBy2Vec);

		/* r2 */
		vec3.add(r2, h, r3);
		vec3.divide(r2, r2, divBy2Vec);

		this.totalDistance = vec3.distance(l1, l2) + vec3.distance(l2, l3)
							+ vec3.distance(l3, r2) + vec3.distance(r2, r3)
							+ vec3.distance(r3, r4);


		this.delta = (this.totalDistance/this.time)*this.scene.period;
  };

  /**
   * Applies the current animation state to the transformation matrix and prepares the next transformation.
   * When the current time of the animation exceeds the span specified, it terminates the animation.
   */
  apply() {
	  if (this.currTime <= this.time) {

		  	let newPoint = vec3.create();

		  	newPoint[0] = Math.pow(1 - this.delta, 3) * this.point1.x
			  				+ 3 * this.delta * Math.pow(1 - this.delta, 2) * this.point2.x
							+ 3 * Math.pow(this.delta, 2) * (1 - this.delta) * this.point3.x
							+ Math.pow(this.delta, 3) * this.point4.x;

			newPoint[1] = Math.pow(1 - this.delta, 3) * this.point1.y
				  				+ 3 * this.delta * Math.pow(1 - this.delta, 2) * this.point2.y
								+ 3 * Math.pow(this.delta, 2) * (1 - this.delta) * this.point3.y
								+ Math.pow(this.delta, 3) * this.point4.y;

			newPoint[2] = Math.pow(1 - this.delta, 3) * this.point1.z
								+ 3 * this.delta * Math.pow(1 - this.delta, 2) * this.point2.z
								+ 3 * Math.pow(this.delta, 2) * (1 - this.delta) * this.point3.z
								+ Math.pow(this.delta, 3) * this.point4.z;

			let diffX = Math.abs(this.currPoint.x - newPoint[0]);
			let diffY = this.currPoint.y - newPoint[1];
			let diffZ = this.currPoint.z - newPoint[2];

			this.angle = Math.atan2(newPoint[2] - this.currPoint.z, newPoint[0] - this.currPoint.x);

			this.currPoint.x = newPoint[0];
			this.currPoint.y = newPoint[1];
			this.currPoint.z = newPoint[2];

			this.transformation = mat4.create();
			let dir = vec3.fromValues(0,1,0);

			mat4.translate(this.transformation, this.transformation, this.currPoint);
			mat4.rotate(this.transformation, this.transformation, Math.PI/2 - this.angle, dir);

			if (this.previousTime != 0) {
					this.deltaTime = this.scene.currentTime-this.previousTime;
					this.delta = (this.totalDistance/this.time)*this.deltaTime;
			}
			this.previousTime = this.scene.currentTime;

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
          return new BezierAnimation(this.scene, this.time, this.controlPoints);
  };
};
