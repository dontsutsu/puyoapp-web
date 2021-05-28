export class Coordinate {
	// properties
	private _x: number;
	private _y: number;
	
	/**
	 * constructor
	 * @param {number} x x座標 
	 * @param {number} y y座標
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