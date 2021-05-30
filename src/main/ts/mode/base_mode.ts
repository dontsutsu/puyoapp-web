import { Ticker } from "@createjs/tweenjs";
import { FieldCanvas } from "../canvas/field_canvas";
import { NextCanvas } from "../canvas/next_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { Puyopuyo } from "../game/puyopuyo";
import $ from "jquery";

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
		this._timelineList = new TimelineList();

		$(".modeLink").on("click", (e) => {
			// リンクでの遷移を取り消し
			e.preventDefault();

			// フィールドの文字列を取得
			const field = this._puyopuyo.getFieldString();

			// fieldの文字列をパラメータに設定してPOST
			const $form = $("<form></form>", {
				method: "post",
				action: $(e.currentTarget).attr("href")
			});
			$form.append($("<input></input>", {
				type: "hidden",
				name: "field",
				value: field
			}));
			$form.appendTo(document.body);
			$form.submit();
		});
	}
}