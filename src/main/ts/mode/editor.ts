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

			this._timelineList = this._puyopuyo.dropFieldPuyo();
			this._timelineList.play();
		});
	}
}