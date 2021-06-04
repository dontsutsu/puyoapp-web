import { FieldCanvas } from "../canvas/field_canvas";
import { NextCanvas } from "../canvas/next_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { Coordinate } from "../util/coordinate";
import { Field } from "./field";
import { Tsumo } from "./tsumo";
import { Tsumos } from "./tsumos";

export class Puyopuyo {
	// CLASS FIELD
	private _field: Field;
	private _tsumos: Tsumos;	// 0：current、1：next、2：doubleNext

	/**
	 * コンストラクタ
	 * @param {FieldCanvas} fieldCanvas 
	 * @param {TsumoCanvas} tsumoCanvas 
	 * @param {NextCanvas} nextCanvas 
	 */
	constructor(fieldCanvas: FieldCanvas, tsumoCanvas: TsumoCanvas, nextCanvas: NextCanvas) {
		this._field = new Field(fieldCanvas);
		this._tsumos = new Tsumos(tsumoCanvas, nextCanvas);
	}

	/**
	 * フィールドのぷよを落とし、連鎖処理を実行します。
	 * @returns {TimelineList}
	 */
	public dropFieldPuyo(): TimelineList {
		return this._field.dropFieldPuyo();
	}

	/**
	 * ツモを動かします。
	 * @param {number} vec 動かす距離と方向（ex　右に1：+1、左に2：-2）
	 * @returns {TimelineList}
	 */
	public moveTsumo(vec: number): TimelineList {
		return this._tsumos.moveCurrentTsumo(vec);
	}

	/**
	 * ツモを回転します。
	 * @param {boolean} clockwise true：時計周り / false：反時計周り
	 * @returns {TimelineList}
	 */
	public rotateTsumo(clockwise: boolean): TimelineList {
		return this._tsumos.rotateCurrentTsumo(clockwise);
	}

	/**
	 * ツモをフィールドに落とします。
	 * @returns {TimelineList}
	 */
	public dropTsumoToField(): TimelineList {
		const {currentTsumo, dropTsumoTimelineList} = this._tsumos.getCurrentTsumo();
		const dropTsumoToFieldTimelineList = this._field.dropTsumoToField(currentTsumo);
		const dropFieldTimelineList = this._field.dropFieldPuyo();
		return dropTsumoTimelineList.add(dropTsumoToFieldTimelineList, dropFieldTimelineList);
	}

	/**
	 * フィールドの指定座標のぷよを変更します。
	 * @param {Coordinate} coord 座標
	 * @param {string} color 変更する色
	 */
	public changeFieldPuyo(coord: Coordinate, color: string): void {
		this._field.changeFieldPuyo(coord, color);
	}

	/**
	 * とこぷよ開始時の初期化処理を行います。
	 */
	public initTokopuyo(tsumoList?: Tsumo[]): void {
		// フィールドを初期化
		this._field.reset();

		// ツモ初期化
		if (tsumoList == undefined) {
			this._tsumos.reset();	// 引数で指定がなければランダムに設定
		} else {
			this._tsumos.set(tsumoList);	// 引数で指定があればそれを設定
		}

		// ガイド表示
		this._field.setGuide(this._tsumos.current);
	}

	/**
	 * ツモを1つ進めます。
	 * @returns {TimelineList}
	 */
	public advanceTsumo(): TimelineList {
		return this._tsumos.advance();
	}

	/**
	 * フィールドの文字列を取得します。
	 * @returns {string} フィールド文字列
	 */
	public getFieldString(): string {
		return this._field.toString();
	}

	/**
	 * ツモのリストをセットします。
	 * @param {Tsumo[]} tsumoList 
	 */
	public setTsumoList(tsumoList: Tsumo[]): void {
		this._tsumos.set(tsumoList);
	}

	/**
	 * フィールド文字列から、フィールドを設定します。
	 * @param {string} fieldStr フィールドを表す文字列
	 */
	public setField(fieldStr: string): void {
		this._field.setField(fieldStr);
	}

	/**
	 * 現在のツモをフィールドに落とせるかどうか判定します。
	 * @returns {boolean} true：落とせる / false：落とせない
	 */
	public isDroppableTsumo(): boolean {
		const fieldHeights = this._field.getHeights();
		
		const axisX = this._tsumos.current.axisX;
		const childX = this._tsumos.current.childX;
		return fieldHeights[axisX] < Field.Y_SIZE && fieldHeights[childX] < Field.Y_SIZE;
	}

	/**
	 * 死んでいるかどうかを判定します。
	 * @returns {boolean} true：死んでいる / false：死んでいない
	 */
	public isDead(): boolean {
		return this._field.isDead();
	}

	/**
	 * ツモを1つ戻します。
	 * @param {boolean} isMemorized 戻したツモの位置を記憶しておくかどうか
	 */
	public backTsumo(isMemorized: boolean): void {
		return this._tsumos.back(isMemorized);
	}

	/**
	 * スコアを取得します。
	 * @returns {number} スコア
	 */
	public getScore(): number {
		return this._field.getScore();
	}

	/**
	 * スコアを設定します。
	 * @param {number} score スコア
	 */
	public setScore(score: number): void {
		this._field.setScore(score);
	}

	/**
	 * 
	 */
	public hideGuide(): void {
		this._field.hideGuide();
	}

	/**
	 * 
	 */
	public setGuide(): void {
		this._field.setGuide(this._tsumos.current);
	}

	/**
	 * フィールドをクリアします。
	 */
	public clearField(): void {
		this._field.reset();
	}
}