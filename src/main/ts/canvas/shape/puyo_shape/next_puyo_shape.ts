import { BasePuyoShape } from "./base_puyo_shape";
import { NextCellShape } from "../cell_shape/next_cell_shape";

export class NextPuyoShape extends BasePuyoShape {

	/**
	 * コンストラクタ
	 * @param {number} next 
	 * @param {number} type 
	 * @param {string} color 
	 */
	constructor(next: number, type: number, color: string) {
		const {x, y} = NextCellShape.getXandY(next, type);
		const radius = NextCellShape.CELLSIZE / 2;
		super(x, y, color, radius);
	}
}