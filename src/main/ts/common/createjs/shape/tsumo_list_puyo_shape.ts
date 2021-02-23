import { BasePuyoShape } from "./base_puyo_shape";
import { TsumoListCellShape } from "./tsumo_list_cell_shape";

/**
 * TsumoListぷよ
 */
export class TsumoListPuyoShape extends BasePuyoShape {
	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 * @param color 色
	 * @param type 0: 子ぷよ、1: 親ぷよ
	 */
	constructor(x: number, y: number, color: string, type: number) {
		super(color, TsumoListCellShape.CELLSIZE);

		const xy = TsumoListCellShape.getXandY(x, y, type);

		this.x = xy.x;
		this.y = xy.y;
	}

}
