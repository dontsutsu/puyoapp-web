import $ from "jquery";
import { Game, GameMode } from "./game/game";
import { Util } from "./util/util";
import { Ajax } from "./ajax/ajax";

$(function() {
    new Main();
});

export class Main {

	private _game: Game;
	private _correctList: CorrectList[][]

    constructor() {
		const gameMode = GameMode.EDITOR;

		this._game = new Game(gameMode);
		this._correctList = [];

		// mode
		$(`#${gameMode}`).prop("checked", true);
		this.switchMode(gameMode);
		
		// nazoType
		$("#nazoType").val("1");
		this.nazoSwitch("1");

		// イベント
		$("input[name='mode']").on("change", (e) => {
			this.switchMode((e.currentTarget as HTMLInputElement).value as GameMode);
		});

		$("#nazoType").on("change", (e) => {
			this.nazoSwitch((e.currentTarget as HTMLInputElement).value);
		});

		$("#drop").on("click", () => {
			if (!this._game.isEditorMode()) return;
			this.drop();
		});

		$("#search").on("click", () => {
			if (!this._game.isNazotokiMode()) return;
			this.search();
		});

		$("#play").on("click", () => {
			if (!this._game.isNazotokiMode()) return;
			this.play();
		});

		$("#clear").on("click", () => {
			if (!(this._game.isEditorMode() || this._game.isNazotokiMode())) return;
			this.clear();
		});

		$("#undo").on("click", () => {
			this._game.undo();
		});

		$("#redo").on("click", () => {
			this._game.redo();
		});

		$("#speed").on("input", (e) => {
			const val = (e.currentTarget as HTMLInputElement).value;
			$("#speedVal").text(val);
		});

		$("html").on("keydown", (e) => {
			if (!this._game.isTokopuyoMode()) return;
			switch(e.key) {
				case "ArrowRight" : // Key[→]
					this._game.right();
				break;

				case "ArrowLeft" : // Key[←]
					this._game.left();
				break;

				case "ArrowDown" : // Key[↓]
					this._game.tsumoDrop();
				break;

				case "z" : // Key[z]
					this._game.rotateLeft();
				break;

				case "x" : // Key[x]
					this._game.rotateRight();
				break;
			}
		});
	}

	/**
	 * 指定のモードに変更します。
	 * @param gameMode
	 */
	public switchMode(gameMode: GameMode): void {
		this._game.switchMode(gameMode);
		this.clearCorrectList();

		switch (gameMode) {
			case GameMode.EDITOR :
				$("#anslistDiv").animate({height: "hide", opacity: 0}, 300);
				$("#tsumoListDiv").animate({height: "hide", opacity: 0}, 300);
				$("#boxDiv").animate({height: "show", opacity: 1}, 300);
				$("#nazoDiv").animate({height: "hide", opacity: 0}, 300);
				$("#nazotokiButtonDiv").animate({height: "hide", opacity: 0}, 300);
				$("#editorButtonDiv").animate({height: "show", opacity: 1}, 300);
				break;
			case GameMode.TOKOPUYO :
				$("#anslistDiv").animate({height: "hide", opacity: 0}, 300);
				$("#tsumoListDiv").animate({height: "hide", opacity: 0}, 300);
				$("#boxDiv").animate({height: "hide", opacity: 0}, 300);
				$("#nazoDiv").animate({height: "hide", opacity: 0}, 300);
				$("#nazotokiButtonDiv").animate({height: "hide", opacity: 0}, 300);
				$("#editorButtonDiv").animate({height: "hide", opacity: 0}, 300);
				break;
			case GameMode.NAZOTOKI :
				$("#tsumoListDiv").animate({height: "show", opacity: 1}, 300);
				$("#boxDiv").animate({height: "show", opacity: 1}, 300);
				$("#nazoDiv").animate({height: "show", opacity: 1}, 300);
				$("#nazotokiButtonDiv").animate({height: "show", opacity: 1}, 300);
				$("#editorButtonDiv").animate({height: "hide", opacity: 0}, 300);
				break;
		}
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
	public play(): void {
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
		if (!this._game.tsumoListCheck()) {
			alert("ツモの設定が不正です。");
			return;
		}
		const fieldStr = this._game.getFieldString();
		const tsumoListStr = this._game.getTsumoListString();

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

	/**
	 * フィールド、ツモリストをクリアします。
	 */
	public clear(): void {
		const confirm = window.confirm("クリアしますか？");
		if (!confirm) return;

		this._game.clear();
	}

	/**
	 * フィールドのぷよを落とします。
	 */
	public drop(): void {
		this._game.drop();
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