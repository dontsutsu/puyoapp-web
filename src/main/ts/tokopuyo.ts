import $ from "jquery";
import { Game } from "./game/game";

$(function() {
    new Tokopuyo();
});

export class Tokopuyo extends Game {
	public static readonly IS_CLICKABLE_FIELD = false;

    constructor() {
        super(Tokopuyo.IS_CLICKABLE_FIELD);

        // event
        $("html").on("keydown", (e) => {
			switch(e.key) {
				case "ArrowRight" : // Key[→]
					this.right();
				break;

				case "ArrowLeft" : // Key[←]
					this.left();
				break;

				case "ArrowDown" : // Key[↓]
					this.tsumoDrop();
				break;

				case "z" : // Key[z]
					this.rotateLeft();
				break;

				case "x" : // Key[x]
					this.rotateRight();
				break;
			}
		});
    }

	/**
	 * @inheritdoc
	 */
	public getSelectColor(): string {
		throw new Error("Method not implemented.");
	}
}