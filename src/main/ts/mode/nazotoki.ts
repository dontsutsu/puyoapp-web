import { EditableMode } from "./editable_mode";
import $ from "jquery";
import { TsumoListCanvas } from "../canvas/tsumo_list_canvas";
import { Util } from "../util/util";
import { Tsumo } from "../game/tsumo";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { BasePuyo } from "../game/puyo/base_puyo";
import { EnumTsumoPosition } from "../game/enum_tsumo_position";

$(() => {
	new Nazotoki();
});

export class Nazotoki extends EditableMode {
	// CLASS FIELD
	private _tsumoListCanvas: TsumoListCanvas;
	private _correctTsumoList: Tsumo[][];

	constructor() {
		super();
		this._tsumoListCanvas = new TsumoListCanvas();
		this._correctTsumoList = [];

		$("#nazoType").val("1");
		this.nazoSwitch("1");

		// event
		this._tsumoListCanvas.setMouseEvent(this);

		$("#nazoType").on("change", (e) => {
			this.nazoSwitch((e.currentTarget as HTMLInputElement).value);
		});

		$("#search").on("click", () => {
			this.search();
		});

		$("#play").on("click", () => {
			// 正答リストがないときは何もしない
			if (this._correctTsumoList.length == 0) return;

			this._timelineList = this.playCorrect();
			this._timelineList.play();
		});
	}

	/**
	 * 
	 * @param index 
	 * @param type 
	 */
	public changeTsumoListPuyo(index: number, type: number): void {
		const color = this.getSelectColor();
		this._tsumoListCanvas.changeColor(index, type, color);
	}

	/**
	 * 
	 * @param nazoType 
	 */
	private nazoSwitch(nazoType: string): void {
		$("#nazoRequire").children().remove();
		switch (nazoType) {
			case "1" :	// XX連鎖するべし
				$("#nazoRequire").prop("disabled", false);
				for (let i = 1; i <= 19; i++) {
					$("#nazoRequire").append($("<option>").attr({value: i}).text(i));
				}
				break;
			case "2" :	// ぷよすべて消すべし
				$("#nazoRequire").prop("disabled", true);
				break;
			case "3" :	// XXぷよすべて消すべし
				$("#nazoRequire").prop("disabled", false);
				$("#nazoRequire").append($("<option>").attr({value: "1"}).text("みどり"));
				$("#nazoRequire").append($("<option>").attr({value: "2"}).text("あか"));
				$("#nazoRequire").append($("<option>").attr({value: "3"}).text("あお"));
				$("#nazoRequire").append($("<option>").attr({value: "4"}).text("きいろ"));
				$("#nazoRequire").append($("<option>").attr({value: "5"}).text("むらさき"));
				$("#nazoRequire").append($("<option>").attr({value: "9"}).text("おじゃま"));
				break;
			case "4" :	// XX色同時に消すべし
				$("#nazoRequire").prop("disabled", false);
				for (let i = 1; i <= 5; i++) {
					$("#nazoRequire").append($("<option>").attr({value: i}).text(i));
				}
				break;
			case "5" :	// XX匹同時に消すべし
				$("#nazoRequire").prop("disabled", false);
				for (let i = 4; i <= 72; i++) {
					$("#nazoRequire").append($("<option>").attr({value: i}).text(i));
				}
				break;
		}
	}

	/**
	 * なぞぷよの解答を検索します。
	 */
	 private search(): void {
		if (!this._tsumoListCanvas.check()) {
			alert("ツモの設定が不正です。");
			return;
		}

		Util.dispLoading("検索中です...");

		this.searchAjax()
			.done((data) => {
				this._correctTsumoList = this.convertSearchAjaxData(data);
				const len = this._correctTsumoList.length;

				// ラジオボタンの表示
				// 一旦全部オフにする
				$("#anslistDiv input[type='radio']").prop("disabled", true);
				// 正答数の分だけオン
				for (let i = 0; i < len; i++) {
					$("#ans" + (i + 1)).prop("disabled", false);

					if (i == 0) $("#ans" + (i + 1)).prop("checked", true);
				}

				// メッセージの表示
				if (len <= 0) {
					$("#anslistDiv").animate({height: "hide", opacity: 0}, 300);
					$("#play").addClass("disabled");
					Util.dispMsg("解答が見つかりませんでした。", "1");
				} else {
					$("#anslistDiv").animate({height: "show", opacity: 1}, 300);
					$("#play").removeClass("disabled");
					if (len < 10) {
						Util.dispMsg(len + "件の解答が見つかりました。", "0");
					} else {
						Util.dispMsg("10件以上の解答が見つかりました。10件のみ表示します。", "0");
					}
				}
			})
			.fail(() => {
				this.clearCorrectList();
				Util.dispMsg("サーバーとの通信に失敗しました。", "2");
			})
			.always(() => {
				Util.removeLoading();
			});
	}

