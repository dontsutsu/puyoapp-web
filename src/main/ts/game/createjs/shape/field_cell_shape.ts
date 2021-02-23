import { BaseCellShape } from "../../../common/createjs/shape/base_cell_shape";

/**
 * Fieldセル
 */
export class FieldCellShape extends BaseCellShape {
	public static readonly BG_COLOR = "#FFFFFF";
	public static readonly SELECT_COLOR = "#00FFFF";

	public static readonly CELLSIZE = 35;

	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 */
	constructor(x: number, y: number) {
		super(x, y, FieldCellShape.CELLSIZE, FieldCellShape.BG_COLOR);

		this.alpha = y == 0 ? 0.01 : 1.0;
		this.x = FieldCellShape.CELLSIZE * x;
		this.y = FieldCellShape.CELLSIZE * y;
	}

	/**
	 * マウスオーバー
	 */
	public mouseover(): void {
		this.alpha = 1.0;
		this.changeColor(FieldCellShape.SELECT_COLOR);
	}

	/**
	 * マウスアウト
	 */
	public mouseout(): void {
		this.changeColor(FieldCellShape.BG_COLOR);
		this.alpha = this.posy == 0 ? 0.01 : 1.0;
	}
}
