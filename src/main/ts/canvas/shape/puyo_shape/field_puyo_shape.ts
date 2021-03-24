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

	/**
	 * 
	 * @param {string} eraseColor 
	 */
	public setStepEraseGraphics(eraseColor: string): void {
		const r = this.radius;
		const t = r * BasePuyoShape.THICKNESS_RATIO;
		const dict = BasePuyoShape.getDictionary(eraseColor);
		const borderColor = dict.bgColor;	// borderに本来のbgColor使用

		this.graphics
			.s(borderColor)
			.ss(t)
			.f("#FFFFFF")
			.dc(r + 0.5, r + 0.5, r - t);
		this.alpha = 1;
	}
}