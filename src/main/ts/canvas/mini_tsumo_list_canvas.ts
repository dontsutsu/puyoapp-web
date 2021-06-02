import { BaseCanvas } from "./base_canvas";
import { MiniTsumoListPuyoShape } from "./shape/puyo_shape/mini_tsumo_list_puyo_shape";
import { TsumoListCanvas } from "./tsumo_list_canvas";
import $ from "jquery";

export class MiniTsumoListCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly CANVAS_ID = "miniTsumoList";
	
	// CLASS FIELD
	private _puyoShapeArray: MiniTsumoListPuyoShape[][];

	/**
	 * コンストラクタ
	 */
	constructor() {
		super(MiniTsumoListCanvas.CANVAS_ID, false);

		this._puyoShapeArray = [];

		const { x, y } = MiniTsumoListPuyoShape.getXY(TsumoListCanvas.I_SIZE, 1);
		const w = x + MiniTsumoListPuyoShape.DIAMETER;
		const h = y + MiniTsumoListPuyoShape.DIAMETER;
		$("#" + MiniTsumoListCanvas.CANVAS_ID).attr("width", 1 + Math.ceil(w));
		$("#" + MiniTsumoListCanvas.CANVAS_ID).attr("height", 1 + Math.ceil(h));
		
		for (let i = 0; i < TsumoListCanvas.I_SIZE; i++) {
			const iArray: MiniTsumoListPuyoShape[] = [];
			for (let t = 0; t < 2; t++) {	// child: t=0, axis: t=1
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

			this._puyoShapeArray[index][1].setGraphics(axisColor);
			this._puyoShapeArray[index][0].setGraphics(childColor);
		}
		this._stage.update();
		this._stage.update();
	}

}