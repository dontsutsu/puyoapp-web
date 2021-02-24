import { Game } from "../game/game";

import $ from "jquery";

export abstract class Mode {
	protected _game: Game;

	protected _undoStack: string[];
	protected _redoStack: string[];

	/**
	 * コンストラクタ
	 */
	constructor() {
		this._game = new Game();

		this._undoStack = [];
		this._redoStack = [];

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
	 * 元に戻します（UNDO機能）。
	 */
	public undo(): void {
		const undo = this._undoStack.pop();
		if (undo !== undefined) {
			this._redoStack.push(this.getHistory());
			this.setHistory(undo);
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
			this._undoStack.push(this.getHistory());
			this.setHistory(redo);
		}
	}

	public abstract getHistory(): string;

	public abstract setHistory(history: string): void;
}