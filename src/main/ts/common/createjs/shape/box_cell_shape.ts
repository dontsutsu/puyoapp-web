import { Box } from "../canvas/box";
import { BaseCellShape } from "./base_cell_shape";

/**
 * Boxセル
 */
export class BoxCellShape extends BaseCellShape {
	public static readonly ENABLED_COLOR = "#FFFFFF";
	public static readonly DISABLED_COLOR = "#666666";
	public static readonly BOX_BORDER_COLOR = "#CCCCCC";

	public static readonly CELLSIZE = 35;

	/**
	 * @param x
	 * @param y
	 * @param index
	 */
	constructor(x: number, y: number, index: number) {
		const bgColor = index < Box.KEY_ORDER.length ? BoxCellShape.ENABLED_COLOR : BoxCellShape.DISABLED_COLOR;
		super(x, y, BoxCellShape.CELLSIZE, bgColor, BoxCellShape.BOX_BORDER_COLOR);

		this.x = BoxCellShape.CELLSIZE * x;
		this.y = BoxCellShape.CELLSIZE * y;
	}
}