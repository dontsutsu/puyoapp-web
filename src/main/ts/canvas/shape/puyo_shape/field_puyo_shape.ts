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
	 * @param ax x座標
	 * @param ay y座標
	 * @param color 色
	 */
	constructor(ax: number, ay: number, color: string = BasePuyo.NONE) {
		const x = FieldCellShape.CELLSIZE * ax;
		const y = FieldCellShape.CELLSIZE * FieldCanvas.convertY(ay);
		super(x, y, color, FieldCellShape.CELLSIZE);
	}

	/**
	 * 
	 * @param eraseColor 
	 */
	public setStepEraseGraphics(eraseColor: string): void {
		const cellsize = this.cellsize;
		const dict = BasePuyoShape.getDictionary(eraseColor);
		const borderColor = dict.bgColor;	// borderに本来のbgColor使用

		this.graphics
			.s(borderColor)
			.ss(cellsize / 20)
			.f("#FFFFFF")
			.dc(cellsize / 2 + 0.5, cellsize / 2 + 0.5, (cellsize - 2) / 2);
		this.alpha = 1;
	}
}