import { BaseCellShape } from "../../../common/createjs/shape/base_cell_shape";

/**
 * Nextセル
 */
export class NextCellShape extends BaseCellShape {
	public static readonly CELLSIZE = 30;
	public static readonly NEXT_PADDING = 10;
	public 	static readonly BG_COLOR = "#FFFFFF";

	/**
	 * コンストラクタ
	 * @param next 0：ネクスト、1：ダブネク
	 * @param type 0：子ぷよ、1：軸ぷよ
	 */
	constructor (next: number, type: number) {
		super(0, 0, NextCellShape.CELLSIZE, NextCellShape.BG_COLOR);

		const xy = NextCellShape.getXandY(next, type);

		this.x = xy.x;
		this.y = xy.y;	// ダブネクはy座標CELLSIZE+αずらす

		this.alpha = 0.01;
	}

	/**
	 * @param next 0：ネクスト、1：ダブネク
	 * @param type 0：子ぷよ、1：軸ぷよ
	 * @return x：x座標、y：y座標
	 */
	static getXandY(next: number, type: number): { x: number, y: number } {
		const x = NextCellShape.CELLSIZE * next;
		const y = NextCellShape.CELLSIZE * type + (NextCellShape.CELLSIZE * 2 + NextCellShape.NEXT_PADDING) * next;
		return { x, y };
	}
}