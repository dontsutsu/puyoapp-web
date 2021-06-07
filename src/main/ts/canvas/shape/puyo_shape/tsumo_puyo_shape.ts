import { Coordinate } from "../../../util/coordinate";
import { TsumoCanvas } from "../../tsumo_canvas";
import { TsumoCellShape } from "../cell_shape/tsumo_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";

export class TsumoPuyoShape extends BasePuyoShape {
	// constant
	private static readonly RADIUS = TsumoCellShape.CELLSIZE / 2;

	/**
	 * constructor
	 * @param {Coordinate} coord
	 * @param {string} color 
	 */
	constructor(coord: Coordinate, color: string) {
		const canvasCoord = TsumoCanvas.getCanvasCoordinate(coord);
		super(canvasCoord, color, TsumoPuyoShape.RADIUS);
	}
}