export class EnumTsumoChildPosition {
	// CONSTANT
	private static VALUES = new Array<EnumTsumoChildPosition>();
	public static readonly TOP    = new EnumTsumoChildPosition("TOP"   , "T", 0,  0,  1);
	public static readonly RIGHT  = new EnumTsumoChildPosition("RIGHT" , "R", 1,  1,  0);
	public static readonly BOTTOM = new EnumTsumoChildPosition("BOTTOM", "B", 2,  0, -1);
	public static readonly LEFT   = new EnumTsumoChildPosition("LEFT"  , "L", 3, -1,  0);

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

		EnumTsumoChildPosition.VALUES.push(this);
	}

	/**
	 * 回転後のEnumTsumoPositionを取得します。
	 * @param {boolean} clockwise true：時計周り / false：反時計周り
	 * @returns {EnumTsumoChildPosition}
	 */
	public getRotatedEnum(clockwise: boolean): EnumTsumoChildPosition {
		const addIndex = clockwise ? 1 : -1;
		const index = (this._index + addIndex + 4) % 4;
		return EnumTsumoChildPosition.fromIndex(index);
	}

	/**
	 * indexからEnumTsumoPositionを取得します。
	 * @param {number} index index
	 * @returns {EnumTsumoChildPosition}
	 */
	private static fromIndex(index: number): EnumTsumoChildPosition {
		const rtn = EnumTsumoChildPosition.VALUES.find(position => position._index == index);
		if (rtn == undefined) throw Error("illegal argument");
		return rtn;
	}

	/**
	 * nameからEnumTsumoPositionを取得します。
	 * @param {string} name name
	 * @returns {EnumTsumoChildPosition}
	 */
	public static fromName(name: string): EnumTsumoChildPosition {
		const rtn = EnumTsumoChildPosition.VALUES.find(position => position._name == name);
		if (rtn == undefined) throw Error("illegal argument");
		return rtn;
	}

	/**
	 * valueからEnumTsumoPositionを取得します。
	 * @param {string} value value
	 * @returns {EnumTsumoChildPosition}
	 */
	public static fromValue(value: string): EnumTsumoChildPosition {
		const rtn = EnumTsumoChildPosition.VALUES.find(position => position._value == value);
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