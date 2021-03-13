import { EditableMode } from "./editable_mode";
import $ from "jquery";

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
			this._timelineList.play();
		});
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
}