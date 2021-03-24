import { BoxCellShape } from "../cell_shape/box_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";


/**
 * Boxぷよ
 */
export class BoxPuyoShape extends BasePuyoShape {
	/**
	 * コンストラクタ
	 * @param {number} ax x座標
	 * @param {number} ay y座標
	 * @param {string} color 色
	 */
	constructor(ax: number, ay: number, color: string) {
		const x = BoxCellShape.CELLSIZE * ax;
		const y = BoxCellShape.CELLSIZE * ay;
		const radius = BoxCellShape.CELLSIZE / 2;
		super(x, y, color, radius);
	}
}