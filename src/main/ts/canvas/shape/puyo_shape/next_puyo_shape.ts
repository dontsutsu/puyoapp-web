import { BasePuyoShape } from "./base_puyo_shape";
import { NextCanvas } from "../../next_canvas";

export class NextPuyoShape extends BasePuyoShape {
	// constant
	private static readonly RADIUS = 12;
	public static readonly DIAMETER = NextPuyoShape.RADIUS * 2;

	/**
	 * constructor
	 * @param {number} next 0：ネクスト、1：ダブネク
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 * @param {string} color 色
	 */
	constructor(next: number, type: number, color: string) {
		const canvasCoord = NextCanvas.getCanvasCoordinate(next, type);
		super(canvasCoord, color, NextPuyoShape.RADIUS);
	}
}