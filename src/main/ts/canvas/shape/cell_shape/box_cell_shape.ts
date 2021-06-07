import { BaseCellShape } from "./base_cell_shape";
import { BoxCanvas } from "../../box_canvas";
import { Coordinate } from "../../../util/coordinate";

export class BoxCellShape extends BaseCellShape {
	// constant
	public static readonly ENABLED_COLOR = "#FFFFFF";
	public static readonly DISABLED_COLOR = "#666666";
	public static readonly BOX_BORDER_COLOR = "#CCCCCC";
	public static readonly CELLSIZE = 33;

	// property
	private _coord: Coordinate;

	/**
	 * constructor
	 * @param {Coordinate} coord boxの座標
	 */
	constructor(coord: Coordinate) {
		const index = BoxCanvas.getIndex(coord);
		const bgColor = index < BoxCanvas.KEY_ORDER.length ? BoxCellShape.ENABLED_COLOR : BoxCellShape.DISABLED_COLOR;
		const canvasCoord = BoxCanvas.getCanvasCoordinate(coord);
		super(canvasCoord, BoxCellShape.CELLSIZE, bgColor, BoxCellShape.BOX_BORDER_COLOR);
		
		this._coord = coord;
	}

	// accessor
	get coord(): Coordinate {
		return this._coord;
	}
}