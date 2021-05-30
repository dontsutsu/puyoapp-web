import { TsumoListCanvas } from "../../tsumo_list_canvas";
import { BaseCellShape } from "./base_cell_shape";

/**
 * TsumoListセル
 */
export class TsumoListCellShape extends BaseCellShape {
	// CONSTANT
	public static readonly CELLSIZE = 26;
	public static readonly PADDING = 10;
	public static readonly BG_COLOR = "#FFFFFF";
	public static readonly TSUMO_LIST_BORDER_COLOR = "#DDDDDD";
	public static readonly Y_ADJUST = -10;

	// CLASS FIELD
	private _type: number;
	private _index: number;

	/**
	 * コンストラクタ
	 * @param {number} ax x座標
	 * @param {number} ay y座標
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 */
	constructor (ax: number, ay: number, type: number) {
		const {x, y} = TsumoListCellShape.getXandY(ax, ay, type);
		super(x, y, TsumoListCellShape.CELLSIZE, TsumoListCellShape.BG_COLOR, TsumoListCellShape.TSUMO_LIST_BORDER_COLOR);

		this._type = type;
		this._index = ax + ay * TsumoListCanvas.X_SIZE;
	}

	/**
	 * 座標の位置および軸ぷよor子ぷよから、Shape.x、Shape.yに設定する値を取得します。
	 * @param {number} ax x座標
	 * @param {number} ay y座標
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 * @returns {{x: number, y: number}}
	 */
	public static getXandY(ax: number, ay: number, type: number): { x: number, y: number } {
		const x = (TsumoListCellShape.CELLSIZE + TsumoListCellShape.PADDING) * ax;
		const y = TsumoListCellShape.CELLSIZE * (type + 1) + TsumoListCellShape.CELLSIZE * 3 * ay + TsumoListCellShape.Y_ADJUST;
		return { x: x, y: y };
	}

	/**
	 * マウスオーバーしたときに行う処理
	 */
	public mouseover(): void {
		this.changeBgColor("#00FFFF");
	}

	/**
	 * マウスアウトしたときに行う処理
	 */
	public mouseout(): void {
		this.changeBgColor(TsumoListCellShape.BG_COLOR);
	}

	// ACCESSOR
	get type(): number {
		return this._type;
	}

	get index(): number {
		return this._index;
	}
}
