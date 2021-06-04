import { Container } from "@createjs/easeljs";
import { Tween, Ease } from "@createjs/tweenjs";
import { EnumTsumoChildPosition } from "../game/enum_tsumo_child_position";
import { Field } from "../game/field";
import { Tsumo } from "../game/tsumo";
import { Util } from "../util/util";
import { BaseCanvas } from "./base_canvas";
import { FieldCanvas } from "./field_canvas";
import { TsumoCellShape } from "./shape/cell_shape/tsumo_cell_shape";
import { TsumoPuyoShape } from "./shape/puyo_shape/tsumo_puyo_shape";
import $ from "jquery";
import { Coordinate } from "../util/coordinate";

export class TsumoCanvas extends BaseCanvas {
	// constant
	private static readonly Y_SIZE = 3;
	private static readonly MOVE_VEL = 80;
	private static readonly ROTATE_VEL = 80;
	private static readonly DROP_VEL = 50;

	// property
	private _container: Container;
	private _axisPuyoShape!: TsumoPuyoShape;
	private _childPuyoShape!: TsumoPuyoShape;

	/**
	 * constructor
	 * @param {string} canvasId canvasのID 
	 */
	constructor(canvasId: string) {
		super(canvasId, true);

		const xPad = FieldCanvas.F_O_PAD + FieldCanvas.F_I_PAD;

		const w = TsumoCellShape.CELLSIZE * Field.X_SIZE + xPad * 2;
		const h = TsumoCellShape.CELLSIZE * TsumoCanvas.Y_SIZE;
		$("#" + canvasId).attr("width", 1 + Math.ceil(w));
		$("#" + canvasId).attr("height", 1 + Math.ceil(h));

		// Container
		this._container = new Container();
		this._stage.addChild(this._container);
		this._container.x = xPad;
		
		// CellShape
		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < TsumoCanvas.Y_SIZE; y++) {
				const cellShape = new TsumoCellShape(new Coordinate(x, y));
				this._container.addChild(cellShape);
			}
		}
	}

	/**
	 * 初期化します。
	 * @param {Tsumo} tsumo 
	 */
	public init(tsumo: Tsumo): void {
		if (this._axisPuyoShape != undefined) this._container.removeChild(this._axisPuyoShape);
		if (this._childPuyoShape != undefined) this._container.removeChild(this._childPuyoShape);

		this._axisPuyoShape = new TsumoPuyoShape(new Coordinate(tsumo.axisX, tsumo.axisY), tsumo.axisColor);
		this._childPuyoShape = new TsumoPuyoShape(new Coordinate(tsumo.childX, tsumo.childY), tsumo.childColor);
		this._container.addChild(this._axisPuyoShape, this._childPuyoShape);
	}

	/**
	 * ツモを動かすTweenを取得します。
	 * @param {number} fromAX 軸ぷよの移動元x座標
	 * @param {number} toAX 軸ぷよの移動先x座標
	 * @param {EnumTsumoChildPosition} position  
	 * @returns {Tween[]}
	 */
	public getMoveTween(fromAX: number, toAX: number, position: EnumTsumoChildPosition): Tween[] {
		const val = Util.getAnimateMode();
		const diffAX = toAX - fromAX;

		// axis
		const fromAxisX = TsumoCellShape.CELLSIZE * fromAX;
		const toAxisX = TsumoCellShape.CELLSIZE * toAX;
		const axisTween = Tween.get(this._axisPuyoShape)
			.to({x: fromAxisX})
			.to({x: toAxisX}, Math.abs(diffAX) * TsumoCanvas.MOVE_VEL * val);

		// child
		const fromChildX = TsumoCellShape.CELLSIZE * (fromAX + position.childRelativeX);
		const toChildX = TsumoCellShape.CELLSIZE * (toAX + position.childRelativeX);
		const childTween = Tween.get(this._childPuyoShape)
			.to({x: fromChildX})
			.to({x: toChildX}, Math.abs(diffAX) * TsumoCanvas.MOVE_VEL * val);

		return [axisTween, childTween];
	}

	/**
	 * ツモを回転するTweenを取得します。
	 * @param {number} fromAxisAX 軸ぷよの移動元x座標
	 * @param {number} toAxisAX 軸ぷよの移動先x座標
	 * @param {EnumTsumoChildPosition} beforePosition 回転前のEnumTsumoPosition
	 * @param {EnumTsumoChildPosition} afterPosition 回転後のEnumTsumoPosition
	 * @returns {Tween[]}
	 */
	public getRotateTween(fromAxisAX: number, toAxisAX: number, beforePosition: EnumTsumoChildPosition, afterPosition: EnumTsumoChildPosition): Tween[] {
		const val = Util.getAnimateMode();
		
		// axis
		const fromAxisX = TsumoCellShape.CELLSIZE * fromAxisAX;
		const toAxisX = TsumoCellShape.CELLSIZE * toAxisAX;
		const axisTween = Tween.get(this._axisPuyoShape)
			.to({x: fromAxisX})
			.to({x: toAxisX}, TsumoCanvas.ROTATE_VEL * val);
		
		// child(X)
		const fromChildX = TsumoCellShape.CELLSIZE * (fromAxisAX + beforePosition.childRelativeX);
		const toChildX = TsumoCellShape.CELLSIZE * (toAxisAX + afterPosition.childRelativeX);
		const easeX = (beforePosition == EnumTsumoChildPosition.TOP || beforePosition == EnumTsumoChildPosition.BOTTOM) ? Ease.sineOut : Ease.sineIn;
		const childXTween = Tween.get(this._childPuyoShape)
			.to({x: fromChildX})
			.to({x: toChildX}, TsumoCanvas.ROTATE_VEL * val, easeX);

		//child(Y)
		const fromChildY = TsumoCellShape.CELLSIZE * TsumoCanvas.convertY(1 + beforePosition.childRelativeY);
		const toChildY = TsumoCellShape.CELLSIZE * TsumoCanvas.convertY(1 + afterPosition.childRelativeY);
		const easeY = (beforePosition == EnumTsumoChildPosition.TOP || beforePosition == EnumTsumoChildPosition.BOTTOM) ? Ease.sineIn : Ease.sineOut;
		const childYTween = Tween.get(this._childPuyoShape)
			.to({y: fromChildY})
			.to({y: toChildY}, TsumoCanvas.ROTATE_VEL * val, easeY);
		
		return [axisTween, childXTween, childYTween];
	}

	/**
	 * ツモを落とすTweenを取得します。
	 * @param {EnumTsumoChildPosition} beforePosition
	 * @returns {Tween[]}
	 */
	public getDropTween(beforePosition: EnumTsumoChildPosition): Tween[] {
		const val = Util.getAnimateMode();

		// axis
		const fromAxisY = TsumoCellShape.CELLSIZE * TsumoCanvas.convertY(1);
		const toAxisY = TsumoCellShape.CELLSIZE * TsumoCanvas.convertY(-2);
		const axisTween = Tween.get(this._axisPuyoShape)
			.to({y: fromAxisY})
			.to({y: toAxisY}, 3 * TsumoCanvas.DROP_VEL * val);

		// child
		const fromChildY = TsumoCellShape.CELLSIZE * TsumoCanvas.convertY(1 + beforePosition.childRelativeY);
		const toChildY = TsumoCellShape.CELLSIZE * TsumoCanvas.convertY(-2 + beforePosition.childRelativeY);
		const childTween = Tween.get(this._childPuyoShape)
			.to({y: fromChildY})
			.to({y: toChildY}, 3 * TsumoCanvas.DROP_VEL * val);
		
		return [axisTween, childTween];
	}

	/**
	 * ツモを進めるアニメーションを取得します。
	 * @param {Tsumo} tsumo 次のツモ
	 * @returns {Tween[]} 
	 */
	public advance(tsumo: Tsumo): Tween[] {
		const val = Util.getAnimateMode();
		const diffY = 3;

		const oldAxisPuyo = this._axisPuyoShape;
		const oldChildPuyo = this._childPuyoShape;

		this._axisPuyoShape = new TsumoPuyoShape(new Coordinate(tsumo.axisX, tsumo.axisY + diffY), tsumo.axisColor);
		this._childPuyoShape = new TsumoPuyoShape(new Coordinate(tsumo.childX, tsumo.childY + diffY), tsumo.childColor);
		this._container.addChild(this._axisPuyoShape, this._childPuyoShape);

		// axis
		const fromAxisY = this._axisPuyoShape.y;
		const toAxisY = this._axisPuyoShape.y + TsumoCellShape.CELLSIZE * diffY;
		const axisTween = Tween.get(this._axisPuyoShape)
			.to({y: fromAxisY})
			.to({y: toAxisY}, Math.abs(diffY) * TsumoCanvas.DROP_VEL * val)
			.call(() => { this._container.removeChild(oldAxisPuyo); });
		
		// child
		const fromChildY = this._childPuyoShape.y;
		const toChildY = this._childPuyoShape.y + TsumoCellShape.CELLSIZE * diffY;
		const childTween = Tween.get(this._childPuyoShape)
			.to({y: fromChildY})
			.to({y: toChildY}, Math.abs(diffY) * TsumoCanvas.DROP_VEL * val)
			.call(() => { this._container.removeChild(oldChildPuyo); });
		
		return [axisTween, childTween];
	}

	// static method
	/**
	 * ツモの座標からcanvas上の座標を取得
	 * @param {Coordinate} coord ツモの座標
	 * @returns {Coordinate} canvas上の座標
	 */
	public static getCanvasCoordinate(coord: Coordinate) {
		const canvasCoord = coord.clone()
			.calculateY(TsumoCanvas.convertY)
			.times(TsumoCellShape.CELLSIZE);
		return canvasCoord;
	}

	/**
	 * ロジック上のy方向とcanvas上のy方向が異なるため、yの値を変換します。
	 * @param {number} y ロジック上のy座標
	 * @returns {number} canvas上のy座標
	 */
	private static convertY(y: number): number {
		return TsumoCanvas.Y_SIZE - 1 - y;
	}
}