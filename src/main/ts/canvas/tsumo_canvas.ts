import { Container } from "@createjs/easeljs";
import { Tween, Ease } from "@createjs/tweenjs";
import { EnumTsumoPosition } from "../game/enum_tsumo_position";
import { Field } from "../game/field";
import { Tsumo } from "../game/tsumo";
import { Util } from "../util/util";
import { BaseCanvas } from "./base_canvas";
import { TsumoCellShape } from "./shape/cell_shape/tsumo_cell_shape";
import { TsumoPuyoShape } from "./shape/puyo_shape/tsumo_puyo_shape";

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

	/**
	 * 
	 * @param tsumo 
	 */
	public init(tsumo: Tsumo): void {
		this._axisPuyoShape = new TsumoPuyoShape(tsumo.axisX, tsumo.axisY, tsumo.axisColor);
		this._childPuyoShape = new TsumoPuyoShape(tsumo.childX, tsumo.childY, tsumo.childColor);
		this._container.addChild(this._axisPuyoShape, this._childPuyoShape);
	}

	/**
	 * 
	 * @param diffX 
	 */
	public getMoveTween(diffX: number): Tween[] {
		const val = Util.getAnimateMode();

		// axis
		const fromAxisX = this._axisPuyoShape.x;
		const toAxisX = fromAxisX + TsumoCellShape.CELLSIZE * diffX;
		const axisTween = Tween.get(this._axisPuyoShape)
			.to({x: fromAxisX})
			.to({x: toAxisX}, Math.abs(diffX) * TsumoCanvas.MOVE_VEL * val);

		// child
		const fromChildX = this._childPuyoShape.x;
		const toChildX = fromChildX + TsumoCellShape.CELLSIZE * diffX;
		const childTween = Tween.get(this._childPuyoShape)
			.to({x: fromChildX})
			.to({x: toChildX}, Math.abs(diffX) * TsumoCanvas.MOVE_VEL * val);

		return [axisTween, childTween];
	}

	/**
	 * 
	 * @param clockwise 
	 * @param beforePosition 
	 * @param diffX 
	 */
	public getRotateTween(diffX: number, beforePosition: EnumTsumoPosition, afterPosition: EnumTsumoPosition): Tween[] {
		const val = Util.getAnimateMode();
		
		// axis
		const fromAxisX = this._axisPuyoShape.x;
		const toAxisX = fromAxisX + TsumoCellShape.CELLSIZE * diffX;
		const axisTween = Tween.get(this._axisPuyoShape)
			.to({x: fromAxisX})
			.to({x: toAxisX}, TsumoCanvas.ROTATE_VEL * val);
		
		// child(X)
		const fromChildX = this._childPuyoShape.x;
		const toChildX = fromChildX + TsumoCellShape.CELLSIZE * (afterPosition.childRelativeX - beforePosition.childRelativeX + diffX);
		const easeX = (beforePosition == EnumTsumoPosition.TOP || beforePosition == EnumTsumoPosition.BOTTOM) ? Ease.sineOut : Ease.sineIn;
		const childXTween = Tween.get(this._childPuyoShape)
			.to({x: fromChildX})
			.to({x: toChildX}, TsumoCanvas.ROTATE_VEL * val, easeX);

		//child(Y)
		const fromChildY = this._childPuyoShape.y;
		const toChildY = fromChildY + TsumoCellShape.CELLSIZE * (afterPosition.childRelativeY - beforePosition.childRelativeY) * (-1);	// ロジック上のy方向とcanvas上のy方向が異なるため
		const easeY = (beforePosition == EnumTsumoPosition.TOP || beforePosition == EnumTsumoPosition.BOTTOM) ? Ease.sineIn : Ease.sineOut;
		const childYTween = Tween.get(this._childPuyoShape)
			.to({y: fromChildY})
			.to({y: toChildY}, TsumoCanvas.ROTATE_VEL * val, easeY);
		
		return [axisTween, childXTween, childYTween];
	}

	/**
	 * ロジック上のy方向とcanvas上のy方向が異なるため、yの値を変換します。
	 * @param y 
	 */
	public static convertY(y: number): number {
		return TsumoCanvas.Y_SIZE - 1 - y;
	}

	/**
	 * 
	 */
	public getDropTween(): Tween[] {
		const val = Util.getAnimateMode();
		const diffY = 3;

		// axis
		const fromAxisY = this._axisPuyoShape.y;
		const toAxisY = fromAxisY + TsumoCellShape.CELLSIZE * diffY;
		const axisTween = Tween.get(this._axisPuyoShape)
			.to({y: fromAxisY})
			.to({y: toAxisY}, Math.abs(diffY) * TsumoCanvas.DROP_VEL * val);

		// child
		const fromChildY = this._childPuyoShape.y;
		const toChildY = fromChildY + TsumoCellShape.CELLSIZE * diffY;
		const childTween = Tween.get(this._childPuyoShape)
			.to({y: fromChildY})
			.to({y: toChildY}, Math.abs(diffY) * TsumoCanvas.DROP_VEL * val);
		
		return [axisTween, childTween];
	}

	/**
	 * 
	 * @param tsumo 
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
}