import { Game } from "../game/game";

import $ from "jquery";

export abstract class Mode {
	public static readonly UNDO_MAX = 100;

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
			this._redoStack.push(this.getState());
			this.setState(undo);
		}
	}

	/**
	 * UNDO用の履歴を残します。
	 */
	private pushUndoStack(beforeField: string): void {
		this._undoStack.push(beforeField);

		// 一番古い履歴を消す
		if (this._undoStack.length > Mode.UNDO_MAX) {
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
	 * @return 状態
	 */
	protected abstract getState(): string;

	/**
	 * 履歴から取得した状態を反映します。
	 * @param state 状態
	 */
	protected abstract setState(state: string): void;
}