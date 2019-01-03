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
		this.currDistance = 0;

		this.point1 = this.controlPoints[0];
		this.point2 = this.controlPoints[1];
		this.point3 = this.controlPoints[2];
		this.point4 = this.controlPoints[3];

		let vecP1 = vec3.fromValues(this.point1.x, this.point1.y, this.point1.z);
		let vecP2 = vec3.fromValues(this.point2.x, this.point2.y, this.point2.z);
		let vecP3 = vec3.fromValues(this.point3.x, this.point3.y, this.point3.z);
		let vecP4 = vec3.fromValues(this.point4.x, this.point4.y, this.point4.z);
		let divBy2Vec = vec3.fromValues(2,2,2);

		let meanP12 = vec3.create();
		let meanP23 = vec3.create();
		let meanP123 = vec3.create();
		let meanP34 = vec3.create();
		let meanP234 = vec3.create();
		let meanP1234 = vec3.create();

		/* meanP12 */
		vec3.add(meanP12, vecP1, vecP2);
		vec3.divide(meanP12, meanP12, divBy2Vec);

		/* meanP23 */
		vec3.add(meanP23, vecP2, vecP3);
		vec3.divide(meanP23, meanP23, divBy2Vec);

		/* meanP123 */
		vec3.add(meanP123, meanP12, meanP23);
		vec3.divide(meanP123, meanP123, divBy2Vec);

		/* meanP34 */
		vec3.add(meanP34, vecP3, vecP4);
		vec3.divide(meanP34, meanP34, divBy2Vec);

		/* meanP234 */
		vec3.add(meanP234, meanP23, meanP34);
		vec3.divide(meanP234, meanP234, divBy2Vec);

		/* meanP1234 */
		vec3.add(meanP1234, meanP123, meanP234);
		vec3.divide(meanP1234, meanP1234, divBy2Vec);

		this.totalDistance = vec3.distance(vecP1, meanP12) +
							 vec3.distance(meanP12, meanP123) +
							 vec3.distance(meanP123, meanP1234) +
							 vec3.distance(meanP1234, meanP234) +
							 vec3.distance(meanP234, meanP34) +
							 vec3.distance(meanP34, vecP4);


		this.delta = (this.totalDistance/this.time)*this.scene.period;
  	};

  	/**
	 * Applies the current animation state to the transformation matrix and prepares the next transformation.
	 * When the current time of the animation exceeds the span specified, it terminates the animation.
	 */
  	apply() {
	  	if (this.currTime <= this.time) {
		  	let newPoint = vec3.create();
			let distPerc = this.currDistance/this.totalDistance;

		  	newPoint[0] = (1-distPerc) * (1-distPerc) * (1-distPerc) * this.point1.x +
						  3 * distPerc * (1-distPerc) * (1-distPerc) * this.point2.x +
						  3 * distPerc * distPerc * (1 - distPerc) * this.point3.x +
						  distPerc * distPerc * distPerc * this.point4.x;

			newPoint[1] = (1-distPerc) * (1-distPerc) * (1-distPerc) * this.point1.y +
						  3 * distPerc * (1-distPerc) * (1-distPerc) * this.point2.y +
						  3 * distPerc * distPerc * (1 - distPerc) * this.point3.y +
						  distPerc * distPerc * distPerc * this.point4.y;

			newPoint[2] = (1-distPerc) * (1-distPerc) * (1-distPerc) * this.point1.z +
						  3 * distPerc * (1-distPerc) * (1-distPerc) * this.point2.z +
						  3 * distPerc * distPerc * (1 - distPerc) * this.point3.z +
						  distPerc * distPerc * distPerc * this.point4.z;

			this.transformation = mat4.create();

			mat4.translate(this.transformation, this.transformation, newPoint);

			if (this.previousTime != 0) {
				this.deltaTime = this.scene.currentTime-this.previousTime;
				this.delta = (this.totalDistance/this.time)*this.deltaTime;
			}
			this.previousTime = this.scene.currentTime;

			this.currTime += this.deltaTime;
			this.currDistance += this.delta;
	  	}
	  	else {
			console.log("finished");
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
