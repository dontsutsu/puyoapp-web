import { BasePuyoShape } from "./base_puyo_shape";
import { BoxCanvas } from "../../box_canvas";
import { BoxCellShape } from "../cell_shape/box_cell_shape";
import { Coordinate } from "../../../util/coordinate";

/**
 * Boxぷよ
 */
export class BoxPuyoShape extends BasePuyoShape {
	// constant
	private static readonly RADIUS = BoxCellShape.CELLSIZE / 2;

	/**
	 * constructor
	 * @param {Coordinate} coord boxの座標
	 * @param {string} color 色
	 */
	constructor(coord: Coordinate, color: string) {
		const screenCoord = BoxCanvas.convertCoordinate(coord);
		super(screenCoord.x, screenCoord.y, color, BoxPuyoShape.RADIUS);
	}
}