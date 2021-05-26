import { Field } from "./field";
import { TsumoPuyo } from "./puyo/tsumo_puyo";
import { EnumTsumoPosition } from "./enum_tsumo_position";

export class Tsumo {
	// CONSTANT
	public static readonly INI_AXIS_X = 2;
	private static readonly INI_POSITION = EnumTsumoPosition.TOP;

	// CLASS FIELD
	private _axisPuyo: TsumoPuyo;	// 軸ぷよ
	private _childPuyo: TsumoPuyo;	// 子ぷよ
	private _tsumoPosition: EnumTsumoPosition;
	private _axisX: number;

	/**
	 * コンストラクタ
	 * @param {string} axisColor 軸ぷよの色
	 * @param {string} childColor 子ぷよの色
	 */
	constructor(axisColor: string, childColor: string) {
		this._axisPuyo = new TsumoPuyo(axisColor);
		this._childPuyo = new TsumoPuyo(childColor);
		this._tsumoPosition = Tsumo.INI_POSITION;
		this._axisX = Tsumo.INI_AXIS_X;
	}

	/**
	 * ツモを動かします。
	 * @param {number} vec 動かす距離と方向（ex　右に1：+1、左に2：-2）
	 */
	public move(vec: number): void {
		let toX = this._axisX + vec;

		// 左端check
		const leftEnd = this._tsumoPosition == EnumTsumoPosition.LEFT ? 1 : 0;
		if (toX < leftEnd) {
			toX = leftEnd;
		}

		// 右端check
		const rightEnd = this._tsumoPosition == EnumTsumoPosition.RIGHT ? Field.X_SIZE - 2 : Field.X_SIZE - 1;
		if (toX > rightEnd) {
			toX = rightEnd;
		}

		this._axisX = toX;
	}

	/**
	 * ツモを回転します。
	 * @param {boolean} clockwise true：時計周り / false：反時計周り
	 */
	public rotate(clockwise: boolean): void {
		this._tsumoPosition = this._tsumoPosition.getRotatedEnum(clockwise);
		if (this._axisX == Field.X_SIZE - 1 && this._tsumoPosition == EnumTsumoPosition.RIGHT) this._axisX = Field.X_SIZE - 2;
		if (this._axisX == 0 && this._tsumoPosition == EnumTsumoPosition.LEFT) this._axisX = 1;
	}

	/**
	 * nameからTsumoPositionを設定します。
	 * @param {string} name TsumoPositionのname
	 */
	public setTsumoPositionByEnumName(name: string): void {
		this._tsumoPosition = EnumTsumoPosition.fromName(name);
	}

	/**
	 * valueからTsumoPositionを設定します。
	 * @param {string} value TsumoPositionのvalue
	 */
	public setTsumoPositionByEnumValue(value: string): void {
		this._tsumoPosition = EnumTsumoPosition.fromValue(value);
	}

	/**
	 * ツモを初期位置に戻します。
	 */
	public resetPosition(): void {
		this._tsumoPosition = Tsumo.INI_POSITION;
		this._axisX = Tsumo.INI_AXIS_X;
	}

	// ACCESSOR
	get axisPuyo(): TsumoPuyo {
		return this._axisPuyo;
	}

	get childPuyo(): TsumoPuyo {
		return this._childPuyo;
	}

	get axisX(): number {
		return this._axisX;
	}

	get axisY(): number {
		return 1;
	}

	get axisColor(): string {
		return this._axisPuyo.color;
	}

	get childX(): number {
		return this._axisX + this._tsumoPosition.childRelativeX;
	}

	get childY(): number {
		return 1 + this._tsumoPosition.childRelativeY;
	}

	get childColor(): string {
		return this._childPuyo.color;
	}
	
	get tsumoPosition(): EnumTsumoPosition {
		return this._tsumoPosition;
	}

	set axisX(axisX: number) {
		this._axisX = axisX;
	}
}