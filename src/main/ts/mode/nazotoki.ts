import $ from "jquery";
import { TsumoList } from "../common/createjs/canvas/tsumo_list";
import { Field } from "../game/createjs/canvas/field";
import { TsumoInterface } from "../interface/tsumo_Interface";
import { Util } from "../util/util";
import { EditableMode } from "./editable_mode";

$(function() {
	new Nazotoki();
});

export class Nazotoki extends EditableMode {
	private _tsumoList: TsumoList;
	private _correctList: TsumoInterface[][]

	/**
	 * コンストラクタ
	 */
	constructor() {
		super();

		// init
		this._correctList = [];
		this._tsumoList = new TsumoList();
		this._tsumoList.setEventTsumoListCellShape(this);

		$("#nazoType").val("1");
		this.nazoSwitch("1");

		// event
		$("#nazoType").on("change", (e) => {
			this.nazoSwitch((e.currentTarget as HTMLInputElement).value);
		});

		$("#search").on("click", () => {
			this.search();
		});

		$("#play").on("click", () => {
			this.playCorrect();
		});

		$("#clear").on("click", () => {
			const confirm = window.confirm("クリアしますか？");
			if (!confirm) return;

			this.doWithRecordHistory(() => {
				this._game.clearField();
				this._tsumoList.clear();
			});
		});
	}

	/**
	 * @inheritdoc
	 */
	protected getState(): string {
		return this._game.getFieldString() + this._tsumoList.toString();
	}

	/**
	 * @inheritdoc
	 */
	protected setState(state: string): void {
		const lenField = Field.X_SIZE * Field.Y_SIZE;

		const field = state.substring(0, lenField);
		const tl = state.substring(lenField, state.length);

		this._game.field.setField(field);
		this._tsumoList.setTsumoList(tl);
	}

	/**
	 * ツモリストが想定通りの入力となっているかをチェックします。
	 * ① 1ツモ目は必ず入力されていること
	 * ② 各ツモはペアで入力されていること（どちらかのみの入力はエラー）
	 * ③ 間に未入力のツモを挟まないこと（例：1,2ツモ目入力、3ツモ目未入力、4ツモ目入力はエラー）
	 * @return true：チェックOK / false：チェックNG
	 */
	public tsumoListCheck(): boolean {
		return this._tsumoList.check();
	}

	/**
	 * ツモリストの文字列を取得します。
	 * @return 1手目軸ぷよ色、2手目子ぷよ色、2手目軸ぷよ色、・・・
	 */
	public getTsumoListString(): string {
		return this._tsumoList.toString();
	}

	/**
	 * なぞぷよ正答リストをクリアします。
	 */
	private clearCorrectList(): void {
		this._correctList = [];
		$("#anslistDiv input[type='radio']").prop("disabled", true);
		$("#play").addClass("disabled");
	}

	/**
	 * なぞぷよのお題を指定のものに変更します。
	 * その際、お題に必要な値を指定するコンボボックスの値を変更します。
	 * @param nazoType
	 */
	public nazoSwitch(nazoType: string): void {
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
	 * 正答リストを再生します。
	 */
	public playCorrect(): void {
		// 正答リストがないときは何もしない
		if (this._correctList.length == 0) {
			return;
		}

		const index = this.getAnsListIndex();
		const correct = this._correctList[index];

		this._game.play(correct);
	}

	/**
	 * 選択されている解答のインデックスを取得します。
	 */
	private getAnsListIndex(): number {
		return Number($("#anslistDiv input[type='radio']:checked").val()) - 1;
	}

	/**
	 * なぞぷよの解答を検索します。
	 */
	public search(): void {
		if (!this.tsumoListCheck()) {
			alert("ツモの設定が不正です。");
			return;
		}

		Util.dispLoading("検索中です...");

		this.searchAjax()
			.done((result) => {
				this._correctList = result.correctList;
				const len = result.correctList.length;

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
			.fail((result) => {
				this.clearCorrectList();
				Util.dispMsg("サーバーとの通信に失敗しました。", "2");
			})
			.always((result) => {
				Util.removeLoading();
			});
	}

	/**
	 * 
	 */
	private searchAjax(): JQuery.jqXHR<any> {
		const fieldStr = this._game.getFieldString();
		const tsumoListStr = this.getTsumoListString();
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
}