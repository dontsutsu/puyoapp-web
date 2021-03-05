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
	}
}