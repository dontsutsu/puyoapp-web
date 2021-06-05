import { BaseCanvas } from "./base_canvas";
import { NextPuyoShape } from "./shape/puyo_shape/next_puyo_shape";
import { Tsumo } from "../game/tsumo";
import { Util } from "../util/util";
import { Constant } from "../util/constant";
import { Coordinate } from "../util/coordinate";

import { Container, Shape } from "@createjs/easeljs";
import { Tween } from "@createjs/tweenjs";
import $ from "jquery";

export class NextCanvas extends BaseCanvas {
	// constant
	private static readonly MOVE_TIME = 150;
	private static readonly TYPE_CHILD = 0;
	private static readonly TYPE_AXIS = 1;
	private static readonly NEXT = 0;
	private static readonly DOUBLE_NEXT = 1;
	// constant（FRAME用）
	private static readonly F_X_SHIFT = NextPuyoShape.DIAMETER;
	private static readonly F_Y_SHIFT = NextPuyoShape.DIAMETER / 3 * 7;
	private static readonly F_O_PAD = NextPuyoShape.DIAMETER / 6;
	private static readonly F_I_PAD = NextCanvas.F_O_PAD * 3;
	private static readonly F_SKEW_DEG = 5;
	private static readonly F_BASE_X = NextPuyoShape.DIAMETER + (NextCanvas.F_O_PAD + NextCanvas.F_I_PAD) * 2;
	private static readonly F_BASE_Y = NextPuyoShape.DIAMETER * 2 + (NextCanvas.F_O_PAD + NextCanvas.F_I_PAD) * 2;

	// property
	private _container: Container;
	private _nextAxisPuyoShape!: NextPuyoShape;
	private _nextChildPuyoShape!: NextPuyoShape;
	private _doubleNextAxisPuyoShape!: NextPuyoShape;
	private _doubleNextChildPuyoShape!: NextPuyoShape;
	private _isModel: boolean;

	/**
	 * constructor
	 * @param {string} canvasId canvasのID 
	 * @param {boolean} isModel
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
	}

	/**
	 * 初期化します。
	 * @param {Tsumo} next ネクスト
	 * @param {Tsumo} doubleNext ダブネク
	 */
	public init(next: Tsumo, doubleNext: Tsumo): void {
		if (this._nextAxisPuyoShape != undefined) this._container.removeChild(this._nextAxisPuyoShape);
		if (this._nextChildPuyoShape != undefined) this._container.removeChild(this._nextChildPuyoShape);
		if (this._doubleNextAxisPuyoShape != undefined) this._container.removeChild(this._doubleNextAxisPuyoShape);
		if (this._doubleNextChildPuyoShape != undefined) this._container.removeChild(this._doubleNextChildPuyoShape);

		this._nextAxisPuyoShape = new NextPuyoShape(NextCanvas.NEXT, NextCanvas.TYPE_AXIS, next.axisColor);
		this._nextChildPuyoShape = new NextPuyoShape(NextCanvas.NEXT, NextCanvas.TYPE_CHILD, next.childColor);
		this._doubleNextAxisPuyoShape = new NextPuyoShape(NextCanvas.DOUBLE_NEXT, NextCanvas.TYPE_AXIS, doubleNext.axisColor);
		this._doubleNextChildPuyoShape = new NextPuyoShape(NextCanvas.DOUBLE_NEXT, NextCanvas.TYPE_CHILD, doubleNext.childColor);
		this._container.addChild(this._nextAxisPuyoShape, this._nextChildPuyoShape, this._doubleNextAxisPuyoShape, this._doubleNextChildPuyoShape);	
	}

