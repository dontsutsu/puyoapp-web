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

	// method
	/**
	 * オブジェクトのコピーを生成
	 * @returns {Coordinate} オブジェクトのコピー
	 */
	public clone(): Coordinate {
		return new Coordinate(this._x, this._y);
	}
	
	/**
	 * 座標を定数倍する
	 * @param n 定数倍の値
	 * @returns {Coordinate} 計算後の座標
	 */
	public times(n: number): Coordinate {
		this._x = this._x * n;
		this._y = this._y * n;
		return this;
	}

	/**
	 * x座標を任意の関数で計算する
	 * @param {(x: number) => number} calculateX xを計算する関数 
	 * @returns {Coordinate} 計算後の座標
	 */
	public calculateX(calculateX: (x: number) => number): Coordinate {
		this._x = calculateX(this._x);
		return this;
	}

	/**
	 * y座標を任意の関数で計算する
	 * @param {(y: number) => number} calculateY yを計算する関数
	 * @returns {Coordinate} 計算後の座標
	 */
	public calculateY(calculateY: (y: number) => number): Coordinate {
		this._y = calculateY(this._y);
		return this;
	}

	/**
	 * x座標、y座標を任意の関数で計算する
	 * @param {(x: number) => number} calculateX xを計算する関数
	 * @param {(y: number) => number} calculateY yを計算する関数
	 * @returns {Coordinate} 計算後の座標
	 */
	public calculate(calculateX: (x: number) => number, calculateY: (y: number) => number): Coordinate {
		return this.calculateX(calculateX).calculateY(calculateY);
	}

	// accessor
	get x(): number {
		return this._x;
	}

	set x(x: number) {
		this._x = x;
	}

	get y(): number {
		return this._y;
	}

	set y(y: number) {
		this._y = y;
	}
}