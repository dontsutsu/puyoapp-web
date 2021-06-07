import { BoxCanvas } from "../canvas/box_canvas";
import { BaseMode } from "./base_mode";
import $ from "jquery";
import { Coordinate } from "../util/coordinate";

export abstract class EditableMode extends BaseMode {
	// constant
	private static readonly UNDO_MAX = 100;

    // property
	private _boxCanvas: BoxCanvas;
	private _undoStack: string[];
	private _redoStack: string[];

	/**
	 * constructor
	 */
	constructor() {
		super();
		this._boxCanvas = new BoxCanvas();
		this._undoStack = [];
		this._redoStack = [];

		// event
		this._fieldCanvas.setMouseEvent(this);

		$("#undo").on("click", () => {
			this.undo();
		});

		$("#redo").on("click", () => {
			this.redo();
		});

		$("#clear").on("click", () => {
			const confirm = window.confirm("クリアしますか？");
			if (!confirm) return;

			this.clear();
		});
	}

	// method
	/**
	 * フィールドの指定座標のぷよを変更します。
	 * @param {Coordinate} coord 座標
	 */
	public changeFieldPuyo(coord: Coordinate): void {
		const color = this.getSelectColor();
		this.doWithRecordHistory(() => {
			this._puyopuyo.changeFieldPuyo(coord, color);
		});
	}

	/**
	 * 選択している色を取得します。
	 * @returns {string} 選択している色
	 */
	public getSelectColor(): string {
		return this._boxCanvas.selectColor;
	}

	/**
	 * 元に戻します（UNDO機能）。
	 */
	protected undo(): void {
		const undo = this._undoStack.pop();
		if (undo != undefined) {
			this._timelineList.skipToEnd();
			this._redoStack.push(this.getState());
			this.setState(undo);
		}
	}

	/**
	 * やり直します（REDO機能）。
	 */
	protected redo(): void {
		const redo = this._redoStack.pop();
		if (redo != undefined) {
			this._timelineList.skipToEnd();
			this._undoStack.push(this.getState());
			this.setState(redo);
		}
	}

	/**
	 * 指定の関数を実行時に履歴登録の処理を行います。
	 * @param doing callback関数
	 */
	public doWithRecordHistory(doing: () => void) {
		const before = this.getState();
		doing();
		const after = this.getState();
		if (before != after) this.pushUndoStack(before);
	}

	/**
	 * 履歴に保存する状態を取得します。
	 * @returns {string} 状態
	 */
	protected abstract getState(): string;

	/**
	 * 履歴から取得した状態を反映します。
	 * @param {string} state 状態
	 */
	protected abstract setState(state: string): void;

	/**
	 * 
	 */
	protected abstract clear(): void;

	/**
	 * UNDO用の履歴を残します。
	 * @param {string} state 
	 */
	private pushUndoStack(state: string): void {
		this._undoStack.push(state);

		// 一番古い履歴を消す
		if (this._undoStack.length > EditableMode.UNDO_MAX) {
			this._undoStack.shift();
		}
		// REDOを消す
		this._redoStack.length = 0;
	}
}