	/**
	 * ツモをひとつ進めます。
	 * @param {Tsumo} tsumo 次にダブネクとなるツモ
	 * @returns {Tween[]} 
	 */
	public advance(tsumo: Tsumo): Tween[] {
		const val = Util.getAnimateMode();
		const naCoord = NextCanvas.getCanvasCoordinate(NextCanvas.NEXT, NextCanvas.TYPE_AXIS);
		const ncCoord = NextCanvas.getCanvasCoordinate(NextCanvas.NEXT, NextCanvas.TYPE_CHILD);
		const dnaCoord = NextCanvas.getCanvasCoordinate(NextCanvas.DOUBLE_NEXT, NextCanvas.TYPE_AXIS);
		const dncCoord = NextCanvas.getCanvasCoordinate(NextCanvas.DOUBLE_NEXT, NextCanvas.TYPE_CHILD);

		// old next
		const oldNextAxisPuyo = this._nextAxisPuyoShape;
		const oldNextChildPuyo = this._nextChildPuyoShape;

		const onaToY = naCoord.y - NextPuyoShape.DIAMETER * 3;
		const onaTween = Tween.get(oldNextAxisPuyo)
			.to({y: naCoord.y})
			.to({y: onaToY}, NextCanvas.MOVE_TIME * val)
			.call(() => { this._container.removeChild(oldNextAxisPuyo); });

		const oncToY = ncCoord.y - NextPuyoShape.DIAMETER * 3;
		const oncTween = Tween.get(oldNextChildPuyo)
			.to({y: ncCoord.y})
			.to({y: oncToY}, NextCanvas.MOVE_TIME * val)
			.call(() => { this._container.removeChild(oldNextChildPuyo); });
		
		// new next
		const newNextAxisPuyo = this._doubleNextAxisPuyoShape;
		const newNextChildPuyo = this._doubleNextChildPuyoShape;

		const nnaTween = Tween.get(newNextAxisPuyo)
			.to({x: dnaCoord.x, y: dnaCoord.y})
			.to({x: naCoord.x, y: naCoord.y}, NextCanvas.MOVE_TIME * val);

		const nncTween = Tween.get(newNextChildPuyo)
			.to({x: dncCoord.x, y: dncCoord.y})
			.to({x: ncCoord.x, y: ncCoord.y}, NextCanvas.MOVE_TIME * val);

		// new doubleNext
		const newDoubleNextAxisPuyo = new NextPuyoShape(NextCanvas.DOUBLE_NEXT, NextCanvas.TYPE_AXIS, tsumo.axisColor);
		const newDoubleNextChildPuyo = new NextPuyoShape(NextCanvas.DOUBLE_NEXT, NextCanvas.TYPE_CHILD, tsumo.childColor);

		const ndaFromY = dnaCoord.y + NextPuyoShape.DIAMETER * 3;
		newDoubleNextAxisPuyo.y = ndaFromY;
		const ndaTween = Tween.get(newDoubleNextAxisPuyo)
			.to({y: ndaFromY})
			.to({y: dnaCoord.y}, NextCanvas.MOVE_TIME * val);

		const ndcFromY = dncCoord.y + NextPuyoShape.DIAMETER * 3;
		newDoubleNextChildPuyo.y = ndcFromY;
		const ndcTween = Tween.get(newDoubleNextChildPuyo)
			.to({y: ndcFromY})
			.to({y: dncCoord.y}, NextCanvas.MOVE_TIME * val);

		this._container.addChild(newDoubleNextAxisPuyo, newDoubleNextChildPuyo);
		this._nextAxisPuyoShape = newNextAxisPuyo;
		this._nextChildPuyoShape = newNextChildPuyo;
		this._doubleNextAxisPuyoShape = newDoubleNextAxisPuyo;
		this._doubleNextChildPuyoShape = newDoubleNextChildPuyo;
		
		return [onaTween, oncTween, nnaTween, nncTween, ndaTween, ndcTween];
	}

	/**
	 * フレームを生成します。
	 * @returns {Container}
	 */
	private createFrameContainer(): Container {
		const oFrameColor = "#E0E0E0";
		const iFrameColor = this._isModel ? Constant.TWO_PLAYER_FRAME_COLOR : Constant.ONE_PLAYER_FRAME_COLOR;

		const sin = Util.sin(NextCanvas.F_SKEW_DEG);
		const cos = Util.cos(NextCanvas.F_SKEW_DEG);

		// 角丸のサイズ
		const oRad = NextPuyoShape.DIAMETER / 3;
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

	// static method
	/**
	 * next、typeからcanvas上の座標を取得
	 * @param {number} next 0：ネクスト、1：ダブネク
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 * @returns {Coordinate} canvas上の座標
	 */
	public static getCanvasCoordinate(next: number, type: number): Coordinate {
		const x = NextCanvas.F_X_SHIFT * next;
		const y = NextPuyoShape.DIAMETER * type + NextCanvas.F_Y_SHIFT * next;
		return new Coordinate(x, y);
	}
}