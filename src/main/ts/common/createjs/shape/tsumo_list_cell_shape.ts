import { BaseCellShape } from "./base_cell_shape";

/**
 * TsumoListセル
 */
export class TsumoListCellShape extends BaseCellShape {
	public static readonly CELLSIZE = 30;
	public static readonly PADDING = 10;
	public static readonly BG_COLOR = "#FFFFFF";
	public static readonly TSUMO_LIST_BORDER_COLOR = "#DDDDDD";
	public static readonly Y_ADJUST = -10;

	private _type: number;

	/**
	 * @param x x座標
	 * @param y y座標
	 * @param type 0：子ぷよ、1：軸ぷよ
	 */
	constructor (x: number, y: number, type: number) {
		super(x, y, TsumoListCellShape.CELLSIZE, TsumoListCellShape.BG_COLOR, TsumoListCellShape.TSUMO_LIST_BORDER_COLOR);

		const xy = TsumoListCellShape.getXandY(x, y, type);

		this.x = xy.x;
		this.y = xy.y;
		this._type = type;
	}

	/**
	 * 座標の位置および軸ぷよor子ぷよから、Shape.x、Shape.yに設定する値を取得します。
	 * @param x x座標
	 * @param y y座標
	 * @param type 0：子ぷよ、1：軸ぷよ
	 * @return x：Shape.xに設定する値、y：Shape.yに設定する値
	 */
	static getXandY(x: number, y: number, type: number): { x: number; y: number; } {
		const rtn_x = (TsumoListCellShape.CELLSIZE + TsumoListCellShape.PADDING) * x;
		const rtn_y = TsumoListCellShape.CELLSIZE * (type + 1) + TsumoListCellShape.CELLSIZE * 3 * y + TsumoListCellShape.Y_ADJUST;
		return {x: rtn_x, y: rtn_y};
	}

	/**
	 * マウスオーバーしたときに行う処理
	 */
	public mouseover(): void {
		this.changeColor("#00FFFF");
	}

	/**
	 * マウスアウトしたときに行う処理
	 */
	public mouseout(): void {
		this.changeColor(TsumoListCellShape.BG_COLOR);
	}

	////////////////////////////////
	// setter / getter
	////////////////////////////////

	get type(): number {
		return this._type;
	}

	set type(type: number) {
		this._type = type;
	}
}
