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
    };

    /**
    * BoardPiece Display function.
    */
    display() {};

    /**
     * Sets de coordinates with the new coordinates
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
