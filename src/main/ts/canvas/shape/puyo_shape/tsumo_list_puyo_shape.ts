import { BasePuyo } from "../../../game/puyo/base_puyo";
import { BasePuyoShape } from "./base_puyo_shape";
import { TsumoListCellShape } from "../cell_shape/tsumo_list_cell_shape";

export class TsumoListPuyoShape extends BasePuyoShape {
	/**
	 * コンストラクタ
	 * @param {number} ax 
	 * @param {number} ay 
	 * @param {number} type
	 * @param {string} color
	 */
	constructor(ax: number, ay: number, type: number, color: string = BasePuyo.NONE) {
		const {x, y} = TsumoListCellShape.getXandY(ax, ay, type);
		const radius = TsumoListCellShape.CELLSIZE / 2;
		super(x, y, color, radius);
	}
}