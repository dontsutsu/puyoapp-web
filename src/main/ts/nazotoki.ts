import $ from "jquery";
import { Ajax } from "./ajax/ajax";
import { Game } from "./game/game";
import { Tsumo } from "./game/ui/canvas/tsumo";
import { TsumoList } from "./game/ui/canvas/tsumo_list";
import { PuyoTimelineList } from "./game/ui/timeline/puyo_timeline_list";
import { Util } from "./util/util";

$(function() {
	new Nazotoki();
});

export class Nazotoki extends Game {
    private _tsumoList: TsumoList;
    private _correctList: CorrectList[][]

    constructor() {
		super();

		// init
		this._correctList = [];
		this._tsumoList = new TsumoList(this);

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
			this.clear();
		});
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

		this.play(correct);
	}

    /**
	 * なぞぷよの正答アニメーションを再生します。
	 */
	public play(correct: CorrectList[]): void {

		const puyoTlList = new PuyoTimelineList();

		const ac1 = correct[0].ac;
		const cc1 = correct[0].cc;

		const ac2 = (correct.length >= 2) ? correct[1].ac : "0";
		const cc2 = (correct.length >= 2) ? correct[1].cc : "0";

		this._next.setInitialNext(ac1, cc1, ac2, cc2)

		for (let i = 0; i < correct.length; i++) {
			const correctTsumo = correct[i];
			const dnac = (correct.length > (i + 2)) ? correct[i+2].ac : "0";
			const dncc = (correct.length > (i + 2)) ? correct[i+2].cc : "0";
			this._next.pushAndPop(dnac, dncc, puyoTlList);
			this._tsumo.setTsumo(correctTsumo.ac, correctTsumo.cc, puyoTlList);

			// 回転
			if (correctTsumo.ax > correctTsumo.cx) {
				// 親ぷよの方が右の場合、右回転
				this._tsumo.rotateLeft(puyoTlList);
			} else if (correctTsumo.cx > correctTsumo.ax) {
				// 子ぷよの方が右の場合、左回転
				this._tsumo.rotateRight(puyoTlList);
			}

			if (correctTsumo.cy < correctTsumo.ay) {
				// 子ぷよの方が下の場合、右回転右回転
				// ※Java側は下がindex小、上がindex大
				this._tsumo.rotateRight(puyoTlList);
				this._tsumo.rotateRight(puyoTlList);
			}

			// 移動
			const mv = Number(correctTsumo.ax) - Tsumo.INI_X;
			this._tsumo.move(mv, puyoTlList);

			// 落下
			this._tsumo.drop(puyoTlList);
			this._field.dropTsumo(this._tsumo, puyoTlList);
		}

		puyoTlList.play(this);
	}

    /**
	 * 選択されている解答のインデックスを取得します。
	 */
	private getAnsListIndex(): number {
		return Number($("#anslistDiv input[type='radio']:checked").val()) - 1;
	}

    /**
	 * フィールド、ツモリストをクリアします。
	 */
	public clear(): void {
		const confirm = window.confirm("クリアしますか？");
		if (!confirm) return;

		this.clearField();
	}

    /**
	 * なぞぷよの解答を検索します。
	 */
	public search(): void {
		if (!this.tsumoListCheck()) {
			alert("ツモの設定が不正です。");
			return;
		}
		const fieldStr = this.getFieldString();
		const tsumoListStr = this.getTsumoListString();

		const nazoType = $("#nazoType").val() as string;
		const nazoRequire = $("#nazoRequire").val() as string;

		Util.dispLoading("検索中です...");

		Ajax.searchCorrect(fieldStr, tsumoListStr, nazoType, nazoRequire)
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
}

/**
 * 
 */
export interface CorrectList {
	ax: string;
	ay: string;
	ac: string;
	cx: string;
	cy: string;
	cc: string;
}