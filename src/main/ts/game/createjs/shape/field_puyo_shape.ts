import { Tween } from "@createjs/tweenjs";
import { BasePuyoShape } from "../../../common/createjs/shape/base_puyo_shape";
import { FieldCellShape } from "./field_cell_shape";

/**
 * Fieldぷよ
 */
export class FieldPuyoShape extends BasePuyoShape {
	public static readonly DROP_VEL = 60;
	public static readonly ERASE_VEL = 500;

	private _posx: number;
	private _posy: number;

	private _connect: Connect | null;

	/**
	 * コンストラクタ
	 * @param x x座標
	 * @param y y座標
	 * @param color 色
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
	 * @return createjs.Tween
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
	 * @return createjs.Tween
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

	////////////////////////////////
	// setter / getter
	////////////////////////////////

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
	static readonly ERASE_SIZE = 4;

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