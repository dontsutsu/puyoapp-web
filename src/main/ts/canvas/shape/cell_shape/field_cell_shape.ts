import { Field } from "../../../game/field";
import { BaseCellShape } from "./base_cell_shape";

export class FieldCellShape extends BaseCellShape {
	// CONSTANT
	public static readonly BG_COLOR = "#FFFFFF";
	public static readonly SELECT_COLOR = "#00FFFF";
	public static readonly CELLSIZE = 35;

	// CLASS FIELD
	private _ax: number;
	private _ay: number;

	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 */
	constructor(ax: number, ay: number) {
		const x = FieldCellShape.CELLSIZE * ax;
		const y = FieldCellShape.CELLSIZE * (Field.Y_SIZE - 1 - ay);
		super(x, y, FieldCellShape.CELLSIZE, FieldCellShape.BG_COLOR);
		this._ax = ax;
		this._ay = ay;
		this.alpha = this._ay == Field.Y_SIZE - 1 ? 0.01 : 1.0;
	}

	/**
	 * マウスオーバー
	 */
	public mouseover(): void {
		this.changeBgColor(FieldCellShape.SELECT_COLOR);
		this.alpha = 1.0;
	}

	/**
	 * マウスアウト
	 */
	public mouseout(): void {
		this.changeBgColor(FieldCellShape.BG_COLOR);
		this.alpha = this._ay == Field.Y_SIZE - 1 ? 0.01 : 1.0;
	}

	// ACCESSOR
	get ax(): number {
		return this._ax;
	}

	get ay(): number {
		return this._ay;
	}
}