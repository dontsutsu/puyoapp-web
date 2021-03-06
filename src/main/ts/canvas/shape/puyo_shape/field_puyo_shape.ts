import { Field } from "../../../game/field";
import { BasePuyo } from "../../../game/puyo/base_puyo";
import { FieldCellShape } from "../cell_shape/field_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";


/**
 * Fieldぷよ
 */
export class FieldPuyoShape extends BasePuyoShape {
	// CONSTANT
	public static readonly DROP_VEL = 60;
	public static readonly ERASE_VEL = 500;
	public static readonly STEP_ERASE_TIME = 300;

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
}