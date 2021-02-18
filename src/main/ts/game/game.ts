import $ from "jquery";
import { Field } from "./ui/canvas/field";
import { Tsumo } from "./ui/canvas/tsumo";
import { Next } from "./ui/canvas/next";
import { PuyoTimelineList } from "./ui/timeline/puyo_timeline_list";

import { Ticker } from "@createjs/tweenjs";

/**
 * Gameクラス
 */
export abstract class Game {
	public static readonly UNDO_MAX = 100;

	protected _field: Field;
	protected _tsumo: Tsumo;
	protected _next: Next;

	protected _isAnimation: boolean;

	protected _undoStack: string[];
	protected _redoStack: string[];

	constructor(isClickableField: boolean) {
		// canvas
		this._field = new Field(this, isClickableField);
		this._tsumo = new Tsumo(this);
		this._next = new Next(this);

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
	 * 選択中の色を取得します。
	 * @return 選択中の色
	 */
	public abstract getSelectColor() :string;

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