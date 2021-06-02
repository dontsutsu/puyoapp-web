import { BasePuyo } from "../../../game/puyo/base_puyo";
import { BasePuyoShape } from "./base_puyo_shape";

export class MiniTsumoListPuyoShape extends BasePuyoShape {
	private static readonly RADIUS = 8;
	private static readonly PADDING = 4;
	public static readonly DIAMETER = MiniTsumoListPuyoShape.RADIUS * 2;
	private static readonly X_BASE = MiniTsumoListPuyoShape.DIAMETER + MiniTsumoListPuyoShape.PADDING;

	/**
	 * コンストラクタ
	 * @param {number} index 
	 * @param {number} type 
	 * @param {string} color 
	 */
	constructor(index: number, type: number) {
		const { x, y } = MiniTsumoListPuyoShape.getXY(index, type);
		super(x, y, BasePuyo.NONE, MiniTsumoListPuyoShape.RADIUS);
	}

	/**
	 * 
	 * @param index 
	 * @param type 
	 * @returns 
	 */
	public static getXY(index: number, type: number): {x: number, y: number} {
		const x = MiniTsumoListPuyoShape.X_BASE * index;
		const y = MiniTsumoListPuyoShape.DIAMETER * type;
		return { x, y };
	}
}