import $ from "jquery";
import { Ticker } from "@createjs/tweenjs";
import { Field } from "./createjs/canvas/field";
import { Tsumo } from "./createjs/canvas/tsumo";
import { Next } from "./createjs/canvas/next";
import { PuyoTimelineList } from "./createjs/timeline/puyo_timeline_list";
import { CorrectList } from "../util/ajax";

/**
 * Gameクラス
 */
export class Game {
	public static readonly UNDO_MAX = 100;

	protected _field: Field;
	protected _tsumo: Tsumo;
	protected _next: Next;

	protected _isAnimation: boolean;

	protected _undoStack: string[];
	protected _redoStack: string[];

	/**
	 * コンストラクタ
	 * @param mode モード
	 */
	constructor() {
		// canvas
		this._field = new Field();
		this._tsumo = new Tsumo();
		this._next = new Next();

		this._undoStack = [];
		this._redoStack = [];

		this._isAnimation = false;

		// フレームレート
		Ticker.timingMode = Ticker.RAF;

		$("#undo").on("click", () => {
			this.undo();
		});

		$("#redo").on("click", () => {
			this.redo();
		});

		$("#speed").on("input", (e) => {
			const val = (e.currentTarget as HTMLInputElement).value;
			$("#speedVal").text(val);
		});
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
		if (!this.dropCheck()) {
			return;
		}

		const puyoTlList = new PuyoTimelineList();
		this._tsumo.drop(puyoTlList);
		this._field.dropTsumo(this._tsumo, puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * フィールド情報を文字列で取得します。
	 * @return フィールド文字列 [1段目1列目、1段目2列目、・・・、1段目6列目、2段目1列目、・・・、13段目6列目]
	 */
	public getFieldString(): string {
		return this._field.toString();
	}

	/**
	 * フィールドをクリアします。
	 */
	public clearField(): void {
		const beforeField = this._field.toString();

		this._field.clear();

		const afterField = this._field.toString();

		// UNDOの履歴を残す
		if (beforeField != afterField) this.pushUndoStack(beforeField);
	}

	/**
	 * 現在のツモがフィールドに落とせる位置にあるかチェックします。
	 * @return true：落とせる / false：落とせない
	 */
	private dropCheck(): boolean {
		const heights = this._field.getHeights();

		const ax = this._tsumo.aPuyoShape.tsumo_x;
		const cx = this._tsumo.cPuyoShape.tsumo_x;

		for (let x = 0; x < heights.length; x++) {
			let h = heights[x];

			if (x == ax) {
				h++;
			}

			if (ax != cx && x == cx) {
				h++;
			}

			if (h > Field.Y_SIZE) {
				return false;
			}
		}

		return true;
	}

	/**
	 * なぞぷよの正答アニメーションを再生します。
	 * @param correct 
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

}