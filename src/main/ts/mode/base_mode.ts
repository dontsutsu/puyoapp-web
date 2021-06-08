import { Ticker } from "@createjs/tweenjs";
import { FieldCanvas } from "../canvas/field_canvas";
import { NextCanvas } from "../canvas/next_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { Puyopuyo } from "../game/puyopuyo";
import $ from "jquery";

export abstract class BaseMode {
	// property
	protected _fieldCanvas: FieldCanvas;
	protected _tsumoCanvas: TsumoCanvas;
	protected _nextCanvas: NextCanvas;
	protected _puyopuyo: Puyopuyo;
	protected _timelineList: TimelineList;
	
	/**
	 * constructor
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

	// static method
	/**
	 * ステップ再生かアニメーション再生か、画面のラジオボタンから取得する。
	 * @returns {number} 0：ステップ、1：アニメーション
	 */
	 public static getAnimateMode(): number {
		return $("input:radio[name='animation']:checked").val() as number;
	}

	/**
	 * ローディング画面を表示する。
	 * @param {string} [msg] 
	 */
	public static displayLoading(msg: string = ""): void {
		$("#loadMsg").text(msg);
		$("#load").fadeIn(300);
	}

	/**
	 * ローディング画面を非表示にする。
	 */
	public static removeLoading(): void {
		$("#load").fadeOut(300);
	}

	/**
	 * メッセージダイアログを表示する。
	 * @param {string} [msg] メッセージ
	 * @param {string} [level] エラーレベル "0"：info、"1"：warning、"2"：error （デフォルトは"0"）
	 */
	 public static displayDialog(msg: string = "", level: string = "0"): void {
		const dispTime = 3000;

		let color;
		switch (level) {
			case "0" :
			color = "#5D627B";
			break;
		case "1" :
			color = "#F39800";
			break;
		case "2" :
			color = "#DD0000";
			break;
		default:
			level = "1";
			color = "#F39800";
		}

		const $upperMsgOld = $(".upperMsg");
		$upperMsgOld.remove();

		// メッセージを設定
		const $span = $("<span></span>").text(msg);
		const $upperMsg = $("<div></div>", {
			"class": "upperMsg"
		}).append($span);
		$("body").append($upperMsg);

		// メッセージボックスのスタイルを変更
		const negaMargin = ($upperMsg.width() as number) / 2 * (-1);
		$upperMsg.css("margin", "0 0 0 " + negaMargin + "px");
		$upperMsg.css("border-color", color);
		$upperMsg.css("color", color);

		$upperMsg.animate({
			top: "+=110px"
		}, 500, "swing", () => {
			$upperMsg.delay(dispTime).animate({
				top: "-=110px"
			}, 500, "swing", () => {
				$upperMsg.remove();
			});
		});
	}
}