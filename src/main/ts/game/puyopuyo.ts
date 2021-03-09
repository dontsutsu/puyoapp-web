import { FieldCanvas } from "../canvas/field_canvas";
import { NextCanvas } from "../canvas/next_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { Field } from "./field";
import { Tsumos } from "./tsumos";

export class Puyopuyo {
	// CLASS FIELD
	private _field: Field;
	private _tsumos: Tsumos;	// 0：current、1：next、2：doubleNext

	/**
	 * コンストラクタ
	 */
	constructor(fieldCanvas: FieldCanvas, tsumoCanvas: TsumoCanvas, nextCanvas: NextCanvas) {
		this._field = new Field(fieldCanvas);
		this._tsumos = new Tsumos(tsumoCanvas, nextCanvas);
	}

	/**
	 * フィールドのぷよを落とし、連鎖処理を実行します。
	 */
	public dropFieldPuyo(): TimelineList {
		return this._field.dropFieldPuyo();
	}

	/**
	 * ツモを動かします。
	 * @param vec 動かす距離と方向（ex　右に1：+1、左に2：-2）
	 */
	public moveTsumo(vec: number): TimelineList {
		return this._tsumos.moveCurrentTsumo(vec);
	}

	/**
	 * ツモを回転します。
	 * @param clockwise true：時計周り / false：反時計周り
	 */
	public rotateTsumo(clockwise: boolean): TimelineList {
		return this._tsumos.rotateCurrentTsumo(clockwise);
	}

	/**
	 * ツモをフィールドに落とします。
	 */
	public dropTsumoToField(): TimelineList {
		const {currentTsumo, dropTsumoTimelineList} = this._tsumos.getCurrentTsumo();
		const dropTsumoToFieldTimelineList = this._field.dropTsumoToField(currentTsumo);
		const dropFieldTimelineList = this._field.dropFieldPuyo();
		return dropTsumoTimelineList.add(dropTsumoToFieldTimelineList, dropFieldTimelineList);
	}

	/**
	 * フィールドの指定座標のぷよを変更します。
	 * @param x 
	 * @param y 
	 * @param color 
	 */
	public changeFieldPuyo(x: number, y: number, color: string): void {
		this._field.changeFieldPuyo(x, y, color);
	}

	/**
	 * 
	 */
	public initTokopuyo(): void {
		this._field.reset();
		this._tsumos.reset();
	}

	/**
	 * 
	 */
	public advanceTsumo(): TimelineList {
		return this._tsumos.advance();
	}
}