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
    setAnimation(animation) {
        this.animation = animation;
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
