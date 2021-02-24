import { Box } from "../common/createjs/canvas/box";
import { Mode } from "./mode";

export abstract class EditableMode extends Mode {
    protected _box: Box;
    
    constructor() {
        super();
        this._box = new Box();

        this._game.field.setEventFieldCellShape(this);
    }

    /**
     * 選択している色を取得します。
     * @return 選択している色
     */
	public getSelectColor(): string {
        return this._box.selectColor;
    }
}
