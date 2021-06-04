import { BasePuyoShape } from "./base_puyo_shape";
import { MiniTsumoListCanvas } from "../../mini_tsumo_list_canvas";
import { BasePuyo } from "../../../game/puyo/base_puyo";

export class MiniTsumoListPuyoShape extends BasePuyoShape {
	// constant
	private static readonly RADIUS = 8;
	public static readonly DIAMETER = MiniTsumoListPuyoShape.RADIUS * 2;

	/**
	 * constructor
	 * @param {number} index ツモ順
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 */
	constructor(index: number, type: number) {
		const canvasCoord = MiniTsumoListCanvas.getCanvasCoordinate(index, type);
		super(canvasCoord.x, canvasCoord.y, BasePuyo.NONE, MiniTsumoListPuyoShape.RADIUS);
	}
}