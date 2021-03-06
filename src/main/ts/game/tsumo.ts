import { Field } from "./field";
import { TsumoPuyo } from "./puyo/tsumo_puyo";
import { EnumTsumoPosition } from "./enum_tsumo_position";

export class Tsumo {
	// CONSTANT
	private static readonly INI_AXIS_X = 2;

	// CLASS FIELD
	private _axisPuyo: TsumoPuyo;	// 軸ぷよ
	private _childPuyo: TsumoPuyo;	// 子ぷよ
	private _tsumoPosition: EnumTsumoPosition;
	private _axisX: number;

	/**
	 * コンストラクタ
	 * @param axisColor 軸ぷよの色
	 * @param childColor 子ぷよの色
	 */
	constructor(axisColor: string, childColor: string) {
		this._axisPuyo = new TsumoPuyo(axisColor);
		this._childPuyo = new TsumoPuyo(childColor);
		this._tsumoPosition = EnumTsumoPosition.TOP;
		this._axisX = Tsumo.INI_AXIS_X;
	}

	/**
	 * 
	 * @param vec 
	 */
	public move(vec: number): void {
		let x = this._axisX + vec;

		// 左端check
		const leftEnd = this._tsumoPosition == EnumTsumoPosition.LEFT ? 1 : 0;
		if (x < leftEnd) {
			x = leftEnd;
		}

		// 右端check
		const rightEnd = this._tsumoPosition == EnumTsumoPosition.RIGHT ? Field.X_SIZE - 2 : Field.X_SIZE - 1;
		if (x > rightEnd) {
			x = rightEnd;
		}

		this._axisX = x;
	}

	/**
	 * 
	 * @param clockwise 
	 */
	public rotate(clockwise: boolean) {
		this._tsumoPosition = this._tsumoPosition.getRotatedEnum(clockwise);
		if (this._axisX == Field.X_SIZE - 1 && this._tsumoPosition == EnumTsumoPosition.RIGHT) this._axisX = Field.X_SIZE - 2;
		if (this._axisX == 0 && this._tsumoPosition == EnumTsumoPosition.LEFT) this._axisX = 1;
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

	get childX(): number {
		return this._axisX + this._tsumoPosition.childRelaiveX;
	}
	
	get tsumoPosition(): EnumTsumoPosition {
		return this._tsumoPosition;
	}
}