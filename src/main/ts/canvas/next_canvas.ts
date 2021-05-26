import { Container, Shape } from "@createjs/easeljs";
import { Tween } from "@createjs/tweenjs";
import { Tsumo } from "../game/tsumo";
import { Util } from "../util/util";
import { BaseCanvas } from "./base_canvas";
import { NextCellShape } from "./shape/cell_shape/next_cell_shape";
import { NextPuyoShape } from "./shape/puyo_shape/next_puyo_shape";
import $ from "jquery";

export class NextCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly MOVE_TIME = 150;
	// CONSTANT（FRAME用）
	public static readonly F_X_SHIFT = NextCellShape.CELLSIZE;
	public static readonly F_Y_SHIFT = NextCellShape.CELLSIZE / 3 * 7;
	private static readonly F_O_PAD = NextCellShape.CELLSIZE / 6;
	private static readonly F_I_PAD = NextCanvas.F_O_PAD * 3;
	private static readonly F_SKEW_DEG = 5;
	private static readonly F_BASE_X = NextCellShape.CELLSIZE + (NextCanvas.F_O_PAD + NextCanvas.F_I_PAD) * 2;
	private static readonly F_BASE_Y = NextCellShape.CELLSIZE * 2 + (NextCanvas.F_O_PAD + NextCanvas.F_I_PAD) * 2;

	// CLASS FIELD
	private _container: Container;
	private _nextAxisPuyoShape!: NextPuyoShape;
	private _nextChildPuyoShape!: NextPuyoShape;
	private _doubleNextAxisPuyoShape!: NextPuyoShape;
	private _doubleNextChildPuyoShape!: NextPuyoShape;
	private _isModel: boolean;

	/**
	 * コンストラクタ
	 * @param {string} canvasId canvasのID 
	 */
	constructor(canvasId: string, isModel: boolean = false) {
		super(canvasId, true);
		this._isModel = isModel;

		const w = NextCanvas.F_X_SHIFT + NextCanvas.F_BASE_X;
		const h = NextCanvas.F_Y_SHIFT + (NextCanvas.F_BASE_Y + NextCanvas.F_BASE_X * Util.sin(NextCanvas.F_SKEW_DEG) * 2);
		$("#" + canvasId).attr("width", 1 + Math.ceil(w));
		$("#" + canvasId).attr("height", 1 + Math.ceil(h));

		// frame
		const frame = this.createFrameContainer();
		this._stage.addChild(frame);

		// Container
		this._container = new Container();
		this._stage.addChild(this._container);
		this._container.x = NextCanvas.F_O_PAD + NextCanvas.F_I_PAD;
		this._container.y = NextCanvas.F_O_PAD + NextCanvas.F_I_PAD + NextCanvas.F_BASE_X * Util.sin(NextCanvas.F_SKEW_DEG);

		// 手本（2p）の場合、stage左右反転
		if (this._isModel) {
			this._stage.scaleX = -1;
			this._stage.x = w;
		}

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
	 * @param {Tsumo} next 
	 * @param {Tsumo} doubleNext 
	 */
	public init(next: Tsumo, doubleNext: Tsumo): void {
		if (this._nextAxisPuyoShape != undefined) this._container.removeChild(this._nextAxisPuyoShape);
		if (this._nextChildPuyoShape != undefined) this._container.removeChild(this._nextChildPuyoShape);
		if (this._doubleNextAxisPuyoShape != undefined) this._container.removeChild(this._doubleNextAxisPuyoShape);
		if (this._doubleNextChildPuyoShape != undefined) this._container.removeChild(this._doubleNextChildPuyoShape);

		this._nextAxisPuyoShape = new NextPuyoShape(0, 1, next.axisColor);
		this._nextChildPuyoShape = new NextPuyoShape(0, 0, next.childColor);
		this._doubleNextAxisPuyoShape = new NextPuyoShape(1, 1, doubleNext.axisColor);
		this._doubleNextChildPuyoShape = new NextPuyoShape(1, 0, doubleNext.childColor);
		this._container.addChild(this._nextAxisPuyoShape, this._nextChildPuyoShape, this._doubleNextAxisPuyoShape, this._doubleNextChildPuyoShape);	
	}

	/**
	 * 
	 * @param {Tsumo} tsumo 
	 * @returns {Tween[]}
	 */
	public advance(tsumo: Tsumo): Tween[] {
		const val = Util.getAnimateMode();
		const naXY = NextCellShape.getXandY(0, 1);
		const ncXY = NextCellShape.getXandY(0, 0);
		const dnaXY = NextCellShape.getXandY(1, 1);
		const dncXY = NextCellShape.getXandY(1, 0);

		// old next
		const oldNextAxisPuyo = this._nextAxisPuyoShape;
		const oldNextChildPuyo = this._nextChildPuyoShape;

		const onaToY = naXY.y - NextCellShape.CELLSIZE * 3;
		const onaTween = Tween.get(oldNextAxisPuyo)
			.to({y: naXY.y})
			.to({y: onaToY}, NextCanvas.MOVE_TIME * val)
			.call(() => { this._container.removeChild(oldNextAxisPuyo); });

		const oncToY = ncXY.y - NextCellShape.CELLSIZE * 3;
		const oncTween = Tween.get(oldNextChildPuyo)
			.to({y: ncXY.y})
			.to({y: oncToY}, NextCanvas.MOVE_TIME * val)
			.call(() => { this._container.removeChild(oldNextChildPuyo); });
		
		// new next
		const newNextAxisPuyo = this._doubleNextAxisPuyoShape;
		const newNextChildPuyo = this._doubleNextChildPuyoShape;

		const nnaTween = Tween.get(newNextAxisPuyo)
			.to({x: dnaXY.x, y: dnaXY.y})
			.to({x: naXY.x, y: naXY.y}, NextCanvas.MOVE_TIME * val);

		const nncTween = Tween.get(newNextChildPuyo)
			.to({x: dncXY.x, y: dncXY.y})
			.to({x: ncXY.x, y: ncXY.y}, NextCanvas.MOVE_TIME * val);

		// new doubleNext
		const newDoubleNextAxisPuyo = new NextPuyoShape(1, 1, tsumo.axisColor);
		const newDoubleNextChildPuyo = new NextPuyoShape(1, 0, tsumo.childColor);

		const ndaFromY = dnaXY.y + NextCellShape.CELLSIZE * 3;
		newDoubleNextAxisPuyo.y = ndaFromY;
		const ndaTween = Tween.get(newDoubleNextAxisPuyo)
			.to({y: ndaFromY})
			.to({y: dnaXY.y}, NextCanvas.MOVE_TIME * val);

		const ndcFromY = dncXY.y + NextCellShape.CELLSIZE * 3;
		newDoubleNextChildPuyo.y = ndcFromY;
		const ndcTween = Tween.get(newDoubleNextChildPuyo)
			.to({y: ndcFromY})
			.to({y: dncXY.y}, NextCanvas.MOVE_TIME * val);

		this._container.addChild(newDoubleNextAxisPuyo, newDoubleNextChildPuyo);
		this._nextAxisPuyoShape = newNextAxisPuyo;
		this._nextChildPuyoShape = newNextChildPuyo;
		this._doubleNextAxisPuyoShape = newDoubleNextAxisPuyo;
		this._doubleNextChildPuyoShape = newDoubleNextChildPuyo;
		
		return [onaTween, oncTween, nnaTween, nncTween, ndaTween, ndcTween];
	}

	/**
	 * @returns {Container}
	 */
	private createFrameContainer(): Container {
		const oFrameColor = "#E0E0E0";
		const iFrameColor = this._isModel ? "#F57777" : "#40B0FF";

		const sin = Util.sin(NextCanvas.F_SKEW_DEG);
		const cos = Util.cos(NextCanvas.F_SKEW_DEG);

		// 角丸のサイズ
		const oRad = NextCellShape.CELLSIZE / 3;
		const iRad = oRad / 5 * 4;

		// frame
		const oFrameN = new Shape();
		oFrameN.graphics
			.f(oFrameColor)
			.rr(0.5, 0.5, NextCanvas.F_BASE_X / cos, NextCanvas.F_BASE_Y + NextCanvas.F_BASE_X * sin, oRad);
		oFrameN.skewY = NextCanvas.F_SKEW_DEG;

		const oFrameD = new Shape();
		oFrameD.graphics
			.f(oFrameColor)
			.rr(NextCanvas.F_X_SHIFT + 0.5, NextCanvas.F_Y_SHIFT + 0.5, NextCanvas.F_BASE_X / cos, NextCanvas.F_BASE_Y + NextCanvas.F_BASE_X * sin, oRad);
		oFrameD.skewY = NextCanvas.F_SKEW_DEG;

		const iFrameN = new Shape();
		iFrameN.graphics
			.f(iFrameColor)
			.rr(NextCanvas.F_O_PAD + 0.5, NextCanvas.F_O_PAD + 0.5, (NextCanvas.F_BASE_X - NextCanvas.F_O_PAD * 2) / cos, (NextCanvas.F_BASE_Y - NextCanvas.F_O_PAD * 2) + (NextCanvas.F_BASE_X - NextCanvas.F_O_PAD * 2) * sin, iRad);
		iFrameN.skewY = NextCanvas.F_SKEW_DEG;

		const iFrameD = new Shape();
		iFrameD.graphics
			.f(iFrameColor)
			.rr(NextCanvas.F_X_SHIFT + NextCanvas.F_O_PAD + 0.5, NextCanvas.F_Y_SHIFT + NextCanvas.F_O_PAD + 0.5, (NextCanvas.F_BASE_X - NextCanvas.F_O_PAD * 2) / cos, (NextCanvas.F_BASE_Y - NextCanvas.F_O_PAD * 2) + (NextCanvas.F_BASE_X - NextCanvas.F_O_PAD * 2) * sin, iRad);
		iFrameD.skewY = NextCanvas.F_SKEW_DEG;
		
		const frameContainer = new Container();
		frameContainer.addChild(oFrameN, oFrameD);
		frameContainer.addChild(iFrameN, iFrameD);
		
		return frameContainer;
	}
}