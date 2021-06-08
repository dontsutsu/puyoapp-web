import { EditableMode } from "./editable_mode";
import { Field } from "../game/field";
import { Tsumo } from "../game/tsumo";
import { BasePuyo } from "../game/puyo/base_puyo";
import { EnumTsumoChildPosition } from "../game/enum_tsumo_child_position";
import { TsumoListCanvas } from "../canvas/tsumo_list_canvas";
import { FieldCanvas } from "../canvas/field_canvas";
import { MiniTsumoListCanvas } from "../canvas/mini_tsumo_list_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { Constant } from "../util/constant";
import { BaseMode } from "./base_mode";

import $ from "jquery";

// entry point
$(() => {
	new Nazotoki();
});

export class Nazotoki extends EditableMode {
	// property
	private _tsumoListCanvas: TsumoListCanvas;
	private _miniTsumoListCanvas: MiniTsumoListCanvas;
	private _answerList: Tsumo[][];

	/**
	 * constructor
	 */
	constructor() {
		super();
		this._tsumoListCanvas = new TsumoListCanvas();
		this._miniTsumoListCanvas = new MiniTsumoListCanvas();
		this._answerList = [];

		$("#nazoType").val("1");
		this.nazoSwitch("1");

		// event
		this._tsumoListCanvas.setMouseEvent(this);

		$("#nazoType").on("change", (e) => {
			this.nazoSwitch((e.currentTarget as HTMLInputElement).value);
		});

		$("#findAnswer").on("click", () => {
			this.findNazopuyoAnswer();
		});

		$("#playAnswer").on("click", () => {
			// 正答リストがないときは何もしない
			if (this._answerList.length == 0) return;

			// 再生中は不可
			if (this._timelineList.isAnimation) return false;

			this.playAnswer();
		});

		$("#back").on("click", () => {
			this.changeEditMode();
		});
	}

	// method
	/**
	 * ツモリストの指定のindex、typeのぷよを変更します。
	 * @param index index（0～9）
	 * @param type 0：子ぷよ、1：軸ぷよ
	 */
	public changeTsumoListPuyo(index: number, type: number): void {
		const color = this.getSelectColor();
		if (color != BasePuyo.GREEN
			&& color != BasePuyo.RED
			&& color != BasePuyo.BLUE
			&& color != BasePuyo.YELLOW
			&& color != BasePuyo.PURPLE
			&& color != BasePuyo.NONE) return;
		this.doWithRecordHistory(() => {
			this._tsumoListCanvas.changeColor(index, type, color);
		});
	}

	/**
	 * @inheritdoc
	 */
	protected getState(): string {
		return this._puyopuyo.getFieldString() + this._tsumoListCanvas.getTsumoListString();
	}

	/**
	 * @inheritdoc
	 */
	protected setState(state: string) {
		const lenField = Field.X_SIZE * Field.Y_SIZE;

		const field = state.substring(0, lenField);
		const tsumoList = state.substring(lenField, state.length);

		this._puyopuyo.setField(field);
		this._tsumoListCanvas.setTsumoList(tsumoList);
	}

	/**
	 * @inheritdoc
	 */
	protected clear(): void {
		this._puyopuyo.clearField();
		this._tsumoListCanvas.clear();
		this.clearAnswerList();
		this.changeEditMode();
	}

	/**
	 *
	 * @param nazoType なぞぷよの種類
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
	 private findNazopuyoAnswer(): void {
		if (!this._tsumoListCanvas.check()) {
			alert("ツモの設定が不正です。");
			return;
		}

		BaseMode.displayLoading(Constant.AJAX_CONNECTING_MSG);

		this.findNazopuyoAnswerAjax()
			.done((data: FindNazopuyoAnswerInterface[][]) => {
				// 一旦こたえリストクリア
				this.clearAnswerList();

				// こたえリストセット
				this._answerList = this.createTsumoListListFromAjaxData(data);
				const len = this._answerList.length;

				// ラジオボタンの表示
				// 正答数の分だけオン
				for (let i = 0; i < len; i++) {
					$("#ans" + (i + 1)).prop("disabled", false);
					if (i == 0) $("#ans" + (i + 1)).prop("checked", true);
				}

				// メッセージの表示
				if (len <= 0) {
					// こたえなし
					this.changeEditMode();
					BaseMode.displayDialog("解答が見つかりませんでした。", "1");
				} else {
					// こたえあり
					this.changePlayMode();
					if (len < 10) {
						BaseMode.displayDialog(len + "件の解答が見つかりました。", "0");
					} else {
						BaseMode.displayDialog("10件以上の解答が見つかりました。10件のみ表示します。", "0");
					}
				}
			})
			.fail(() => {
				// 通信エラー
				this.changeEditMode();
				BaseMode.displayDialog(Constant.AJAX_ERROR_MSG, "2");
			})
			.always(() => {
				BaseMode.removeLoading();
			});
	}

	/**
	 * なぞぷよ正答リストをクリアします。
	 */
	private clearAnswerList(): void {
		this._answerList.length = 0;
		$("#nazoAnswer input[type='radio']").prop("disabled", true);
	}

