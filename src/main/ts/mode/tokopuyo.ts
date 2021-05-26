import { BaseTokopuyo } from "./base_tokopuyo";
import $ from "jquery";

$(() => {
	new Tokopuyo();
});

export class Tokopuyo extends BaseTokopuyo {
	/**
	 * コンストラクタ
	 */
	constructor() {
		super();
		this._puyopuyo.initTokopuyo();
	}

	protected individualOperatableCheck(): boolean {
		return true;
	}

	protected individualDrop(): void {
	}

	protected individualUndo(): void {
	}
}