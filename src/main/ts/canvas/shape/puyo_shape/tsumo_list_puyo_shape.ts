import { BasePuyo } from "../../../game/puyo/base_puyo";
import { BasePuyoShape } from "./base_puyo_shape";
import { TsumoListCellShape } from "../cell_shape/tsumo_list_cell_shape";
import { TsumoListCanvas } from "../../tsumo_list_canvas";
import { Coordinate } from "../../../util/coordinate";

export class TsumoListPuyoShape extends BasePuyoShape {
	// constant
	private static readonly RADIUS = TsumoListCellShape.CELLSIZE / 2;

	/**
	 * constructor
	 * @param {Coordinate} coord ツモリストの座標 
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 * @param {string} color 色
	 */
	constructor(coord: Coordinate, type: number, color: string = BasePuyo.NONE) {
		const canvasCoord = TsumoListCanvas.getCanvasCoordinate(coord, type);
		super(canvasCoord.x, canvasCoord.y, color, TsumoListPuyoShape.RADIUS);
	}
}