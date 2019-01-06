/**
 * CircularAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * CircularAnimation class, representing an object's circular animation.
 * @extends Animation
 */
class CircularAnimation extends Animation {
	/**
	 * Constructor of the class CircularAnimation.
	 * @param {CGFscene} scene Scene of the application.
	 * @param {Number} time Total time of the animation in ms.
	 * @param {Number[]} center Center point of the animation rotation.
	 * @param {Number} radius Radius of the animation rotation.
	 * @param {Number} initAngle Initial Animation Rotation Angle. If 0, it's located in the x axis.
	 * @param {Number} rotAngle Total rotation angle.
	 */
	constructor(scene, time, center, radius, initAngle, rotAngle) {
		super(scene, time);

		this.center = center;
		this.radius = radius;
		this.angle = initAngle;
		this.rotAngle = rotAngle;

		this.delta = (this.rotAngle/this.time)*this.scene.period;
  	};

	/**
	* Applies the current animation state to the transformation matrix and prepares the next transformation.
	* When the current time of the animation exceeds the span specified, it terminates the animation.
	*/
	apply() {
		if (this.currTime <= this.time) {
			this.transformation = new mat4.create();

			let centerVec = vec3.create();
			vec3.set(centerVec, this.center[0], this.center[1], this.center[2]);
			mat4.translate(this.transformation, this.transformation, centerVec);

			mat4.rotateY(this.transformation, this.transformation, this.angle*this.degToRad);

			let radiusVec = vec3.create();
			vec3.set(radiusVec, this.radius, 0, 0);
			mat4.translate(this.transformation, this.transformation, radiusVec);

			if (this.previousTime != 0) {
				this.deltaTime = this.scene.currentTime-this.previousTime;
				this.delta = (this.rotAngle/this.time)*this.deltaTime;
			}
			this.previousTime = this.scene.currentTime;

			this.currTime += this.deltaTime;
			this.angle -= this.delta;
		}
		else {
			this.finished = true;
		}
	};

	/**
	 * Returns a copy of the current class.
	 * @return {CircularAnimation} Copy of the instance of a circle animation.
	 */
	copy() {
		return new CircularAnimation(this.scene, this.time, this.center, this.radius, this.angle, this.rotAngle);
	};
};
