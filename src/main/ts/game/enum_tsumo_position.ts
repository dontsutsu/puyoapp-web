export class EnumTsumoPosition {
	// CONSTANT
	private static VALUES = new Array<EnumTsumoPosition>();
	public static readonly TOP    = new EnumTsumoPosition("TOP"   , "T", 0,  0,  1);
	public static readonly RIGHT  = new EnumTsumoPosition("RIGHT" , "R", 1,  1,  0);
	public static readonly BOTTOM = new EnumTsumoPosition("BOTTOM", "B", 2,  0, -1);
	public static readonly LEFT   = new EnumTsumoPosition("LEFT"  , "L", 3, -1,  0);

	// CLASS FIELD
	private _name: string;
	private _value: string;
	private _index: number;
	private _childRelativeX: number;
	private _childRelativeY: number;

	/**
	 * 
	 * @param {string} name 
	 * @param {number} index 
	 * @param {number} childRelativeX 
	 * @param {number} childRelativeY 
	 */
	private constructor(name: string, value: string, index: number, childRelativeX: number, childRelativeY: number) {
		this._name = name;
		this._value = value;
		this._index = index;
		this._childRelativeX = childRelativeX;
		this._childRelativeY = childRelativeY;

		EnumTsumoPosition.VALUES.push(this);
	}

	/**
	 * 回転後のEnumTsumoPositionを取得します。
	 * @param {boolean} clockwise true：時計周り / false：反時計周り
	 * @returns {EnumTsumoPosition}
	 */
	public getRotatedEnum(clockwise: boolean): EnumTsumoPosition {
		const addIndex = clockwise ? 1 : -1;
		const index = (this._index + addIndex + 4) % 4;
		return EnumTsumoPosition.fromIndex(index);
	}

	/**
	 * indexからEnumTsumoPositionを取得します。
	 * @param {number} index index
	 * @returns {EnumTsumoPosition}
	 */
	private static fromIndex(index: number): EnumTsumoPosition {
		const rtn = EnumTsumoPosition.VALUES.find(position => position._index == index);
		if (rtn == undefined) throw Error("illegal argument");
		return rtn;
	}

	/**
	 * nameからEnumTsumoPositionを取得します。
	 * @param {string} name name
	 * @returns {EnumTsumoPosition}
	 */
	public static fromName(name: string): EnumTsumoPosition {
		const rtn = EnumTsumoPosition.VALUES.find(position => position._name == name);
		if (rtn == undefined) throw Error("illegal argument");
		return rtn;
	}

	/**
	 * valueからEnumTsumoPositionを取得します。
	 * @param {string} value value
	 * @returns {EnumTsumoPosition}
	 */
	public static fromValue(value: string): EnumTsumoPosition {
		const rtn = EnumTsumoPosition.VALUES.find(position => position._value == value);
		if (rtn == undefined) throw Error("illegal argument");
		return rtn;
	}

	// ACCESSOR
	get name(): string {
		return this._name;
	}

	get value(): string {
		return this._value;
	}

	get index(): number {
		return this._index;
	}

	get childRelativeX(): number {
		return this._childRelativeX;
	}

	get childRelativeY(): number {
		return this._childRelativeY;
	}
}