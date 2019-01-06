/**
 * BoardPiece
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * Disc class, representing a 3D object: a disc.
 * @extends CGFobject
 */
class BoardPiece extends CGFobject {
    /**
     * Constructor of the class BoardPiece.
     * @param {CGFscene} scene Scene of the application.
     * @param {Number} xPos X coordinate of the piece.
     * @param {Number} yPos Y coordinate of the piece.
     * @param {Number} zPos Z coordinate of the piece.
     */
    constructor(scene, xPos, yPos, zPos) {
        super(scene);

        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;

        this.row = -1;
        this.col = -1;

        this.highlighted = false;
        this.animation = null;
    };

    /**
     * BoardPiece Display abstract function.
     */
    display() {};

    /**
     * Starts the piece movement by setting the animation wiht the given coordinates.
     * Sets the piece position on the board with the row and column given.
     * @param  {Number} newX New X coordinate of the piece.
     * @param  {Number} newY New Y coordinate of the piece.
     * @param  {Number} newZ New Z coordinate of the piece.
     * @param  {Number} row New row of the piece.
     * @param  {Number} col New column of the piece.
     */
    move(newX, newY, newZ, row, col) {
        this.setAnimation(newX, newY, newZ);
        this.setBoardCoordinates(row, col);
    }

    /**
     * Animates the board piece by updating the animation and setting the new coordinates.
     * If the animation has ended, this function clears the animation variable.
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
            this.clearAnimation();
        }
    }

    /**
     * Clears the animation variable by setting it to null.
     */
    clearAnimation() {
        this.animation = null;
    }

    /**
     * Sets de piece animation with a new animation based on the lastcontrolpoint coordinates given.
     * @param {Number} newX New X coordinate of the piece.
     * @param {Number} newY New Y coordinate of the piece.
     * @param {Number} newZ New Z coordinate of the piece.
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
     * Sets the coordinates with the new coordinates.
     * @param {Number} xPos New X coordinate of the piece.
     * @param {Number} yPos New Y coordinate of the piece.
     * @param {Number} zPos New Z coordinate of the piece.
     */
    setCoordinates(xPos, yPos, zPos) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;
    }

    /**
     * Sets the row and column with the new row and column given.
     * @param {Number} row New row of the piece.
     * @param {Number} col New column of the piece.
     */
    setBoardCoordinates(row, col) {
        this.row = row;
        this.col = col;
    }

    /**
     * Updates the texture coordinates.
     * @param  {Number} s s texture coordinate
     * @param  {Number} t t texture coordinate
     */
    updateTexCoords(s, t) {};

 }
