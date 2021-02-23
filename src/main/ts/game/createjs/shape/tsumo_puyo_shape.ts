import { BasePuyoShape } from "../../../common/createjs/shape/base_puyo_shape";
import { FieldPuyoShape } from "./field_puyo_shape";
import { NextPuyoShape } from "./next_puyo_shape";
import { TsumoCellShape } from "./tsumo_cell_shape";

import { Container } from "@createjs/easeljs";
import { Tween } from "@createjs/tweenjs";

/**
 * Tsumoぷよ
 */
export class TsumoPuyoShape extends BasePuyoShape {
	public static readonly MOVE_VEL = 200;
	public static readonly ROTATE_VEL = 200;

	private _tsumo_x: number;
	private _tsumo_y: number;

	/**
	 * @param x x座標
	 * @param y y座標
	 * @param color 色
	 */
	constructor(x: number, y: number, color: string) {
		super(color, TsumoCellShape.CELLSIZE);
		this.x = TsumoCellShape.CELLSIZE * x;
		this.y = TsumoCellShape.CELLSIZE * y;

		this._tsumo_x = x;
		this._tsumo_y = y;
	}

	/**
	 * ツモにぷよをセットするTweenを取得します。
	 * @return createjs.Tween
	 */
	public getSetTween(): Tween {
		const x = this.x;
		const y = this.y;
		const y0 = this.y - NextPuyoShape.MOVE_DIST;

		const tween = Tween.get(this)
			.call(() => {
				this.visible = true;
			})
			.to({x: x, y: y0})
			.to({x: x, y: y}, NextPuyoShape.MOVE_TIME);
		return tween;
	}

	/**
	 * ツモを移動するTweenを取得します。
	 * @param x 移動先のx座標
	 * @param preX 移動元のx座標
	 * @retrun createjs.Tween
	 */
	public getMoveTween(x: number, preX: number): Tween {
		const m = Math.abs(x - preX)
		const tween = Tween.get(this)
			.to({x: preX * TsumoCellShape.CELLSIZE})
			.to({x: x * TsumoCellShape.CELLSIZE}, m * TsumoPuyoShape.MOVE_VEL);
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
		const tween = Tween.get(this)
			.to({x: preX * TsumoCellShape.CELLSIZE})
			.to({x: x * TsumoCellShape.CELLSIZE}, TsumoPuyoShape.ROTATE_VEL, ease);
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
		const tween = Tween.get(this)
			.to({y: preY * TsumoCellShape.CELLSIZE})
			.to({y: y * TsumoCellShape.CELLSIZE}, TsumoPuyoShape.ROTATE_VEL, ease);
		return tween;
	}

	/**
	 * ツモを落下するTweenを取得します。
	 * また、指定のContainerからこのオブジェクトを削除します。
	 * @param container createjs.Container
	 * @return createjs.Tween
	 */
	public getDropTween(container: Container): Tween {
		const y = this._tsumo_y;
		const y2 = y + 3;
		const tween = Tween.get(this)
			.to({y: TsumoCellShape.CELLSIZE * y})
			.to({y: TsumoCellShape.CELLSIZE * y2}, FieldPuyoShape.DROP_VEL * (y2 - y))
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