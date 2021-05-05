import { NextCanvas } from "../../next_canvas";
import { BaseCellShape } from "./base_cell_shape";

export class NextCellShape extends BaseCellShape {
	// CONSTANT
	public static readonly CELLSIZE = 25;
	public static readonly BG_COLOR = "#FFFFFF";

	/**
	 * コンストラクタ
	 * @param {number} next 0：ネクスト、1：ダブネク
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 */
	constructor (next: number, type: number) {
		const {x, y} = NextCellShape.getXandY(next, type);
		super(x, y, NextCellShape.CELLSIZE, NextCellShape.BG_COLOR);
		this.alpha = 0.01;
	}

	/**
	 * @param {number} next 0：ネクスト、1：ダブネク
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 * @returns {{x: number, y: number}}
	 */
	public static getXandY(next: number, type: number): { x: number, y: number } {
		const x = NextCanvas.F_X_SHIFT * next;
		const y = NextCellShape.CELLSIZE * type + NextCanvas.F_Y_SHIFT * next;
		return {x, y};
	}
}