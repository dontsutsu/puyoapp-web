import { PuyoTimelineList } from "../timeline/puyo_timeline_list";

import { Stage, Container, Ticker } from "@createjs/easeljs";
import { Ease, Timeline } from "@createjs/tweenjs";
import { TsumoPuyoShape } from "../shape/tsumo_puyo_shape";
import { TsumoCellShape } from "../shape/tsumo_cell_shape";


/**
 * Tsumoクラス
 */
export class Tsumo {
	// クラス定数
	public static readonly X_SIZE = 6;
	public static readonly Y_SIZE = 3;
	public static readonly INI_X = 2;
	public static readonly INI_Y_A = 1;
	public static readonly INI_Y_C = 0;

	private static readonly CANVAS_ID = "tsumo";

	// インスタンス変数
	private _stage: Stage;
	private _container: Container;
	// 以下インスタンス変数はコンストラクタ外で初期化
	private _aPuyoShape!: TsumoPuyoShape;
	private _cPuyoShape!: TsumoPuyoShape;
	private _cPos!: TsumoPosition;

	/**
	 * コンストラクタ
	 */
	constructor() {
		this._container = new Container();

		// stage
		this._stage = new Stage(Tsumo.CANVAS_ID);
		Ticker.addEventListener("tick", this._stage);

		// CellShape
		for (let x = 0; x < Tsumo.X_SIZE; x++) {
			for (let y = 0; y < Tsumo.Y_SIZE; y++) {
				let cellShape = new TsumoCellShape(x, y);
				this._container.addChild(cellShape);
			}
		}

		// PuyoShapeの初期化はconstructor外の責任で行う

		this._container.x = 20;
		this._stage.addChild(this._container);
	}

	/**
	 * ツモを新しくセットします。
	 * @param aColor 軸ぷよの色
	 * @param cColor 子ぷよの色
	 * @param puyoTlList PuyoTimeLineのリスト
	 */
	public setTsumo(aColor: string, cColor: string, puyoTlList: PuyoTimelineList): void {
		const timeline = new Timeline({paused:true});

		const tsumoInsTwn = TsumoPuyoShape.createInstancesAndGetSetTweens(aColor, cColor);

		this._aPuyoShape = tsumoInsTwn.aInstance;
		this._cPuyoShape = tsumoInsTwn.cInstance;
		this._cPos = TsumoPosition.UP;

		this._container.addChild(this._aPuyoShape, this._cPuyoShape);

		timeline.addTween(tsumoInsTwn.aTween);
		timeline.addTween(tsumoInsTwn.cTween);

		puyoTlList.push(timeline);
	}

	/**
	 * 引数のx座標が1～6列目の範囲内であるかどうかを取得します。
	 * @param x x座標
	 * @return true：範囲内 / false：範囲外
	 */
	private inRange(x: number): boolean {
		return (x >= 0 && x < Tsumo.X_SIZE);
	}

	/**
	 * ツモを指定方向に移動します。
	 * @param m 移動方向 -1:左、+1:右
	 * @param puyoTlList
	 */
	public move(m: number, puyoTlList: PuyoTimelineList): void {
		const preAx = this._aPuyoShape.tsumo_x;
		const preCx = this._cPuyoShape.tsumo_x;
		const ax = this._aPuyoShape.tsumo_x + m;
		const cx = this._cPuyoShape.tsumo_x + m;

		// 移動後が範囲外の場合は何もしない
		if (!this.inRange(ax) || !this.inRange(cx)) {
			return;
		}

		this._aPuyoShape.tsumo_x = ax;
		this._cPuyoShape.tsumo_x = cx;

		const timeline = new Timeline({paused:true});
		const ptween = this._aPuyoShape.getMoveTween(ax, preAx);
		const ctween = this._cPuyoShape.getMoveTween(cx, preCx);
		timeline.addTween(ptween);
		timeline.addTween(ctween);

		puyoTlList.push(timeline);
	}

