import { BasePuyo } from "../../../game/puyo/base_puyo";
import { Coordinate } from "../../../util/coordinate";
import { FieldCanvas } from "../../field_canvas";
import { FieldCellShape } from "../cell_shape/field_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";

/**
 * Fieldぷよ
 */
export class FieldPuyoShape extends BasePuyoShape {
	// constant
	private static readonly RADIUS = FieldCellShape.CELLSIZE / 2;

	/**
	 * constructor
	 * @param {Coordinate} coord 座標
	 * @param {string} color 色
	 */
	constructor(coord: Coordinate, color: string = BasePuyo.NONE) {
		const canvasCoord = FieldCanvas.getCanvasCoordinate(coord);
		super(canvasCoord.x, canvasCoord.y, color, FieldPuyoShape.RADIUS);
	}
}