import { Field } from "../../../game/field";
import { Coordinate } from "../../../util/coordinate";
import { FieldCanvas } from "../../field_canvas";
import { BaseCellShape } from "./base_cell_shape";

export class FieldCellShape extends BaseCellShape {
	// constant
	public static readonly BG_COLOR = "#FFFFFF";
	public static readonly SELECT_COLOR = "#00FFFF";
	public static readonly CELLSIZE = 30;

	// property
	private _coord: Coordinate;

	/**
	 * constructor
	 * @param {Coordinate} coord 座標
	 */
	constructor(coord: Coordinate) {
		const canvasCoord = FieldCanvas.getCanvasCoordinate(coord);
		super(canvasCoord.x, canvasCoord.y, FieldCellShape.CELLSIZE, FieldCellShape.BG_COLOR);
		this._coord = coord;
		this.alpha = coord.y == Field.Y_SIZE - 1 ? 0.01 : 1.0;
	}

	// method
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
		this.alpha = this._coord.y == Field.Y_SIZE - 1 ? 0.01 : 1.0;
	}

	// accessor
	get coord(): Coordinate {
		return this._coord;
	}
}