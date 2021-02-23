import { Game } from "../game/game";

export abstract class Mode {
    protected _game: Game;

    /**
     * コンストラクタ
     */
    constructor() {
        this._game = new Game();
    }

}