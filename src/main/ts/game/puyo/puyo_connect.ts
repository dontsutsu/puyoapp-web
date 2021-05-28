export class PuyoConnect {
	// CONSTANT
	private static readonly ERASE_SIZE = 4;

	// CLASS FIELD
	private _size: number;

	/**
	 * コンストラクタ
	 */
	constructor() {
		this._size = 1;
	}

	/**
	 * 連結数を1増やします。
	 */
	public increment(): void {
		this._size += 1;
	}

	/**
	 * 消去可能な連結数であるかを返します。
	 * @returns {boolean} true：消去可能 / false：消去不可
	 */
	public isErasable(): boolean {
		return this._size >= PuyoConnect.ERASE_SIZE;
	}

	// ACCESSOR
	get size(): number {
		return this._size;
	}

}