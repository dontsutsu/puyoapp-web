import { Coordinate } from "../../../util/coordinate";
import { TsumoCanvas } from "../../tsumo_canvas";
import { BaseCellShape } from "./base_cell_shape";
import { FieldCellShape } from "./field_cell_shape";

export class TsumoCellShape extends BaseCellShape {
	// CONSTANT
	public static readonly CELLSIZE = FieldCellShape.CELLSIZE;
	public static readonly BG_COLOR = "#FFFFFF";

	/**
	 * コンストラクタ
	 * @param {number} ax x座標
	 * @param {number} ay y座標
	 */
	constructor(coord: Coordinate) {
		const canvasCoord = TsumoCanvas.getCanvasCoordinate(coord); 
		super(canvasCoord.x, canvasCoord.y, TsumoCellShape.CELLSIZE, TsumoCellShape.BG_COLOR);
	}
}