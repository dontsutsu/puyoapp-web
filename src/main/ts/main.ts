import $ from "jquery";
import { Game } from "./game/game";

$(function() {
    new Main();
});

export class Main {

	private _game: Game;
	
    constructor() {
		this._game = new Game();

		// イベント






	}












	/**
	 * フィールドのぷよを落とします。
	 */
	public drop(): void {
		this._game.drop();
	}

}

