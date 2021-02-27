import { BasePuyoShape } from "../../../common/createjs/shape/base_puyo_shape";
import { FieldPuyoShape } from "./field_puyo_shape";
import { NextPuyoShape } from "./next_puyo_shape";
import { TsumoCellShape } from "./tsumo_cell_shape";

import { Container } from "@createjs/easeljs";
import { Tween } from "@createjs/tweenjs";
import { Tsumo } from "../canvas/tsumo";
import { Util } from "../../../util/util";

/**
 * Tsumoぷよ
 */
export class TsumoPuyoShape extends BasePuyoShape {
	public static readonly MOVE_VEL = 200;
	public static readonly ROTATE_VEL = 200;

	private _tsumo_x: number;
	private _tsumo_y: number;

	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 * @param color 色
	 */
	constructor(x: number, y: number, color: string) {
		super(color, TsumoCellShape.CELLSIZE);
		this.x = TsumoCellShape.CELLSIZE * x;
		this.y = TsumoCellShape.CELLSIZE * y - NextPuyoShape.MOVE_DIST;

		this._tsumo_x = x;
		this._tsumo_y = y;
	}

	/**
	 * 軸ぷよ・子ぷよのインスタンス生成、ツモに設定するアニメーションを同時に取得します。
	 * @param x 
	 * @param y 
	 * @param color 
	 */
	public static createInstancesAndGetSetTweens(aColor: string, cColor: string): { aInstance: TsumoPuyoShape, aTween: Tween, cInstance: TsumoPuyoShape, cTween: Tween } {
		const twnVal = Util.getAnimateMode();	// アニメーション実行なら1、ステップ実行なら0
		
		// axisPuyo 軸ぷよ
		const aInstance = new TsumoPuyoShape(Tsumo.INI_X, Tsumo.INI_Y_A, aColor);
		const aToX = aInstance.x;
		const aToY = aInstance.y + NextPuyoShape.MOVE_DIST;
		const aTween = Tween.get(aInstance)
			.to({x: aToX, y: aToY}, NextPuyoShape.MOVE_TIME * twnVal);
		
		// childPuyo 子ぷよ
		const cInstance = new TsumoPuyoShape(Tsumo.INI_X, Tsumo.INI_Y_C, cColor);
		const cToX = cInstance.x;
		const cToY = cInstance.y + NextPuyoShape.MOVE_DIST;
		const cTween = Tween.get(cInstance)
			.to({x: cToX, y: cToY}, NextPuyoShape.MOVE_TIME * twnVal);

		return { aInstance, aTween, cInstance, cTween };
	}

	/**
	 * ツモを移動するTweenを取得します。
	 * @param x 移動先のx座標
	 * @param preX 移動元のx座標
	 * @retrun createjs.Tween
	 */
	public getMoveTween(x: number, preX: number): Tween {
		const twnVal = Util.getAnimateMode();	// アニメーション実行なら1、ステップ実行なら0

		const m = Math.abs(x - preX)
		const tween = Tween.get(this)
			.to({x: preX * TsumoCellShape.CELLSIZE})
			.to({x: x * TsumoCellShape.CELLSIZE}, m * TsumoPuyoShape.MOVE_VEL * twnVal);
		return tween;
	}

	/**
	 * ツモを回転するX軸のTweenを取得します。
	 * @param x 移動先のX座標
	 * @param preX 移動元のX座標
	 * @param ease イージング関数
	 * @return createjs.Tween
	 */
	public getRotateXTween(x: number, preX: number, ease: Function): Tween {
		const twnVal = Util.getAnimateMode();	// アニメーション実行なら1、ステップ実行なら0

		const tween = Tween.get(this)
			.to({x: preX * TsumoCellShape.CELLSIZE})
			.to({x: x * TsumoCellShape.CELLSIZE}, TsumoPuyoShape.ROTATE_VEL * twnVal, ease);
		return tween;
	}

	/**
	 * ツモを回転するY軸のTweenを取得します。
	 * @param y 移動先のY座標
	 * @param preY 移動元のY座標
	 * @param ease イージング関数
	 * @return createjs.Tween
	 */
	public getRotateYTween(y: number, preY: number, ease: Function): Tween {
		const twnVal = Util.getAnimateMode();	// アニメーション実行なら1、ステップ実行なら0

		const tween = Tween.get(this)
			.to({y: preY * TsumoCellShape.CELLSIZE})
			.to({y: y * TsumoCellShape.CELLSIZE}, TsumoPuyoShape.ROTATE_VEL * twnVal, ease);
		return tween;
	}

	/**
	 * ツモを落下するTweenを取得します。
	 * また、指定のContainerからこのオブジェクトを削除します。
	 * @param container createjs.Container
	 * @return createjs.Tween
	 */
	public getDropTween(container: Container): Tween {
		const twnVal = Util.getAnimateMode();	// アニメーション実行なら1、ステップ実行なら0

		const y = this._tsumo_y;
		const y2 = y + 3;
		const tween = Tween.get(this)
			.to({y: TsumoCellShape.CELLSIZE * y})
			.to({y: TsumoCellShape.CELLSIZE * y2}, FieldPuyoShape.DROP_VEL * (y2 - y) * twnVal)
			.call(() => {
				container.removeChild(this);
			});
		return tween;
	}

	////////////////////////////////
	// setter / getter
	////////////////////////////////

	get tsumo_x(): number {
		return this._tsumo_x;
	}

	set tsumo_x(tsumo_x: number) {
		this._tsumo_x = tsumo_x;
	}

	get tsumo_y(): number {
		return this._tsumo_y;
	}

	set tsumo_y(tsumo_y: number) {
		this._tsumo_y = tsumo_y;
	}
}