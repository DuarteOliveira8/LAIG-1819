/**
 * MyTerrain
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTerrain extends Plane
{
	constructor(scene, nrDivs, altimetry) 
	{
		super(scene, nrDivs, altimetry, 0, 1, 0, 1);

		// for (var i = 0; i < altimetry.length; i++) {
		// 	for (var j = 0; j < altimetry[i].length; j++) {
		// 		this.vertices[(i*altimetry.length*3)+(j*3)+2] = altimetry[i][j];
		// 		console.log(this.vertices[(i*altimetry.length*3)+(j*3)] + " " + this.vertices[(i*altimetry.length*3)+(j*3)+1] + " " + this.vertices[(i*altimetry.length*3)+(j*3)+2] + "\n");
		// 	}
		// }
	};
};