	/**
	 * なぞぷよ正答リストをクリアします。
	 */
	private clearCorrectList(): void {
		this._correctTsumoList.length = 0;
		$("#anslistDiv input[type='radio']").prop("disabled", true);
		$("#play").addClass("disabled");
	}

	/**
	 * 
	 */
	private searchAjax(): JQuery.jqXHR<any> {
		const fieldStr = this._puyopuyo.getFieldString();
		const tsumoListStr = this._tsumoListCanvas.getTsumoListString();
		const nazoType = $("#nazoType").val() as string;
		const nazoRequire = $("#nazoRequire").val() as string;

		const data = {
			field: fieldStr,
			tsumoList: tsumoListStr,
			nazoType: nazoType,
			nazoRequire: nazoRequire
		};

		return $.ajax({
			type: "POST",
			url: "/search",
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: "json"
		});
	}

	/**
	 * 
	 * @param data 
	 */
	private convertSearchAjaxData(data: any): Tsumo[][] {
		const dataCorrectList = data.correctList;
		const correctList: Tsumo[][] = [];
		for (let n = 0; n < dataCorrectList.length; n++) {	// 正答数のループ
			const dataCorrect = dataCorrectList[n];
			const correct: Tsumo[] = [];
			for (let i = 0; i < dataCorrect.length; i++) {
				const dataTsumo = dataCorrect[i];
				const tsumo = new Tsumo(dataTsumo.axisColor, dataTsumo.childColor);
				tsumo.axisX = Number(dataTsumo.axisX);
				tsumo.setTsumoPositionByEnumName(dataTsumo.tsumoPosition);
				correct.push(tsumo);
			}
			correctList.push(correct);
		}
		return correctList;
	}

	/**
	 * 
	 */
	private playCorrect(): TimelineList {
		const timelineList = new TimelineList();

		// 選択しているツモリストを取得
		const index = this.getAnsListIndex();
		const tsumoList = this._correctTsumoList[index];

		const length = tsumoList.length;

		// ツモリストセット
		// アニメーション用に後ろに空のツモを3つ追加しておく
		for (let i = 0; i < 3; i++) tsumoList.push(new Tsumo(BasePuyo.NONE, BasePuyo.NONE));
		this._puyopuyo.setTsumoList(tsumoList);
		
		for (let i = 0; i < length; i++) {
			const tsumo = tsumoList[i];

			// rotate
			const pos = tsumo.tsumoPosition;
			if (pos == EnumTsumoPosition.RIGHT) {
				const rotateTlList = this._puyopuyo.rotateTsumo(true);
				timelineList.add(rotateTlList);
			} else if (pos == EnumTsumoPosition.LEFT) {
				const rotateTlList = this._puyopuyo.rotateTsumo(false);
				timelineList.add(rotateTlList);
			} else if (pos == EnumTsumoPosition.BOTTOM) {
				const rotateTlList1 = this._puyopuyo.rotateTsumo(true);
				const rotateTlList2 = this._puyopuyo.rotateTsumo(true);
				timelineList.add(rotateTlList1, rotateTlList2);
			}

			// move
			const vec = tsumo.axisX - Tsumo.INI_AXIS_X;
			const moveTlList = this._puyopuyo.moveTsumo(vec);
			timelineList.add(moveTlList);

			// drop
			const dropTlList = this._puyopuyo.dropTsumoToField();
			const advanceTsumoTlList = this._puyopuyo.advanceTsumo();
			timelineList.add(dropTlList, advanceTsumoTlList);
		}

		return timelineList;
	}

	/**
	 * 
	 * @returns 
	 */
	private getAnsListIndex(): number {
		return Number($("#anslistDiv input[type='radio']:checked").val()) - 1;
	}

}

