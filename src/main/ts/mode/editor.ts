import { EditableMode } from "./editable_mode";

import $ from "jquery";

$(function() {
	new Editor();
});

export class Editor extends EditableMode {
	/**
	 * コンストラクタ
	 */
	constructor() {
		super();

		$("#drop").on("click", () => {
			const before = this.getHistory();
			this._game.drop();
			const after = this.getHistory();
			if (before != after) this.pushUndoStack(before);
		});

		$("#clear").on("click", () => {
			const confirm = window.confirm("クリアしますか？");
			if (!confirm) return;

			const before = this.getHistory();
			this._game.clearField();
			const after = this.getHistory();
			if (before != after) this.pushUndoStack(before);
		});
	}

	/**
	 * @inheritdoc
	 */
	public getHistory(): string {
		return this._game.field.toString();
	}

	/**
	 * @inheritdoc
	 */
	public setHistory(history: string): void {
		this._game.field.setField(history);
	}
}