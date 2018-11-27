/**
 * CircularAnimation
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * CircularAnimation class, representing an object's circular animation.
  */
class CircularAnimation extends Animation {
	/**
	 * @constructor constructor of the class CircularAnimation.
	 * @param {Scene of the application.} scene
	 * @param {Total time of the animation in ms.} time
	 * @param {Center point of the animation rotation.} center
	 * @param {Radius of the animation rotation.} radius
	 * @param {Initial Animation Rotation Angle. If 0, it's located in the x axis.} initAngle
	 * @param {Total rotation angle.} rotAngle
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
	* @param {Current UNIX time in ms.} currTime
	*/
	apply(currTime) {
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
							this.deltaTime = currTime-this.previousTime;
							this.delta = (this.rotAngle/this.time)*this.deltaTime;
					}
					this.previousTime = currTime;

					this.currTime += this.deltaTime;
					this.angle -= this.delta;
			}
			else {
					this.finished = true;
			}
	};

	/**
	* Returns a copy of the current class.
	*/
	copy() {
			return new CircularAnimation(this.scene, this.time, this.center, this.radius, this.angle, this.rotAngle);
	};
};
