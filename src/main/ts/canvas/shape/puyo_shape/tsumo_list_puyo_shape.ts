import { BasePuyo } from "../../../game/puyo/base_puyo";
import { BasePuyoShape } from "./base_puyo_shape";
import { TsumoListCellShape } from "../cell_shape/tsumo_list_cell_shape";

export class TsumoListPuyoShape extends BasePuyoShape {
	constructor(ax: number, ay:number, type: number, color: string = BasePuyo.NONE) {
		const {x, y} = TsumoListCellShape.getXandY(ax, ay, type);
		super(x, y, color, TsumoListCellShape.CELLSIZE);
	}
}