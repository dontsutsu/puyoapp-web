import $ from "jquery";
import { Game } from "./game/game";

$(function() {
    new Editor();
});

export class Editor extends Game {
    constructor() {
        super();

		$("#drop").on("click", () => {
			this.drop();
		});
    }
}