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
	 * @param {scene of the application} scene
	 */
	constructor(scene, time, center, radius, initAngle, rotAngle) {
			super(scene, time);
			this.center = center;
			this.radius = radius;
			this.angle = initAngle;
			this.rotAngle = rotAngle;

			this.angle = 0;
			this.delta = this.rotAngle/this.time;

			this.initBuffers();
  };

	apply() {
			if (this.currTime <= this.time) {
					this.transformation = new mat4.create();

					let centerVec = vec3.create();
					vec3.set(centerVec, this.center[0], this.center[1], this.center[2]);
					mat4.translate(this.transformation, this.transformation, centerVec);

					mat4.rotateY(this.transformation, this.transformation, this.angle*this.degToRad);

					let radiusVec = vec3.create();
					vec3.set(radiusVec, 0, 0, this.radius);
					mat4.translate(this.transformation, this.transformation, radiusVec);
					this.currTime += this.scene.period;

					this.angle += this.delta;
			}
	};

	copy() {
			return new CircularAnimation(this.scene, this.time, this.center, this.radius, this.initAngle, this.rotAngle);
	};
};
