import $ from "jquery";
import { Game } from "./game/game";
import { Box } from "./game/ui/canvas/box";

$(function() {
    new Editor();
});

export class Editor extends Game {
    public static readonly IS_CLICKABLE_FIELD = true;

    protected _box: Box;

    constructor() {
        super(Editor.IS_CLICKABLE_FIELD);

        this._box = new Box(this);

		$("#drop").on("click", () => {
			this.drop();
		});
    }

    /**
     * @inheritdoc
     */
    public getSelectColor(): string {
        return this._box.selectColor;
    }
}