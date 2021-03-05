import { BaseCellShape } from "./base_cell_shape";

export class TsumoCellShape extends BaseCellShape {
	// CONSTANT
	public static readonly CELLSIZE = 35;
	public static readonly BG_COLOR = "#FFFFFF";

	// CLASS FIELD
	private _ax: number;
	private _ay: number;

	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 */
	constructor(ax: number, ay: number) {
		const x = TsumoCellShape.CELLSIZE * ax;
		const y = TsumoCellShape.CELLSIZE * ay; 

		super(x, y, TsumoCellShape.CELLSIZE, TsumoCellShape.BG_COLOR);

		this._ax = ax;
		this._ay = ay;
	}
}