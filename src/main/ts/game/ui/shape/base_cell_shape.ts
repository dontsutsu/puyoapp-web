import { Shape } from "@createjs/easeljs";

/**
 * セル用 createjs.Shape 基底クラス
 */
export class BaseCellShape extends Shape {
	static readonly BORDER_COLOR = "#F0F0F0";

	private _posx: number;
	private _posy: number;
	private _cellsize: number;
	private _bgColor: string;
	private _borderColor: string;

	/**
	 * コンストラクタ
	 * @param x
	 * @param y
	 * @param bgColor
	 * @param cellsize
	 */
	constructor(x: number, y: number, cellsize: number, bgColor: string, borderColor: string = BaseCellShape.BORDER_COLOR) {
		super();

		this._posx = x;
		this._posy = y;
		this._cellsize = cellsize;
		this._bgColor = bgColor;
		this._borderColor = borderColor;

		this.setGraphics();
	}

	/**
	 * @param bgColor
	 */
	public changeColor(bgColor: string) {
		this._bgColor = bgColor;
		this.graphics.c();
		this.setGraphics();
	}

	/**
	 *
	 */
	private setGraphics() {
		this.graphics
			.s(this._borderColor)
			.f(this._bgColor)
			.ss(1)
			.dr(0.5, 0.5, this._cellsize, this._cellsize);
	}

	////////////////////////////////
	// setter / getter
	////////////////////////////////

	get posx(): number {
		return this._posx;
	}

	get posy(): number {
		return this._posy;
	}

}
