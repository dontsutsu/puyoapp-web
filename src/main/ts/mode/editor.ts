import $ from "jquery";
import { Box } from "../common/createjs/canvas/box";
import { EditableMode } from "./editable_mode";

$(function() {
    new Editor();
});

export class Editor extends EditableMode {
    protected _box: Box;

    /**
     * コンストラクタ
     */
    constructor() {
        super();

        this._box = new Box();

		$("#drop").on("click", () => {
			this._game.drop();
		});

        $("#clear").on("click", () => {
            this.clear();
        });
    }
    

    /**
     * @inheritdoc
     */
    public getSelectColor(): string {
        return this._box.selectColor;
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