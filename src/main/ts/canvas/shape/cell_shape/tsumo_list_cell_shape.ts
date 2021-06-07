import { Coordinate } from "../../../util/coordinate";
import { TsumoListCanvas } from "../../tsumo_list_canvas";
import { BaseCellShape } from "./base_cell_shape";

/**
 * TsumoListセル
 */
export class TsumoListCellShape extends BaseCellShape {
	// constant
	public static readonly CELLSIZE = 26;
	public static readonly BG_COLOR = "#FFFFFF";
	public static readonly TSUMO_LIST_BORDER_COLOR = "#DDDDDD";

	// property
	private _type: number;
	private _index: number;

	/**
	 * constructor
	 * @param {Coordinate} coord ツモリストの座標
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 */
	constructor (coord: Coordinate, type: number) {
		const canvasCoord = TsumoListCanvas.getCanvasCoordinate(coord, type);
		super(canvasCoord.x, canvasCoord.y, TsumoListCellShape.CELLSIZE, TsumoListCellShape.BG_COLOR, TsumoListCellShape.TSUMO_LIST_BORDER_COLOR);

		this._type = type;
		this._index = TsumoListCanvas.getIndex(coord);
	}

	// method
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

	// accessor
	get type(): number {
		return this._type;
	}

	get index(): number {
		return this._index;
	}
}
