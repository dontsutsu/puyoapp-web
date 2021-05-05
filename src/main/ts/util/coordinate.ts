export class Coordinate {
	// properties
	private _x: number;
	private _y: number;
	
	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x: number, y: number) {
		this._x = x;
		this._y = y;
	}

	// accessor
	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}
}