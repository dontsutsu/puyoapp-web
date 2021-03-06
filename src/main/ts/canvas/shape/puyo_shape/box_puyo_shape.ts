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
	constructor(ax: number, ay: number, color: string) {
		const x = BoxCellShape.CELLSIZE * ax;
		const y = BoxCellShape.CELLSIZE * ay;
		super(x, y, color, BoxCellShape.CELLSIZE);
	}
}