	/**
	 * ツモを左回転します。
	 * @param puyoTlList
	 */
	public rotateLeft(puyoTlList: PuyoTimelineList): void {
		const cx = this._cPuyoShape.tsumo_x;
		const cy = this._cPuyoShape.tsumo_y;
		const ax = this._aPuyoShape.tsumo_x;
		const pos = this._cPos;

		let next_pos;
		let next_cx;
		let next_cy;
		let next_ax = this._aPuyoShape.tsumo_x;
		let ease_x;
		let ease_y;

		if (pos == TsumoPosition.UP) {
			if (cx != 0) {
				next_cx = cx - 1;
				next_cy = 1;
			} else {
				next_cx = 0;
				next_cy = 1;
				next_ax = 1;
			}

			next_pos = TsumoPosition.LEFT;

			ease_x = Ease.sineOut;
			ease_y = Ease.sineIn;
		} else if (pos == TsumoPosition.LEFT) {
			next_cx = cx + 1;
			next_cy = 2;

			next_pos = TsumoPosition.DOWN;

			ease_x = Ease.sineIn;
			ease_y = Ease.sineOut;
		} else if (pos == TsumoPosition.DOWN) {
			if (cx != Tsumo.X_SIZE - 1) {
				next_cx = cx + 1;
				next_cy = 1;
			} else {
				next_cx = Tsumo.X_SIZE - 1;
				next_cy = 1;
				next_ax = Tsumo.X_SIZE - 2;
			}

			next_pos = TsumoPosition.RIGHT;

			ease_x = Ease.sineOut;
			ease_y = Ease.sineIn;
		} else {
			next_cx = cx - 1;
			next_cy = 0;

			next_pos = TsumoPosition.UP;

			ease_x = Ease.sineIn;
			ease_y = Ease.sineOut;
		}

		this._cPos = next_pos;

		this._cPuyoShape.tsumo_x = next_cx;
		this._cPuyoShape.tsumo_y = next_cy;

		this._aPuyoShape.tsumo_x = next_ax;

		// animation
		const timeline = new Timeline({paused:true});
		const tween_cx = this._cPuyoShape.getRotateXTween(next_cx, cx, ease_x);
		const tween_cy = this._cPuyoShape.getRotateYTween(next_cy, cy, ease_y);
		const tween_ax = this._aPuyoShape.getRotateXTween(next_ax, ax, ease_x);
		timeline.addTween(tween_cx);
		timeline.addTween(tween_cy);
		timeline.addTween(tween_ax);

		puyoTlList.push(timeline);
	}

	/**
	 * ツモを右回転します。
	 * @param puyoTlList
	 */
	public rotateRight(puyoTlList: PuyoTimelineList): void {
		const cx = this._cPuyoShape.tsumo_x;
		const cy = this._cPuyoShape.tsumo_y;
		const ax = this._aPuyoShape.tsumo_x;
		const pos = this._cPos;

		let next_pos;
		let next_cx;
		let next_cy;
		let next_ax = this._aPuyoShape.tsumo_x;
		let ease_x;
		let ease_y;

		if (pos == TsumoPosition.UP) {
			if (cx != Tsumo.X_SIZE - 1) {
				next_cx = cx + 1;
				next_cy = 1;
			} else {
				next_cx = Tsumo.X_SIZE - 1;
				next_cy = 1;
				next_ax = Tsumo.X_SIZE - 2;
			}

			next_pos = TsumoPosition.RIGHT;

			ease_x = Ease.sineOut;
			ease_y = Ease.sineIn;
		} else if (pos == TsumoPosition.RIGHT) {
			next_cx = cx - 1;
			next_cy = 2;

			next_pos = TsumoPosition.DOWN;

			ease_x = Ease.sineIn;
			ease_y = Ease.sineOut;
		} else if (pos == TsumoPosition.DOWN) {
			if (cx != 0) {
				next_cx = cx - 1;
				next_cy = 1;
			} else {
				next_cx = 0;
				next_cy = 1;
				next_ax = 1;
			}

			next_pos = TsumoPosition.LEFT;

			ease_x = Ease.sineOut;
			ease_y = Ease.sineIn;
		} else {
			next_cx = cx + 1;
			next_cy = 0;

			next_pos = TsumoPosition.UP;

			ease_x = Ease.sineIn;
			ease_y = Ease.sineOut;
		}

		this._cPos = next_pos;

		this._cPuyoShape.tsumo_x = next_cx;
		this._cPuyoShape.tsumo_y = next_cy;

		this._aPuyoShape.tsumo_x = next_ax;

		// animation
		const timeline = new Timeline({paused:true});
		const tween_cx = this._cPuyoShape.getRotateXTween(next_cx, cx, ease_x);
		const tween_cy = this._cPuyoShape.getRotateYTween(next_cy, cy, ease_y);
		const tween_ax = this._aPuyoShape.getRotateXTween(next_ax, ax, ease_x);
		timeline.addTween(tween_cx);
		timeline.addTween(tween_cy);
		timeline.addTween(tween_ax);

		puyoTlList.push(timeline);
	}

	/**
	 * ツモを落とします。
	 * @param puyoTlList
	 */
	public drop(puyoTlList: PuyoTimelineList): void {
		const timeline = new Timeline({paused:true});
		const pTween = this._aPuyoShape.getDropTween(this._container);
		const cTween = this._cPuyoShape.getDropTween(this._container);
		timeline.addTween(pTween);
		timeline.addTween(cTween);

		puyoTlList.push(timeline);
	}

	////////////////////////////////
	// setter / getter
	////////////////////////////////

	get aPuyoShape(): TsumoPuyoShape {
		return this._aPuyoShape;
	}

	get cPuyoShape(): TsumoPuyoShape {
		return this._cPuyoShape;
	}
}

////////////////////////////////
// ENUM
////////////////////////////////

const TsumoPosition = {
	UP: "u",
	DOWN: "d",
	LEFT: "l",
	RIGHT: "r"
} as const;
type TsumoPosition = typeof TsumoPosition[keyof typeof TsumoPosition];

export { TsumoPosition };