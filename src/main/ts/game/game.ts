import { Field } from "./ui/canvas/field";
import { Box } from "./ui/canvas/box";
import { Tsumo } from "./ui/canvas/tsumo";
import { TsumoList } from "./ui/canvas/tsumo_list";
import { Next } from "./ui/canvas/next";
import { PuyoTimelineList } from "./ui/timeline/puyo_timeline_list";
import { CorrectList } from "../main";

import { Ticker } from "@createjs/tweenjs";

/**
 * Gameクラス
 */
export class Game {
	public static readonly UNDO_MAX = 100;

	private _gameMode: GameMode;

	private _field: Field;
	private _box: Box;
	private _tsumo: Tsumo;
	private _tsumoList: TsumoList;
	private _next: Next;

	private _isAnimation: boolean;

	private _undoStack: string[];
	private _redoStack: string[];

	constructor(gameMode: GameMode) {
		this._gameMode = gameMode;

		// canvas
		this._field = new Field(this);
		this._box = new Box(this);
		this._tsumo = new Tsumo(this);
		this._tsumoList = new TsumoList(this);
		this._next = new Next(this);

		this._undoStack = [];
		this._redoStack = [];

		this._isAnimation = false;

		// フレームレート
		Ticker.timingMode = Ticker.RAF;
	}


	/**
	 * ツモを右へ移動します。
	 */
	public right(): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.move(1, puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * ツモを左へ移動します。
	 */
	public left(): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.move(-1, puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * ツモを右回転します。
	 */
	public rotateRight(): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.rotateRight(puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * ツモを左回転します。
	 */
	public rotateLeft(): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.rotateLeft(puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * フィールドのぷよを落とします。
	 */
	public drop(): void {
		const beforeField = this._field.toString();

		const puyoTlList = new PuyoTimelineList();
		this._field.drop(puyoTlList);
		puyoTlList.play(this);

		const afterField = this._field.toString();
				
		// UNDOの履歴を残す
		if (beforeField != afterField) this.pushUndoStack(beforeField);
	}

	/**
	 * ツモを落とします。
	 */
	public tsumoDrop(): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.drop(puyoTlList);
		this._field.dropTsumo(this._tsumo, puyoTlList);
		puyoTlList.play(this);
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
	 * フィールド情報を文字列で取得します。
	 * @return フィールド文字列 [1段目1列目、1段目2列目、・・・、1段目6列目、2段目1列目、・・・、13段目6列目]
	 */
	public getFieldString(): string {
		return this._field.toString();
	}

	/**
	 * ツモリストの文字列を取得します。
	 * @return 1手目軸ぷよ色、2手目子ぷよ色、2手目軸ぷよ色、・・・
	 */
	public getTsumoListString(): string {
		return this._tsumoList.toString();
	}

	/**
	 * フィールドとツモリストをクリアします。
	 */
	public clear(): void {
		const beforeField = this._field.toString();

		this._field.clear();
		this._tsumoList.clear();

		const afterField = this._field.toString();

		// UNDOの履歴を残す
		if (beforeField != afterField) this.pushUndoStack(beforeField);
	}

	/**
	 * 選択中の色を取得します。
	 * @return 選択中の色
	 */
	public getSelectColor() :string {
		return this._box.selectColor;
	}

	/**
	 * 元に戻します（UNDO機能）。
	 */
	public undo(): void {
		const undo = this._undoStack.pop();
		if (undo !== undefined) {
			this._redoStack.push(this._field.toString());
			this._field.setField(undo);
		}
	}

	/**
	 * UNDO用の履歴を残します。
	 */
	public pushUndoStack(beforeField: string): void {
		this._undoStack.push(beforeField);

		// 一番古い履歴を消す
		if (this._undoStack.length > Game.UNDO_MAX) {
			this._undoStack.shift();
		}
		// REDOを消す
		this._redoStack.length = 0;
	}

	/**
	 * やり直します（REDO機能）。
	 */
	public redo(): void {
		const redo = this._redoStack.pop();

		if (redo !== undefined) {
			this._undoStack.push(this._field.toString());
			this._field.setField(redo);
		}
	}

	/**
	 * 
	 * @param gameMode 
	 */
	public switchMode(gameMode: GameMode) {
		this._gameMode = gameMode;

	}

	/**
	 * @return エディターモードであるかどうか
	 */
	public isEditorMode(): boolean {
		return this._gameMode == GameMode.EDITOR;
	}

	/**
	 * @return とこぷよモードであるかどうか
	 */
	public isTokopuyoMode(): boolean {
		return this._gameMode == GameMode.TOKOPUYO;
	}

	/**
	 * @return なぞときモードであるかどうか
	 */
	public isNazotokiMode(): boolean {
		return this._gameMode == GameMode.NAZOTOKI;
	}

	////////////////////////////////
	// getter / setter
	////////////////////////////////

	get field(): Field {
		return this._field;
	}

	get isAnimation(): boolean {
		return this._isAnimation;
	}

	set isAnimation(isAnimation: boolean) {
		this._isAnimation = isAnimation;
	}

	get gameMode(): GameMode {
		return this._gameMode;
	}

}

////////////////////////////////
// ENUM
////////////////////////////////
const GameMode = {
	EDITOR: "editor",
	TOKOPUYO: "tokopuyo",
	NAZOTOKI: "nazotoki"
} as const;
type GameMode = typeof GameMode[keyof typeof GameMode];

export { GameMode };