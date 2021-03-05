import { BoxCellShape } from "../cell_shape/box_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";


/**
 * Boxぷよ
 */
export class BoxPuyoShape extends BasePuyoShape {
	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 * @param color 色
	 */
	constructor(x: number, y: number, color: string) {
		super(color, BoxCellShape.CELLSIZE);
		this.x = BoxCellShape.CELLSIZE * x;
		this.y = BoxCellShape.CELLSIZE * y;
	}
}