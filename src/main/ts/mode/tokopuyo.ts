import $ from "jquery";
import { Mode } from "./mode";

$(function() {
	new Tokopuyo();
});

export class Tokopuyo extends Mode {
	/**
	 * コンストラクタ
	 */
	constructor() {
		super();

		// event
		$("html").on("keydown", (e) => {
			switch(e.key) {
				case "ArrowRight" : // Key[→]
					this._game.right();
				break;

				case "ArrowLeft" : // Key[←]
					this._game.left();
				break;

				case "ArrowDown" : // Key[↓]
					this._game.tsumoDrop();
				break;

				case "z" : // Key[z]
					this._game.rotateLeft();
				break;

				case "x" : // Key[x]
					this._game.rotateRight();
				break;
			}
		});
	}

	/**
	 * @inheritdoc
	 */
	protected getState(): string {
		return "";
	}

	/**
	 * @inheritdoc
	 */
	protected setState(state: string): void {
		
	}
}