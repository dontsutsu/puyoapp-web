import { BaseTokopuyo } from "./base_tokopuyo";
import $ from "jquery";

// entry point
$(() => {
	new Tokopuyo();
});

export class Tokopuyo extends BaseTokopuyo {
	/**
	 * constructor
	 */
	constructor() {
		super();
		this._puyopuyo.initTokopuyo();
	}

	// method
	/**
	 * @inheritdoc
	 */
	protected individualOperatableCheck(): boolean {
		return true;
	}

	/**
	 * @inheritdoc
	 */
	protected individualDrop(): void {
	}

	/**
	 * @inheritdoc
	 */
	protected individualUndo(): void {
	}
}