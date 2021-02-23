import { Mode } from "./mode";

export abstract class EditableMode extends Mode {
    constructor() {
        super();
        this._game.field.setEventFieldCellShape(this);
    }

    /**
     * 選択している色を取得します。
     * @return 選択している色
     */
    abstract getSelectColor(): string;
}
