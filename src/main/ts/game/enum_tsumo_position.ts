export class EnumTsumoPosition {
	// CONSTANT
	private static VALUES = new Array<EnumTsumoPosition>();
	public static readonly TOP    = new EnumTsumoPosition("TOP"   , 0,  0,  1);
	public static readonly RIGHT  = new EnumTsumoPosition("RIGHT" , 1,  1,  0);
	public static readonly BOTTOM = new EnumTsumoPosition("BOTTOM", 2,  0, -1);
	public static readonly LEFT   = new EnumTsumoPosition("LEFT"  , 3, -1,  0);

	// CLASS FIELD
	private _name: string;
	private _index: number;
	private _childRelativeX: number;
	private _childRelativeY: number;

	private constructor(name: string, index: number, childRelativeX: number, childRelativeY: number) {
		this._name = name;
		this._index = index;
		this._childRelativeX = childRelativeX;
		this._childRelativeY = childRelativeY;

		EnumTsumoPosition.VALUES.push(this);
	}

	/**
	 * 回転後のEnumTsumoPositionを取得します。
	 * @param clockwise true：時計周り / false：反時計周り
	 */
	public getRotatedEnum(clockwise: boolean): EnumTsumoPosition {
		const addIndex = clockwise ? 1 : -1;
		const index = (this._index + addIndex + 4) % 4;
		return EnumTsumoPosition.fromIndex(index);
	}

	/**
	 * indexからEnumTsumoPositionを取得します。
	 * @param index index
	 */
	private static fromIndex(index: number): EnumTsumoPosition {
		const rtn = EnumTsumoPosition.VALUES.find(position => position._index == index);
		if (rtn == undefined) throw Error("illegal argument");
		return rtn;
	}

	public static fromName(name: string): EnumTsumoPosition {
		const rtn = EnumTsumoPosition.VALUES.find(position => position._name == name);
		if (rtn == undefined) throw Error("illegal argument");
		return rtn;
	}

	// ACCESSOR
	get name(): string {
		return this._name;
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