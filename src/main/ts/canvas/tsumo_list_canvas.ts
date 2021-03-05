import { Text } from "@createjs/easeljs";
import { BaseCanvas } from "./base_canvas";
import { TsumoListCellShape } from "./shape/cell_shape/tsumo_list_cell_shape";

export class TsumoListCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly X_SIZE = 5;
	private static readonly Y_SIZE = 2;

	/**
	 * コンストラクタ
	 */
	constructor() {
		super("tsumoList", false);
		this._stage.enableMouseOver();

		// number
		for (let y = 0; y < TsumoListCanvas.Y_SIZE; y++) {
			for (let x = 0; x < TsumoListCanvas.X_SIZE; x++) {
				const index = x + y * TsumoListCanvas.X_SIZE + 1;
				const numShape = new Text(String(index), "bold 14px BIZ UDPGothic", "#888888");
				const xy = TsumoListCellShape.getXandY(x, y, 0);
				numShape.x = xy.x + (TsumoListCellShape.CELLSIZE / 2);
				numShape.y = xy.y - (TsumoListCellShape.CELLSIZE / 2);
				numShape.textAlign = "center";
				this._stage.addChild(numShape);
			}
		}

		// cellshape
		for (let y = 0; y < TsumoListCanvas.Y_SIZE; y++) {
			for (let x = 0; x < TsumoListCanvas.X_SIZE; x++) {
				for (let t = 0; t < 2; t++) {	// child: t=0, axis: t=1
					const cellShape = new TsumoListCellShape(x, y, t);
					this._stage.addChild(cellShape);
				}
			}
		}

		this._stage.update();
	}
}