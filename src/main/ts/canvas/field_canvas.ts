import { Container, Shape } from "@createjs/easeljs";
import { BaseCanvas } from "./base_canvas";
import { Field } from "../game/field";
import { FieldCellShape } from "./shape/cell_shape/field_cell_shape";
import { Util } from "../util/util";

export class FieldCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly FRAME_SKEW_DEG = 5;

	// CLASS FIELD
	private _container: Container;

	/**
	 * コンストラクタ
	 */
	constructor() {
		super("field", true);
		this._stage.enableMouseOver();
		
		// frame
		const frame = this.createFrameContainer();
		this._stage.addChild(frame);

		// container
		this._container = new Container();
		this._stage.addChild(this._container);
		this._container.x = 20;
		this._container.y = 20 + 250 * Util.sin(FieldCanvas.FRAME_SKEW_DEG);

		// CellShape
		for (let y = 0; y < Field.Y_SIZE; y++) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				const cellShape = new FieldCellShape(x, y);
				this._container.addChild(cellShape);
			}
		}
	}

	/**
	 * 
	 */
	private createFrameContainer(): Container {
		// 傾けた分の計算
		const deg = FieldCanvas.FRAME_SKEW_DEG;
		const sin = Util.sin(deg);
		const cos = Util.cos(deg);
		const y = 250 * sin;

		// frame
		const outsideFrame = new Shape();
		outsideFrame.graphics
			.f("#E0E0E0")
			.rr(0.5, 0.5, 250 / cos, 495 + 250 * sin, 12.5);
		outsideFrame.skewY = deg * (-1);

		const insideFrame = new Shape();
		insideFrame.graphics
			.f("#EE808D")
			.rr(5.5, 5.5, 240 / cos, 485 + 240 * sin, 10);
		insideFrame.skewY = deg * (-1);

		const frameContainer = new Container();
		frameContainer.addChild(outsideFrame, insideFrame);
		frameContainer.y = y;
		
		return frameContainer;
	}
}