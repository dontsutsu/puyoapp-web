import { Shape } from "@createjs/easeljs";
import { Coordinate } from "../../../util/coordinate";

export class BaseCellShape extends Shape {
	// constant
	public static readonly BORDER_COLOR = "#F0F0F0";

	// property
	private _cellsize: number;
	private _bgColor: string;
	private _borderColor: string;

	/**
	 * constructor
	 * @param {Coordinate} canvasCoord canvas上の座標
	 * @param {number} cellsize セルのサイズ
	 * @param {string} bgColor 背景色
	 * @param {string} [borderColor] 枠の色
	 */
	constructor(canvasCoord: Coordinate, cellsize: number, bgColor: string, borderColor: string = BaseCellShape.BORDER_COLOR) {
		super();

		this.x = canvasCoord.x;
		this.y = canvasCoord.y;
		this._cellsize = cellsize;
		this._bgColor = bgColor;
		this._borderColor = borderColor;

		this.setGraphics();
	}

	// method
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