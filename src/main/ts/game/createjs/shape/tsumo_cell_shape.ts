import { BaseCellShape } from "../../../common/createjs/shape/base_cell_shape";

/**
 * Tsumoセル
 */
export class TsumoCellShape extends BaseCellShape {
	public static readonly CELLSIZE = 35;
	public static readonly BG_COLOR = "#FFFFFF";

	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 */
	constructor(x: number, y: number) {
		super(x, y, TsumoCellShape.CELLSIZE, TsumoCellShape.BG_COLOR);

		this.x = TsumoCellShape.CELLSIZE * x;
		this.y = TsumoCellShape.CELLSIZE * y;
	}
}