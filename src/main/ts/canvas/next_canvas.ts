import { Container, Shape } from "@createjs/easeljs";
import { Tsumo } from "../game/tsumo";
import { Util } from "../util/util";
import { BaseCanvas } from "./base_canvas";
import { NextCellShape } from "./shape/cell_shape/next_cell_shape";
import { NextPuyoShape } from "./shape/puyo_shape/next_puyo_shape";

export class NextCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly FRAME_SKEW_DEG = 5;

	// CLASS FIELD
	private _container: Container;
	private _nextAxisPuyoShape!: NextPuyoShape;
	private _nextChildPuyoShape!: NextPuyoShape;
	private _doubleNextAxisPuyoShape!: NextPuyoShape;
	private _doubleNextChildPuyoShape!: NextPuyoShape;

	/**
	 * コンストラクタ
	 */
	constructor() {
		super("next", true);

		// frame
		const frame = this.createFrameContainer();
		this._stage.addChild(frame);

		// Container
		this._container = new Container();
		this._stage.addChild(this._container);
		this._container.x = 20;
		this._container.y = 20 + 70 * Util.sin(NextCanvas.FRAME_SKEW_DEG);

		// CellShape
		for (let n = 0; n < 2; n++) {	// next: n=0, double next: n=1
			for (let t = 0; t < 2; t++) {	// child: t=0, axis: t=1
				const cellShape = new NextCellShape(n, t);
				this._container.addChild(cellShape);
			}
		}
	}

	/**
	 * 
	 * @param next 
	 * @param doubleNext 
	 */
	public init(next: Tsumo, doubleNext: Tsumo): void {
		this._nextAxisPuyoShape = new NextPuyoShape(0, 1, next.axisColor);
		this._nextChildPuyoShape = new NextPuyoShape(0, 0, next.childColor);
		this._doubleNextAxisPuyoShape = new NextPuyoShape(1, 1, doubleNext.axisColor);
		this._doubleNextChildPuyoShape = new NextPuyoShape(1, 0, doubleNext.childColor);
		this._container.addChild(this._nextAxisPuyoShape, this._nextChildPuyoShape, this._doubleNextAxisPuyoShape, this._doubleNextChildPuyoShape);	
	}

	/**
	 * 
	 */
	private createFrameContainer(): Container {
		const deg = NextCanvas.FRAME_SKEW_DEG;
		const sin = Util.sin(deg);
		const cos = Util.cos(deg);

		// frame
		const frame1_1 = new Shape();
		frame1_1.graphics
			.f("#E0E0E0")
			.rr(0.5, 0.5, 70 / cos, 100 + 70 * sin, 12.5);	//x: 20(pad)+30+20(pad), y: 20(pad)+60+20(pad)
		frame1_1.skewY = deg;

		const frame1_2 = new Shape();
		frame1_2.graphics
			.f("#E0E0E0")
			.rr(30.5, 70.5, 70 / cos, 100 + 70 * sin, 12.5);	//x: 20(pad)+30+20(pad), y: 20(pad)+60+20(pad)
		frame1_2.skewY = deg;

		const frame2_1 = new Shape();
		frame2_1.graphics
			.f("#EE808D")
			.rr(5.5, 5.5, 60 / cos, 90 + 60 * sin, 10);	//x: 20(pad)+30+20(pad), y: 20(pad)+60+20(pad)
		frame2_1.skewY = deg;

		const frame2_2 = new Shape();
		frame2_2.graphics
			.f("#EE808D")
			.rr(35.5, 75.5, 60 / cos, 90 + 60 * sin, 10);	//x: 20(pad)+30+20(pad), y: 20(pad)+60+20(pad)
		frame2_2.skewY = deg;
		
		const frameContainer = new Container();
		frameContainer.addChild(frame1_1, frame1_2);
		frameContainer.addChild(frame2_1, frame2_2);
		
		return frameContainer;
	}
}