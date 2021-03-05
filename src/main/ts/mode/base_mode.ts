import { Ticker } from "@createjs/tweenjs";
import { FieldCanvas } from "../canvas/field_canvas";
import { NextCanvas } from "../canvas/next_canvas";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { Puyopuyo } from "../game/puyopuyo";

export abstract class BaseMode {
	// CLASS FIELD
	private _fieldCanvas: FieldCanvas;
	private _tsumoCanvas: TsumoCanvas;
	private _nextCanvas: NextCanvas;

	private _puyopuyo: Puyopuyo;

	constructor() {
		// createjsで使用するアニメーションのフレームレートを設定しておく
		Ticker.timingMode = Ticker.RAF;

		this._fieldCanvas = new FieldCanvas();
		this._tsumoCanvas = new TsumoCanvas();
		this._nextCanvas = new NextCanvas();

		this._puyopuyo = new Puyopuyo();
	}
}