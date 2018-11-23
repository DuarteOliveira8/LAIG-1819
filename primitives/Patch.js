/**
 * Patch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Patch class, representing a 2D or 3D surfaces.
  */
class Patch extends CGFobject {
		/**
		 * @constructor constructor of the class Patch.
     * @param {scene of the application} scene
		 */
		constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
				super(scene);

        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
				this.nPartsU = nPartsU;
				this.nPartsV = nPartsV;
        this.controlPoints = controlPoints;
				
				this.createSurface();
	  };

		createSurface() {
        let controlPoints = [];
        for (var i = 0, k = 0; i < this.nPointsU; i++) {
            let uPoint = [];
            for (var j = 0; j < this.nPointsV; j++, k++) {
                this.controlPoints[k].push(1);
                uPoint.push(this.controlPoints[k]);
            }
            controlPoints.push(uPoint);
        }

				let nurbsSurface = new CGFnurbsSurface(this.nPointsU-1, this.nPointsV-1, controlPoints);

				this.nurbsPlane = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, nurbsSurface);
		};

		updateTexCoords(s, t) {};

		getPoint(u, v) {
				this.nurbsPlane.evalObj.getPoint(u, v);
		};

		display() {
			this.nurbsPlane.display();
		};
};
