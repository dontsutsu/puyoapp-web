import { Container } from "@createjs/easeljs";
import { Field } from "../game/field";
import { BaseCanvas } from "./base_canvas";
import { TsumoCellShape } from "./shape/cell_shape/tsumo_cell_shape";

export class TsumoCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly Y_SIZE = 3;

	// CLASS FIELD
	private _container: Container;

	/**
	 * コンストラクタ
	 */
	constructor() {
		super("tsumo", true);

		// Container
		this._container = new Container();
		this._stage.addChild(this._container);
		this._container.x = 20;
		
		// CellShape
		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < TsumoCanvas.Y_SIZE; y++) {
				const cellShape = new TsumoCellShape(x, y);
				this._container.addChild(cellShape);
			}
		}
	}
}