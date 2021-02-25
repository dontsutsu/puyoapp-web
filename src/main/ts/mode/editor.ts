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
			this.doWithRecordHistory(() => {
				this._game.drop();
			});
		});

		$("#clear").on("click", () => {
			const confirm = window.confirm("クリアしますか？");
			if (!confirm) return;

			this.doWithRecordHistory(() => {
				this._game.clearField();
			});
		});
	}

	/**
	 * @inheritdoc
	 */
	protected getState(): string {
		return this._game.field.toString();
	}

	/**
	 * @inheritdoc
	 */
	protected setState(state: string): void {
		this._game.field.setField(state);
	}
}