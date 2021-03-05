import { BoxCanvas } from "../canvas/box_canvas";
import { BaseMode } from "./base_mode";

export abstract class EditableMode extends BaseMode {
    // CLASS FIELD
	private _boxCanvas: BoxCanvas;

	/**
	 * コンストラクタ
	 */
	constructor() {
		super();
		this._boxCanvas = new BoxCanvas();
	}

	/**
	 * 選択している色を取得します。
	 * @return 選択している色
	 */
	public getSelectColor(): string {
		return this._boxCanvas.selectColor;
	}
}
