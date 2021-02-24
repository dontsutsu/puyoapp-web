import { Game } from "../game/game";

import $ from "jquery";

export abstract class Mode {
	protected _game: Game;

	/**
	 * コンストラクタ
	 */
	constructor() {
		this._game = new Game();

		$("#undo").on("click", () => {
			this._game.undo();
		});

		$("#redo").on("click", () => {
			this._game.redo();
		});

		$("#speed").on("input", (e) => {
			const val = (e.currentTarget as HTMLInputElement).value;
			$("#speedVal").text(val);
		});
	}
}