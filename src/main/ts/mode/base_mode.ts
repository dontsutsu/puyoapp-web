import { Ticker } from "@createjs/tweenjs";
import { FieldCanvas } from "../canvas/field_canvas";
import { NextCanvas } from "../canvas/next_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { Puyopuyo } from "../game/puyopuyo";

export abstract class BaseMode {
	// CLASS FIELD
	protected _fieldCanvas: FieldCanvas;
	protected _tsumoCanvas: TsumoCanvas;
	protected _nextCanvas: NextCanvas;
	protected _puyopuyo: Puyopuyo;
	protected _timelineList: TimelineList;
	
	/**
	 * コンストラクタ
	 */
	constructor() {
		// createjsで使用するアニメーションのフレームレートを設定しておく
		Ticker.timingMode = Ticker.RAF;

		this._fieldCanvas = new FieldCanvas("field");
		this._tsumoCanvas = new TsumoCanvas("tsumo");
		this._nextCanvas = new NextCanvas("next");
		this._puyopuyo = new Puyopuyo(this._fieldCanvas, this._tsumoCanvas, this._nextCanvas);
		this._timelineList = new TimelineList;
	}
}