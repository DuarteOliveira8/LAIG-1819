/**
 * BoardPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 /**
  * Disc class, representing a 3D object: a disc.
  */
 class BoardPiece extends CGFobject {
    /**
     * @constructor constructor of the class BoardPiece.
     * @param {Scene of the application} scene
     */
    constructor(scene, xPos, yPos, zPos) {
        super(scene);

        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;

        this.highlighted = false;
        this.animation = null;
    };

    /**
     * BoardPiece Display function.
     */
    display() {};

    /**
     * Animates the board piece.
     */
    animate() {
        if (!this.animation.hasFinished()) {
            this.animation.update();
            this.setCoordinates(
                this.animation.currentPoint.x,
                this.animation.currentPoint.y,
                this.animation.currentPoint.z
            );
        }
        else {
            this.animation = null;
        }
    }

    /**
     * Sets de piece animation with the new animation.
     * @param {New animation.} animation
     */
    setAnimation(newX, newY, newZ) {
        let controlPoints = [];

        let cp1 = [];
        cp1.x = this.xPos;
        cp1.y = this.yPos;
        cp1.z = this.zPos;
        controlPoints.push(cp1);

        let cp2 = [];
        cp2.x = this.xPos;
        cp2.y = this.yPos+5;
        cp2.z = this.zPos;
        controlPoints.push(cp2);

        let cp3 = [];
        cp3.x = newX;
        cp3.y = newY+5;
        cp3.z = newZ;
        controlPoints.push(cp3);

        let cp4 = [];
        cp4.x = newX;
        cp4.y = newY;
        cp4.z = newZ;
        controlPoints.push(cp4);

        this.animation = new BezierAnimation(this.scene, 2000, controlPoints);
    }

    /**
     * Sets de coordinates with the new coordinates.
     * @param {New X coordinate.} xPos
     * @param {New Y coordinate.} yPos
     * @param {New Z coordinate.} zPos
     */
    setCoordinates(xPos, yPos, zPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;
    }

    /**
     * Updates the texture coordinates.
     * @param {s texture coordinate} s
     * @param {t texture coordinate} t
     */
    updateTexCoords(s, t) {};

 }
