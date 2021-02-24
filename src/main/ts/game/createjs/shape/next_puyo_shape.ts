import { Container } from "@createjs/easeljs";
import { Tween } from "@createjs/tweenjs";
import { BasePuyoShape } from "../../../common/createjs/shape/base_puyo_shape";
import { NextCellShape } from "./next_cell_shape";

/**
 * Nextぷよ
 */
export class NextPuyoShape extends BasePuyoShape {
	public static readonly MOVE_TIME = 400;
	public static readonly MOVE_DIST = 120;

	private _next: number;
	private _type: number;

	/**
	 * コンストラクタ
	 * @param color 色
	 * @param next 0：ネクスト、1：ダブルネクスト
	 * @param type 0：子ぷよ、1：軸ぷよ
	 */
	constructor(color: string, next: number, type: number) {
		super(color, NextCellShape.CELLSIZE);
		let xy = NextCellShape.getXandY(next, type);
		this.x = xy.x;
		this.y = xy.y;

		this._next = next;
		this._type = type;
	}

	/**
	 * 欄外からダブネクへツモを移動するTweenを取得します。
	 * また、指定のContainerへこのオブジェクトを追加します。
	 * @param container createjs.Container
	 * @return createjs.Tween
	 */
	public getMoveToDoubleNextTween(container: Container): Tween {
		const xy = NextCellShape.getXandY(1, this._type);
		const y0 = xy.y + NextPuyoShape.MOVE_DIST;

		const tween = Tween.get(this)
			.call(() => {
				container.addChild(this);
			})
			.to({x: xy.x, y: y0})
			.to({x: xy.x, y: xy.y}, NextPuyoShape.MOVE_TIME);
		return tween;
	}

	/**
	 * ダブネクからネクストへツモを移動するTweenを取得します。
	 * @return createjs.Tween
	 */
	public getMoveFromDNextToNextTween(): Tween {
		const xy1 = NextCellShape.getXandY(1, this._type);
		const xy2 = NextCellShape.getXandY(0, this._type);

		const tween = Tween.get(this)
			.to({x: xy1.x, y: xy1.y})
			.to({x: xy2.x, y: xy2.y}, NextPuyoShape.MOVE_TIME);
		return tween;
	}

	/**
	 * ネクストから欄外へツモを移動するTweenを取得します。
	 * また、指定のContainerからこのオブジェクトを削除します。
	 * @param container createjs.Container
	 * @return createjs.Tween
	 */
	public getMoveFromNextToTsumoTween(container: Container): Tween {
		const xy = NextCellShape.getXandY(0, this._type);
		const y2 = xy.y - NextPuyoShape.MOVE_DIST;

		const tween = Tween.get(this)
			.to({x: xy.x, y: xy.y})
			.to({y: y2}, NextPuyoShape.MOVE_TIME)
			.call(() => {
				container.removeChild(this);
			});
		return tween;
	}
}