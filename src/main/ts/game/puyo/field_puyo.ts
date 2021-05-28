import { BasePuyo } from "./base_puyo";
import { PuyoConnect } from "./puyo_connect";

export class FieldPuyo extends BasePuyo {
    // CLASS FIELD
    private _connect: PuyoConnect | null;

    /**
     * コンストラクタ
     * @param {string} color 色
     */
    constructor(color: string = BasePuyo.NONE) {
        super(color);
        this._connect = null;
    }

    // ACCESSOR
    get connect(): PuyoConnect | null {
        return this._connect;
    }

    set connect(connect: PuyoConnect | null) {
        this._connect = connect;
    }
}