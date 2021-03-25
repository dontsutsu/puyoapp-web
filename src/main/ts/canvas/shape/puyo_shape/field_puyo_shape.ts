import { BasePuyo } from "../../../game/puyo/base_puyo";
import { FieldCanvas } from "../../field_canvas";
import { FieldCellShape } from "../cell_shape/field_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";

/**
 * Fieldぷよ
 */
export class FieldPuyoShape extends BasePuyoShape {
	/**
	 * コンストラクタ
	 * @param {number} ax x座標
	 * @param {number} ay y座標
	 * @param {string} color 色
	 */
	constructor(ax: number, ay: number, color: string = BasePuyo.NONE) {
		const x = FieldCellShape.CELLSIZE * ax;
		const y = FieldCellShape.CELLSIZE * FieldCanvas.convertY(ay);
		const radius = FieldCellShape.CELLSIZE / 2;
		super(x, y, color, radius);
	}
}