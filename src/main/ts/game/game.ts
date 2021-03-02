import { Ticker } from "@createjs/tweenjs";
import { Field } from "./createjs/canvas/field";
import { Tsumo } from "./createjs/canvas/tsumo";
import { Next } from "./createjs/canvas/next";
import { PuyoTimelineList } from "./createjs/timeline/puyo_timeline_list";
import { TsumoInterface } from "../interface/tsumo_Interface";

/**
 * Gameクラス
 */
export class Game {
	protected _field: Field;
	protected _tsumo: Tsumo;
	protected _next: Next;

	protected _isAnimation: boolean;

	/**
	 * コンストラクタ
	 * @param mode モード
	 */
	constructor() {
		this._field = new Field();
		this._tsumo = new Tsumo();
		this._next = new Next();

		this._isAnimation = false;

		// フレームレート
		Ticker.timingMode = Ticker.RAF;
	}

	/**
	 * ツモを右へ移動します。
	 */
	public right(): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.move(1, puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * ツモを左へ移動します。
	 */
	public left(): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.move(-1, puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * ツモを右回転します。
	 */
	public rotateRight(): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.rotateRight(puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * ツモを左回転します。
	 */
	public rotateLeft(): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.rotateLeft(puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * フィールドのぷよを落とします。
	 */
	public drop(): void {
		const puyoTlList = new PuyoTimelineList();
		this._field.drop(puyoTlList);
		puyoTlList.play(this);
	}

	/**
	 * 
	 * @param current 
	 * @param next 
	 * @param dNext 
	 */
	public initTokopuyo(current: string[], next: string[], dNext: string[]): void {
		const puyoTlList = new PuyoTimelineList();

		this._next.setInitialNext(current[0], current[1], next[0], next[1]);
		const tsumoColor = this._next.pushAndPop(dNext[0], dNext[1], puyoTlList);
		this._tsumo.setTsumo(tsumoColor.aColor, tsumoColor.cColor, puyoTlList);

		puyoTlList.play(this);
	}

	public backTsumo(current: string[]) {
		
	}

	/**
	 * ツモを落とします。
	 */
	public dropTsumoAndSetDoubleNext(dNext: string[]): void {
		const puyoTlList = new PuyoTimelineList();
		this._tsumo.drop(puyoTlList);
		this._field.dropTsumo(this._tsumo, puyoTlList);
		const tsumoColor = this._next.pushAndPop(dNext[0], dNext[1], puyoTlList);
		this._tsumo.setTsumo(tsumoColor.aColor, tsumoColor.cColor, puyoTlList);

		puyoTlList.play(this);
	}

	/**
	 * フィールド情報を文字列で取得します。
	 * @return フィールド文字列 [1段目1列目、1段目2列目、・・・、1段目6列目、2段目1列目、・・・、13段目6列目]
	 */
	public getFieldString(): string {
		return this._field.toString();
	}

	/**
	 * フィールドをクリアします。
	 */
	public clearField(): void {
		this._field.clear();
	}

	/**
	 * 現在のツモがフィールドに落とせる位置にあるかチェックします。
	 * @return true：落とせる / false：落とせない
	 */
	public dropCheck(): boolean {
		const heights = this._field.getHeights();

		const ax = this._tsumo.aPuyoShape.tsumo_x;
		const cx = this._tsumo.cPuyoShape.tsumo_x;

		for (let x = 0; x < heights.length; x++) {
			let h = heights[x];

			if (x == ax) {
				h++;
			}

			if (ax != cx && x == cx) {
				h++;
			}

			if (h > Field.Y_SIZE) {
				return false;
			}
		}

		return true;
	}

	/**
	 * なぞぷよの正答アニメーションを再生します。
	 * @param tsumoList
	 */
	public play(tsumoList: TsumoInterface[]): void {

		const puyoTlList = new PuyoTimelineList();

		const ac1 = tsumoList[0].ac;
		const cc1 = tsumoList[0].cc;

		const ac2 = (tsumoList.length >= 2) ? tsumoList[1].ac : "0";
		const cc2 = (tsumoList.length >= 2) ? tsumoList[1].cc : "0";

		this._next.setInitialNext(ac1, cc1, ac2, cc2)

		for (let i = 0; i < tsumoList.length; i++) {
			const tsumo = tsumoList[i];
			const dnac = (tsumoList.length > (i + 2)) ? tsumoList[i+2].ac : "0";
			const dncc = (tsumoList.length > (i + 2)) ? tsumoList[i+2].cc : "0";
			this._next.pushAndPop(dnac, dncc, puyoTlList);
			this._tsumo.setTsumo(tsumo.ac, tsumo.cc, puyoTlList);

			// 回転
			if (tsumo.ax > tsumo.cx) {
				// 親ぷよの方が右の場合、右回転
				this._tsumo.rotateLeft(puyoTlList);
			} else if (tsumo.cx > tsumo.ax) {
				// 子ぷよの方が右の場合、左回転
				this._tsumo.rotateRight(puyoTlList);
			}

			if (tsumo.cy < tsumo.ay) {
				// 子ぷよの方が下の場合、右回転右回転
				// ※Java側は下がindex小、上がindex大
				this._tsumo.rotateRight(puyoTlList);
				this._tsumo.rotateRight(puyoTlList);
			}

			// 移動
			const mv = Number(tsumo.ax) - Tsumo.INI_X;
			this._tsumo.move(mv, puyoTlList);

			// 落下
			this._tsumo.drop(puyoTlList);
			this._field.dropTsumo(this._tsumo, puyoTlList);
		}

		puyoTlList.play(this);
	}

	////////////////////////////////
	// getter / setter
	////////////////////////////////

	get field(): Field {
		return this._field;
	}

	get isAnimation(): boolean {
		return this._isAnimation;
	}

	set isAnimation(isAnimation: boolean) {
		this._isAnimation = isAnimation;
	}

}