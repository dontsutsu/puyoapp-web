import { BaseCellShape } from "./base_cell_shape";
import { Box } from "../canvas/box"

/**
 * Tsumoセル
 */
export class TsumoCellShape extends BaseCellShape {

	static readonly CELLSIZE = 35;
	static readonly BG_COLOR = "#FFFFFF";

	/**
	 * コンストラクタ
	 * @param x
	 * @param y
	 */
	constructor(x: number, y: number) {
		super(x, y, TsumoCellShape.CELLSIZE, TsumoCellShape.BG_COLOR);

		this.x = TsumoCellShape.CELLSIZE * x;
		this.y = TsumoCellShape.CELLSIZE * y;
	}
}

/**
 * Fieldセル
 */
export class FieldCellShape extends BaseCellShape {
	static BG_COLOR = "#FFFFFF";
	static SELECT_COLOR = "#00FFFF";

	static CELLSIZE = 35;

	/**
	 * コンストラクタ
	 * @param x
	 * @param y
	 */
	constructor(x: number, y: number) {
		super(x, y, FieldCellShape.CELLSIZE, FieldCellShape.BG_COLOR);

		this.alpha = y == 0 ? 0.01 : 1.0;
		this.x = FieldCellShape.CELLSIZE * x;
		this.y = FieldCellShape.CELLSIZE * y;
	}

	/**
	 *
	 */
	public mouseover(): void {
		this.alpha = 1.0;
		this.changeColor(FieldCellShape.SELECT_COLOR);
	}

	/**
	 *
	 */
	public mouseout(): void {
		this.changeColor(FieldCellShape.BG_COLOR);
		this.alpha = this.posy == 0 ? 0.01 : 1.0;
	}
}

/**
 * Boxセル
 */
export class BoxCellShape extends BaseCellShape {
	static readonly ENABLED_COLOR = "#FFFFFF";
	static readonly DISABLED_COLOR = "#666666";
	static readonly BOX_BORDER_COLOR = "#CCCCCC";

	static readonly CELLSIZE = 35;

	/**
	 * @param x
	 * @param y
	 * @param index
	 */
	constructor(x: number, y: number, index: number) {
		let bgColor = index < Box.KEY_ORDER.length ? BoxCellShape.ENABLED_COLOR : BoxCellShape.DISABLED_COLOR;
		super(x, y, BoxCellShape.CELLSIZE, bgColor, BoxCellShape.BOX_BORDER_COLOR);

		this.x = BoxCellShape.CELLSIZE * x;
		this.y = BoxCellShape.CELLSIZE * y;
	}
}

/**
 * TsumoListセル
 */
export class TsumoListCellShape extends BaseCellShape {

	static CELLSIZE = 30;
	static PADDING = 10;
	static BG_COLOR = "#FFFFFF";
	static TSUMO_LIST_BORDER_COLOR = "#DDDDDD";
	static Y_ADJUST = -10;

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

/**
 * Nextセル
 */
export class NextCellShape extends BaseCellShape {
	static CELLSIZE = 30;
	static NEXT_PADDING = 10;
	static BG_COLOR = "#FFFFFF";

	/**
	 * コンストラクタ
	 * @param next
	 * @param type
	 */
	constructor (next: number, type: number) {
		super(0, 0, NextCellShape.CELLSIZE, NextCellShape.BG_COLOR);

		const xy = NextCellShape.getXandY(next, type);

		this.x = xy.x;
		this.y = xy.y;	// ダブネクはy座標CELLSIZE+αずらす

		this.alpha = 0.01;
	}

	/**
	 * @param next
	 * @param type
	 */
	static getXandY(next: number, type: number): { x: number; y: number; } {
		const x = NextCellShape.CELLSIZE * next;
		const y = NextCellShape.CELLSIZE * type + (NextCellShape.CELLSIZE * 2 + NextCellShape.NEXT_PADDING) * next;
		return {x, y};
	}
}
