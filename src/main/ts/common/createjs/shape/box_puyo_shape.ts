import { BasePuyoShape } from "./base_puyo_shape";
import { BoxCellShape } from "./box_cell_shape";

/**
 * Boxぷよ
 */
export class BoxPuyoShape extends BasePuyoShape {
	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 * @param color
	 */
	constructor(x: number, y: number, color: string) {
		super(color, BoxCellShape.CELLSIZE);
		this.x = BoxCellShape.CELLSIZE * x;
		this.y = BoxCellShape.CELLSIZE * y;
	}
}