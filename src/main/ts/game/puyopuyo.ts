import { FieldCanvas } from "../canvas/field_canvas";
import { NextCanvas } from "../canvas/next_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
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
	 * @param {number} x x座標
	 * @param {number} y y座標
	 * @param {string} color 変更する色
	 */
	public changeFieldPuyo(x: number, y: number, color: string): void {
		this._field.changeFieldPuyo(x, y, color);
	}

	/**
	 * とこぷよ開始時の初期化処理を行います。
	 */
	public initTokopuyo(): void {
		this._field.reset();
		this._tsumos.reset();
	}

	/**
	 * ツモを1つ進めます。
	 * @returns {TimelineList}
	 */
	public advanceTsumo(): TimelineList {
		return this._tsumos.advance();
	}

	/**
	 * フィールドを表す文字列を取得します。
	 * @returns {string} フィールドを表す文字列
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
	 * フィールドを表す文字列から、フィールドを設定します。
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
	 */
	public backTsumo(): void {
		return this._tsumos.back();
	}
}