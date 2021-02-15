import { BasePuyoShape } from "./base_puyo_shape";
import { FieldCellShape, TsumoListCellShape, BoxCellShape, TsumoCellShape, NextCellShape } from "./cell_shape";

import { Container } from "@createjs/easeljs";
import { Tween, Ease } from "@createjs/tweenjs";

/**
 * Boxぷよ
 */
export class BoxPuyoShape extends BasePuyoShape {

	private _posx: number;
	private _posy: number;

	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 * @param color
	 */
	constructor(x: number, y: number, color: string) {
		super(color, BoxCellShape.CELLSIZE);
		this.x = BoxCellShape.CELLSIZE * x;
		this.y = BoxCellShape.CELLSIZE * y;
		this._posx = x;
		this._posy = y;
	}
}

/**
 * Fieldぷよ
 */
export class FieldPuyoShape extends BasePuyoShape {

	static readonly DROP_VEL = 60;
	static readonly ERASE_VEL = 500;

	private _posx: number;
	private _posy: number;

	private _connect: Connect | null;

	/**
	 * コンストラクタ
	 * @param x
	 * @param y
	 * @param color
	 */
	constructor(x: number, y: number, color: string) {
		super(color, FieldCellShape.CELLSIZE);
		this.x = FieldCellShape.CELLSIZE * x;
		this.y = FieldCellShape.CELLSIZE * y;
		this._posx = x;
		this._posy = y;
		this._connect = null;
	}

	/**
	 * ぷよを落下させたときのTweenを取得します。
	 * @param nextY 落下後のy座標
	 * @param preY 落下前のy座標
	 * @return Tween
	 */
	public getDropTween(nextY: number, preY: number): Tween {
		const tween = Tween.get(this)
			.to({y: FieldCellShape.CELLSIZE * preY})
			.to({y: FieldCellShape.CELLSIZE * nextY}, FieldPuyoShape.DROP_VEL * (nextY - preY))
			.wait(100);
		return tween;
	}

	/**
	 * ぷよを消去したときのTweenを取得します。
	 * @return Tween
	 */
	public getEraseTween(): Tween {
		const tween = Tween.get(this)
			.to({alpha: 0}, FieldPuyoShape.ERASE_VEL)
			.wait(100)
			.call(() => {
				this.changeColor("0");
			});
		this.color = "0";
		return tween;
	}

	get connect(): Connect | null {
		return this._connect;
	}

	set connect(connect: Connect | null) {
		this._connect = connect;
	}

	get posx(): number {
		return this._posx;
	}

	get posy(): number {
		return this._posy;
	}
}

/**
 * Connectクラス
 * ぷよの連結数を管理
 */
export class Connect {
	// クラス定数
	static readonly ERASE_SIZE = 4;

	// クラス変数
	private _size: number;

	/**
	 * コンストラクタ
	 */
	constructor() {
		this._size = 1;
	}

	/**
	 * 連結数を増加します。
	 */
	public increment(): void {
		this._size += 1;
	}

	/**
	 * 消去可能な連結数であるかを返します。
	 * @return true：消去可能 / false：消去不可
	 */
	public isErasable(): boolean {
		return this._size >= Connect.ERASE_SIZE;
	}
}

/**
 * Tsumoぷよ
 */
export class TsumoPuyoShape extends BasePuyoShape {

	static readonly MOVE_VEL = 200;
	static readonly ROTATE_VEL = 200;

	private _tsumo_x: number;
	private _tsumo_y: number;

	private _posx: number;
	private _posy: number;

	/**
	 * @param x
	 * @param y
	 * @param color
	 */
	constructor(x: number, y: number, color: string) {
		super(color, TsumoCellShape.CELLSIZE);
		this.x = TsumoCellShape.CELLSIZE * x;
		this.y = TsumoCellShape.CELLSIZE * y;
		this._posx = x;
		this._posy = y;

		this._tsumo_x = x;
		this._tsumo_y = y;
	}

	/**
	 * ツモにぷよをセットするTweenを取得します。
	 * @return Tween
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
	 * @retrun Tween
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
	 * @param container Container
	 * @return Tween
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

/**
 * TsumoListぷよ
 */
export class TsumoListPuyoShape extends BasePuyoShape {

	private _posx: number;
	private _posy: number;

	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 * @param color 色
	 * @param type 0: 子ぷよ、1: 親ぷよ
	 */
	constructor(x: number, y: number, color: string, type: number) {
		super(color, TsumoListCellShape.CELLSIZE);
		this._posx = x;
		this._posy = y;

		let xy = TsumoListCellShape.getXandY(x, y, type);

		this.x = xy.x;
		this.y = xy.y;
	}

}

/**
 * Nextぷよ
 */
export class NextPuyoShape extends BasePuyoShape {
	static readonly MOVE_TIME = 400;
	static readonly MOVE_DIST = 120;

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
	 * @param container 
	 * @return Tween
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
	 * @return Tween
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
	 * @param container Container
	 * @return Tween
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
