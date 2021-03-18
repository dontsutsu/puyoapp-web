import { BoxCanvas } from "../../box_canvas";
import { BaseCellShape } from "./base_cell_shape";

export class BoxCellShape extends BaseCellShape {
	// CONSTANT
	public static readonly ENABLED_COLOR = "#FFFFFF";
	public static readonly DISABLED_COLOR = "#666666";
	public static readonly BOX_BORDER_COLOR = "#CCCCCC";
	public static readonly CELLSIZE = 35;

	// CLASS FIELD
	private _ax: number;
	private _ay: number;

	/**
	 * コンストラクタ
	 * @param {number} ax
	 * @param {number} ay
	 * @param {number} index
	 */
	constructor(ax: number, ay: number, index: number) {
		const bgColor = index < BoxCanvas.KEY_ORDER.length ? BoxCellShape.ENABLED_COLOR : BoxCellShape.DISABLED_COLOR;
		const x = BoxCellShape.CELLSIZE * ax;
		const y = BoxCellShape.CELLSIZE * ay;
		super(x, y, BoxCellShape.CELLSIZE, bgColor, BoxCellShape.BOX_BORDER_COLOR);
		
		this._ax = ax;
		this._ay = ay;
	}

	// ACCESSOR
	get ax(): number {
		return this._ax;
	}

	get ay(): number {
		return this._ay;
	}
}