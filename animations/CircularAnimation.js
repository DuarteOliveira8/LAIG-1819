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

			let centerVec = vec3.create();
			vec3.set(centerVec, center[0], center[1], center[2]);
			mat4.translate(this.transformation, this.transformation, centerVec);

			mat4.rotateY(this.transformation, this.transformation, initAngle*this.degToRad);

			let radiusVec = vec3.create();
			vec3.set(radiusVec, 0, 0, radius);
			mat4.translate(this.transformation, this.transformation, radiusVec);

	    this.rotAngle = rotAngle;
			this.delta = this.rotAngle/this.time;

			this.initBuffers();
  };

	apply() {
			if (this.currTime <= this.time) {
					mat4.rotateY(this.transformation, this.transformation, this.delta*this.degToRad);
					this.currTime += this.scene.period/3600;
					console.log("not yet");
			}
			else {
					console.log("finished");
			}
	};

	update() {
			this.apply();
	};

	copy() {
			return new CircularAnimation(this.scene, this.time, this.center, this.radius, this.initAngle, this.rotAngle);
	};
};
