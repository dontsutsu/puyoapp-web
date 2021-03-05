import { Field } from "./field";
import { Tsumo } from "./tsumo";

export class Puyopuyo {
	// CLASS FIELD
	private _field: Field;
	private _tsumos: Tsumo[];	// 0：current、1：next、2：doubleNext

	/**
	 * コンストラクタ
	 */
	constructor() {
		this._field = new Field();
		this._tsumos = [];
	}

	/**
	 * フィールドのぷよを落とし、連鎖処理を実行します。
	 */
	public dropFieldPuyo(): void {
		this._field.dropFieldPuyo();
	}

	/**
	 * ツモを動かします。
	 * @param vec 動かす距離と方向（ex　右に1：+1、左に2：-2）
	 */
	public moveTsumo(vec: number): void {
		this._tsumos[0].move(vec);
	}

	/**
	 * ツモを回転します。
	 * @param clockwise true：時計周り / false：反時計周り
	 */
	public rotateTsumo(clockwise: boolean): void {
		this._tsumos[0].rotate(clockwise);
	}

	/**
	 * ツモをフィールドに落とします。
	 */
	public dropTsumoToField(): void {
		this._field.dropTsumoToField(this._tsumos[0]);
	}
}