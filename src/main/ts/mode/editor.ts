import { EditableMode } from "./editable_mode";
import $ from "jquery";
import { Field } from "../game/field";

$(() => {
	new Editor();
});

export class Editor extends EditableMode {
	/**
	 * コンストラクタ
	 */
	constructor() {
		super();

		// event
		$("#drop").on("click", () => {
			if (this._timelineList.isAnimation) return;

			this.doWithRecordHistory(() => {
				this._timelineList = this._puyopuyo.dropFieldPuyo();
			});

			const before = () => { this._fieldCanvas.isEditable = false; };
			const after = () => { this._fieldCanvas.isEditable = true; };
			this._timelineList.play(before, after);
		});

		// 直前のフィールド取得
		const fieldStr = $("#lastField").val() as string;
		if (fieldStr != "" && fieldStr != Field.NULL_STRING) {
			const confirm = window.confirm("前画面のフィールドを引き継ぎますか？");
			if (confirm) {
				this._puyopuyo.setField(fieldStr);
			} 
		}
	}
	
	/**
	 * @inheritdoc
	 */
	protected getState(): string {
		return this._puyopuyo.getFieldString();
	}

	/**
	 * @inheritdoc
	 */
	protected setState(state: string): void {
		this._puyopuyo.setField(state);
	}

	/**
	 * @inheritdoc
	 */
	protected clear(): void {
		this._puyopuyo.clearField();
	}
}