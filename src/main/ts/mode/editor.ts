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
			this._game.drop();
		});

        $("#clear").on("click", () => {
            this.clear();
        });
    }

    /**
     * フィールドをクリアします。
     */
    public clear(): void {
		const confirm = window.confirm("クリアしますか？");
		if (!confirm) return;

        this._game.clearField();
    }
}