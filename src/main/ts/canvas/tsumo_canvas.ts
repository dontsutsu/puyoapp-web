import { Container } from "@createjs/easeljs";
import { Tween, Ease } from "@createjs/tweenjs";
import { EnumTsumoPosition } from "../game/enum_tsumo_position";
import { Field } from "../game/field";
import { Tsumo } from "../game/tsumo";
import { Util } from "../util/util";
import { BaseCanvas } from "./base_canvas";
import { FieldCanvas } from "./field_canvas";
import { TsumoCellShape } from "./shape/cell_shape/tsumo_cell_shape";
import { TsumoPuyoShape } from "./shape/puyo_shape/tsumo_puyo_shape";
import $ from "jquery";

export class TsumoCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly Y_SIZE = 3;
	private static readonly MOVE_VEL = 80;
	private static readonly ROTATE_VEL = 80;
	private static readonly DROP_VEL = 50;

	// CLASS FIELD
	private _container: Container;
	private _axisPuyoShape!: TsumoPuyoShape;
	private _childPuyoShape!: TsumoPuyoShape;

	/**
	 * コンストラクタ
	 * @param {string} canvasId canvasのID 
	 */
	constructor(canvasId: string) {
		super(canvasId, true);

		const xPad = FieldCanvas.F_O_PAD + FieldCanvas.F_I_PAD;

		$("#" + canvasId).attr("width", 1 + TsumoCellShape.CELLSIZE * Field.X_SIZE + xPad * 2);
		$("#" + canvasId).attr("height", 1 + TsumoCellShape.CELLSIZE * TsumoCanvas.Y_SIZE);

		// Container
		this._container = new Container();
		this._stage.addChild(this._container);
		this._container.x = xPad;
		
		// CellShape
		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < TsumoCanvas.Y_SIZE; y++) {
				const cellShape = new TsumoCellShape(x, y);
				this._container.addChild(cellShape);
			}
		}
	}

	/**
	 * 
	 * @param {Tsumo} tsumo 
	 */
	public init(tsumo: Tsumo): void {
		this._axisPuyoShape = new TsumoPuyoShape(tsumo.axisX, tsumo.axisY, tsumo.axisColor);
		this._childPuyoShape = new TsumoPuyoShape(tsumo.childX, tsumo.childY, tsumo.childColor);
		this._container.addChild(this._axisPuyoShape, this._childPuyoShape);
	}

	/**
	 * 
	 * @param {number} fromAX 
	 * @param {number} toAX
	 * @param {EnumTsumoPosition} position 
	 * @returns {Tween[]}
	 */
	public getMoveTween(fromAX: number, toAX: number, position: EnumTsumoPosition): Tween[] {
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
	 * 
	 * @param {number} fromAxisAX 
	 * @param {number} toAxisAX 
	 * @param {EnumTsumoPosition} beforePosition 
	 * @param {EnumTsumoPosition} afterPosition 
	 * @returns {Tween[]}
	 */
	public getRotateTween(fromAxisAX: number, toAxisAX: number, beforePosition: EnumTsumoPosition, afterPosition: EnumTsumoPosition): Tween[] {
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
		const easeX = (beforePosition == EnumTsumoPosition.TOP || beforePosition == EnumTsumoPosition.BOTTOM) ? Ease.sineOut : Ease.sineIn;
		const childXTween = Tween.get(this._childPuyoShape)
			.to({x: fromChildX})
			.to({x: toChildX}, TsumoCanvas.ROTATE_VEL * val, easeX);

		//child(Y)
		const fromChildY = TsumoCellShape.CELLSIZE * TsumoCanvas.convertY(1 + beforePosition.childRelativeY);
		const toChildY = TsumoCellShape.CELLSIZE * TsumoCanvas.convertY(1 + afterPosition.childRelativeY);
		const easeY = (beforePosition == EnumTsumoPosition.TOP || beforePosition == EnumTsumoPosition.BOTTOM) ? Ease.sineIn : Ease.sineOut;
		const childYTween = Tween.get(this._childPuyoShape)
			.to({y: fromChildY})
			.to({y: toChildY}, TsumoCanvas.ROTATE_VEL * val, easeY);
		
		return [axisTween, childXTween, childYTween];
	}

	/**
	 * ロジック上のy方向とcanvas上のy方向が異なるため、yの値を変換します。
	 * @param {number} y
	 * @returns {number} 
	 */
	public static convertY(y: number): number {
		return TsumoCanvas.Y_SIZE - 1 - y;
	}

	/**
	 * @param {EnumTsumoPosition} beforePosition
	 * @returns {Tween[]}
	 */
	public getDropTween(beforePosition: EnumTsumoPosition): Tween[] {
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
	 * 
	 * @param {Tsumo} tsumo
	 * @returns {Tween[]} 
	 */
	public advance(tsumo: Tsumo): Tween[] {
		const val = Util.getAnimateMode();
		const diffY = 3;

		const oldAxisPuyo = this._axisPuyoShape;
		const oldChildPuyo = this._childPuyoShape;

		this._axisPuyoShape = new TsumoPuyoShape(tsumo.axisX, tsumo.axisY + diffY, tsumo.axisColor);
		this._childPuyoShape = new TsumoPuyoShape(tsumo.childX, tsumo.childY + diffY, tsumo.childColor);
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

	/**
	 * @param {Tsumo} tsumo
	 */
	public set(tsumo: Tsumo): void {
		// 現在のshapeをremove
		this._container.removeChild(this._axisPuyoShape, this._childPuyoShape);

		this.init(tsumo);
	}
}