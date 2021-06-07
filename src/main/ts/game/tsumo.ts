import { Field } from "./field";
import { TsumoPuyo } from "./puyo/tsumo_puyo";
import { EnumTsumoChildPosition } from "./enum_tsumo_child_position";

export class Tsumo {
	// constant
	public static readonly INI_AXIS_X = 2;
	private static readonly INI_CHILD_POSITION = EnumTsumoChildPosition.TOP;

	// property
	private _axisPuyo: TsumoPuyo;	// 軸ぷよ
	private _childPuyo: TsumoPuyo;	// 子ぷよ
	private _childPosition: EnumTsumoChildPosition;
	private _axisX: number;

	/**
	 * constructor
	 * @param {string} axisColor 軸ぷよの色
	 * @param {string} childColor 子ぷよの色
	 */
	constructor(axisColor: string, childColor: string) {
		this._axisPuyo = new TsumoPuyo(axisColor);
		this._childPuyo = new TsumoPuyo(childColor);
		this._childPosition = Tsumo.INI_CHILD_POSITION;
		this._axisX = Tsumo.INI_AXIS_X;
	}

	// method
	/**
	 * ツモを動かします。
	 * @param {number} vec 動かす距離と方向（ex　右に1：+1、左に2：-2）
	 */
	public move(vec: number): void {
		let toX = this._axisX + vec;

		// 左端check
		const leftEnd = this._childPosition == EnumTsumoChildPosition.LEFT ? 1 : 0;
		if (toX < leftEnd) {
			toX = leftEnd;
		}

		// 右端check
		const rightEnd = this._childPosition == EnumTsumoChildPosition.RIGHT ? Field.X_SIZE - 2 : Field.X_SIZE - 1;
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
		this._childPosition = this._childPosition.getRotatedEnum(clockwise);
		if (this._axisX == Field.X_SIZE - 1 && this._childPosition == EnumTsumoChildPosition.RIGHT) this._axisX = Field.X_SIZE - 2;
		if (this._axisX == 0 && this._childPosition == EnumTsumoChildPosition.LEFT) this._axisX = 1;
	}

	/**
	 * nameからchildPositionを設定します。
	 * @param {string} name EnumTsumoChildPositionのname
	 */
	public setChildPositionByEnumName(name: string): void {
		this._childPosition = EnumTsumoChildPosition.fromName(name);
	}

	/**
	 * valueからchildPositionを設定します。
	 * @param {string} value EnumTsumoChildPositionのvalue
	 */
	public setChildPositionByEnumValue(value: string): void {
		this._childPosition = EnumTsumoChildPosition.fromValue(value);
	}

	/**
	 * ツモを初期位置に戻します。
	 */
	public resetChildPosition(): void {
		this._childPosition = Tsumo.INI_CHILD_POSITION;
		this._axisX = Tsumo.INI_AXIS_X;
	}

	// accessor
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
		return this._axisX + this._childPosition.childRelativeX;
	}

	get childY(): number {
		return 1 + this._childPosition.childRelativeY;
	}

	get childColor(): string {
		return this._childPuyo.color;
	}
	
	get tsumoChildPosition(): EnumTsumoChildPosition {
		return this._childPosition;
	}

	set axisX(axisX: number) {
		this._axisX = axisX;
	}
}