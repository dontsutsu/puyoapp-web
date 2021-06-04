import { BaseCanvas } from "./base_canvas";
import { MiniTsumoListPuyoShape } from "./shape/puyo_shape/mini_tsumo_list_puyo_shape";
import { TsumoListCanvas } from "./tsumo_list_canvas";
import { Coordinate } from "../util/coordinate";

import $ from "jquery";

export class MiniTsumoListCanvas extends BaseCanvas {
	// constant
	private static readonly CANVAS_ID = "miniTsumoList";
	private static readonly PADDING_X = 4;
	private static readonly TYPE_CHILD = 0;
	private static readonly TYPE_AXIS = 1;
	private static readonly TYPES = [MiniTsumoListCanvas.TYPE_CHILD, MiniTsumoListCanvas.TYPE_AXIS];

	// property
	private _puyoShapeArray: MiniTsumoListPuyoShape[][];

	/**
	 * constructor
	 */
	constructor() {
		super(MiniTsumoListCanvas.CANVAS_ID, false);

		this._puyoShapeArray = [];

		const canvasCoord = MiniTsumoListCanvas.getCanvasCoordinate(TsumoListCanvas.I_SIZE, 1);
		const w = canvasCoord.x + MiniTsumoListPuyoShape.DIAMETER;
		const h = canvasCoord.y + MiniTsumoListPuyoShape.DIAMETER;
		$("#" + MiniTsumoListCanvas.CANVAS_ID).attr("width", 1 + Math.ceil(w));
		$("#" + MiniTsumoListCanvas.CANVAS_ID).attr("height", 1 + Math.ceil(h));
		
		for (let i = 0; i < TsumoListCanvas.I_SIZE; i++) {
			const iArray: MiniTsumoListPuyoShape[] = [];
			for (const t of MiniTsumoListCanvas.TYPES) {
				const puyoShape = new MiniTsumoListPuyoShape(i, t);
				this._stage.addChild(puyoShape);
				iArray.push(puyoShape);
			}
			this._puyoShapeArray.push(iArray);
		}

		this._stage.update();
	}

	/**
	 * 
	 * @param tsumoListStr
	 */
	public setTsumoList(tsumoListStr: string): void {
		for (let i = 0; i < tsumoListStr.length; i += 2) {
			const index = i / 2;
			const axisColor = tsumoListStr.charAt(i);
			const childColor = tsumoListStr.charAt(i + 1);

			this._puyoShapeArray[index][MiniTsumoListCanvas.TYPE_AXIS].setGraphics(axisColor);
			this._puyoShapeArray[index][MiniTsumoListCanvas.TYPE_CHILD].setGraphics(childColor);
		}
		this._stage.update();
	}

	// static method
	/**
	 * ツモ順・ツモのタイプからcanvas上の座標を取得
	 * @param {number} index ツモ順
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 * @returns {Coordinate} canvas上の座標
	 */
	public static getCanvasCoordinate(index: number, type: number): Coordinate {
		const x = (MiniTsumoListPuyoShape.DIAMETER + MiniTsumoListCanvas.PADDING_X) * index;
		const y = MiniTsumoListPuyoShape.DIAMETER * type;
		return new Coordinate(x, y);
	}
}