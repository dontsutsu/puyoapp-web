import { Shape } from "@createjs/easeljs";

export class BaseCellShape extends Shape {
	// CONSTANT
	public static readonly BORDER_COLOR = "#F0F0F0";

	// CLASS FIELD
	private _cellsize: number;
	private _bgColor: string;
	private _borderColor: string;

	/**
	 * コンストラクタ
	 * @param {number} x createjs.Shape.x に設定する値
	 * @param {number} y createjs.Shape.y に設定する値
	 * @param {number} cellsize セルのサイズ
	 * @param {string} bgColor 背景色
	 * @param {string} [borderColor] 枠の色
	 */
	constructor(x: number, y: number, cellsize: number, bgColor: string, borderColor: string = BaseCellShape.BORDER_COLOR) {
		super();

		this.x = x;
		this.y = y;
		this._cellsize = cellsize;
		this._bgColor = bgColor;
		this._borderColor = borderColor;

		this.setGraphics();
	}

	/**
	 * 背景色を変更します。
	 * @param {string} bgColor
	 */
	public changeBgColor(bgColor: string): void {
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
}