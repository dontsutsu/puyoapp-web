import { Shape } from "@createjs/easeljs";

/**
 * セル用 createjs.Shape 基底クラス
 */
export class BaseCellShape extends Shape {
	public static readonly BORDER_COLOR = "#F0F0F0";

	private _posx: number;
	private _posy: number;
	private _cellsize: number;
	private _bgColor: string;
	private _borderColor: string;

	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 * @param cellsize セルのサイズ
	 * @param bgColor 背景色
	 * @param borderColor 枠の色
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
	 * 背景色を変更します。
	 * @param bgColor
	 */
	public changeColor(bgColor: string): void {
		this._bgColor = bgColor;
		this.graphics.c();
		this.setGraphics();
	}

	/**
	 * 描画します。
	 */
	private setGraphics(): void {
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
