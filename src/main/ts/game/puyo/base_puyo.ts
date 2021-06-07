export class BasePuyo {
	// constant
	public static readonly GREEN  = "1";
	public static readonly RED    = "2";
	public static readonly BLUE   = "3";
	public static readonly YELLOW = "4";
	public static readonly PURPLE = "5";
	public static readonly NONE   = "0";
	public static readonly OJAMA  = "9";

	// property
	private _color: string;

	/**
	 * constructor
	 * @param {string} color 色
	 */
	constructor(color: string) {
		this._color = color;
	}

	// accessor
	get color(): string {
		return this._color;
	}

	set color(color: string) {
		this._color = color;
	}
}