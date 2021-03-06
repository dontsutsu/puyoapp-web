import { Field } from "../../../game/field";
import { BasePuyo } from "../../../game/puyo/base_puyo";
import { FieldCellShape } from "../cell_shape/field_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";

/**
 * Fieldぷよ
 */
export class FieldPuyoShape extends BasePuyoShape {
	// CLASS FIELD
	private _ax: number;
	private _ay: number;

	/**
	 * コンストラクタ
	 * @param ax x座標
	 * @param ay y座標
	 * @param color 色
	 */
	constructor(ax: number, ay: number, color: string = BasePuyo.NONE) {
		const x = FieldCellShape.CELLSIZE * ax;
		const y = FieldCellShape.CELLSIZE * (Field.Y_SIZE - 1 - ay);
		super(x, y, color, FieldCellShape.CELLSIZE);
		this._ax = ax;
		this._ay = ay;
	}

	/**
	 * 
	 * @param eraseColor 
	 */
	public setStepEraseGraphics(eraseColor: string) {
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