	/**
	 * 検索時のajax通信
	 * @returns {JQuery.jqXHR<any>}
	 */
	private findNazopuyoAnswerAjax(): JQuery.jqXHR<any> {
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
			url: "/findNazopuyoAnswer",
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: "json"
		});
	}

	/**
	 * ajaxのdataからツモの配列を生成します。
	 * @param data
	 * @returns {Tsumo[][]}
	 */
	private createTsumoListListFromAjaxData(data: FindNazopuyoAnswerInterface[][]): Tsumo[][] {
		const answerList: Tsumo[][] = [];
		for (let n = 0; n < data.length; n++) {	// 正答数のループ
			const dataAnswer = data[n];
			const answer: Tsumo[] = [];
			for (let i = 0; i < dataAnswer.length; i++) {
				const dataTsumo = dataAnswer[i];
				const tsumo = new Tsumo(dataTsumo.axisColor, dataTsumo.childColor);
				tsumo.axisX = Number(dataTsumo.axisX);
				tsumo.setChildPositionByEnumName(dataTsumo.tsumoPosition);
				answer.push(tsumo);
			}
			answerList.push(answer);
		}
		return answerList;
	}

	/**
	 * こたえを再生する
	 */
	private playAnswer(): void {
		const timelineList = new TimelineList();

		// 再生前のフィールドの状態を保持しておく
		const oldField = this._puyopuyo.getFieldString();

		// 選択しているツモリストを取得
		const index = this.getAnsListIndex();
		const tsumoList = this._answerList[index];

		const length = tsumoList.length;

		// 再生用ツモリストセット
		// アニメーション用に後ろに空のツモを3つ追加しておく
		const playTsumoList: Tsumo[] = [];
		for (let i = 0; i < length + 3; i++) {
			let tsumo: Tsumo;
			if (i < length) {
				tsumo = new Tsumo(tsumoList[i].axisColor, tsumoList[i].childColor);
			} else {
				tsumo = new Tsumo(BasePuyo.NONE, BasePuyo.NONE);
			}
			playTsumoList.push(tsumo);
		}
		this._puyopuyo.setTsumoList(playTsumoList);

		// ツモリスト分処理を行い、アニメーションをセットする
		for (let i = 0; i < length; i++) {
			const tsumo = tsumoList[i];

			// 1. rotate
			const pos = tsumo.tsumoChildPosition;
			if (pos == EnumTsumoChildPosition.RIGHT) {
				const rotateTlList = this._puyopuyo.rotateTsumo(true);
				timelineList.add(rotateTlList);
			} else if (pos == EnumTsumoChildPosition.LEFT) {
				const rotateTlList = this._puyopuyo.rotateTsumo(false);
				timelineList.add(rotateTlList);
			} else if (pos == EnumTsumoChildPosition.BOTTOM) {
				const rotateTlList1 = this._puyopuyo.rotateTsumo(true);
				const rotateTlList2 = this._puyopuyo.rotateTsumo(true);
				timelineList.add(rotateTlList1, rotateTlList2);
			}

			// 2. move
			const vec = tsumo.axisX - Tsumo.INI_AXIS_X;
			const moveTlList = this._puyopuyo.moveTsumo(vec);
			timelineList.add(moveTlList);

			// 3. drop
			const dropTlList = this._puyopuyo.dropTsumoToField();
			const advanceTsumoTlList = this._puyopuyo.advanceTsumo();
			timelineList.add(dropTlList, advanceTsumoTlList);

			// 4. STEPの場合止める
			if (BaseMode.getAnimateMode() == 0) {
				const stopTlList = FieldCanvas.createStopTlList();
				timelineList.add(stopTlList);
			}
		}

		this._timelineList = timelineList;

		// 前処理、後処理
		const before = () => { };
		const after = () => {
			this._puyopuyo.setField(oldField);
			this._puyopuyo.setScore(0);
		};

		// 再生
		this._timelineList.play(before, after);
	}

	/**
	 * 現在選択しているこたえのindexを取得
	 * @returns
	 */
	private getAnsListIndex(): number {
		return Number($("#nazoAnswer input[type='radio']:checked").val()) - 1;
	}

	/**
	 * 編集モードに切り替える
	 */
	private changeEditMode(): void {
		$("#undo").prop("disabled", false);
		$("#redo").prop("disabled", false);
		$("#nazoInfo").animate({height: "show", opacity: 1}, 300);
		$("#nazoAnswer").animate({height: "hide", opacity: 0}, 300);
		this._fieldCanvas.isEditable = true;
		this._tsumoListCanvas.isEditable = true;
		this._timelineList.skipToEnd();
	}

	/**
	 * 再生モードに切り替える
	 */
	private changePlayMode(): void {
		$("#undo").prop("disabled", true);
		$("#redo").prop("disabled", true);
		this.setNazoInfo();
		$("#nazoInfo").animate({height: "hide", opacity: 0}, 300);
		$("#nazoAnswer").animate({height: "show", opacity: 1}, 300);
		this._fieldCanvas.isEditable = false;	// フィールド変更不可
		this._tsumoListCanvas.isEditable = false;
	}

	/**
	 * 再生モードで表示する、なぞぷよ情報を設定
	 */
	private setNazoInfo(): void {
		const tsumoListStr = this._tsumoListCanvas.getTsumoListString();
		this._miniTsumoListCanvas.setTsumoList(tsumoListStr);

		const q = $("#nazoType option:selected").text();
		const req = $("#nazoRequire option:selected").text();
		$("#question").text(q.replace("XX", req));
	}
}

/**
 * Ajax（findNazopuyoAnswer）の取得データInterface
 */
interface FindNazopuyoAnswerInterface {
	axisColor: string;
	childColor: string;
	tsumoPosition: string;
	axisX: string;
}