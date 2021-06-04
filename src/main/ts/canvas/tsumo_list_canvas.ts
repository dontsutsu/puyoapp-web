import { Text } from "@createjs/easeljs";
import { BasePuyo } from "../game/puyo/base_puyo";
import { Nazotoki } from "../mode/nazotoki";
import { BaseCanvas } from "./base_canvas";
import { TsumoListCellShape } from "./shape/cell_shape/tsumo_list_cell_shape";
import { TsumoListPuyoShape } from "./shape/puyo_shape/tsumo_list_puyo_shape";
import $ from "jquery";
import { Coordinate } from "../util/coordinate";

export class TsumoListCanvas extends BaseCanvas {
	// CONSTANT
	public static readonly X_SIZE = 5;
	public static readonly Y_SIZE = 2;
	public static readonly I_SIZE = TsumoListCanvas.X_SIZE * TsumoListCanvas.Y_SIZE;
	private static readonly CANVAS_ID = "tsumoList";
	private static readonly CELL_PADDING_X = 10;
	private static readonly CELL_ADJUST_Y = -10;
	private static readonly TYPE_CHILD = 0;
	private static readonly TYPE_AXIS = 1;
	private static readonly TYPES = [TsumoListCanvas.TYPE_CHILD, TsumoListCanvas.TYPE_AXIS];

	// CLASS FIELD
	private _cellShapeArray: TsumoListCellShape[][];
	private _puyoShapeArray: TsumoListPuyoShape[][];
	private _colorArray: string[][];
	private _isEditable: boolean;

	/**
	 * コンストラクタ
	 */
	constructor() {
		super(TsumoListCanvas.CANVAS_ID, false);
		this._stage.enableMouseOver();
		this._isEditable = true;

		const endCoord = TsumoListCanvas.getCanvasCoordinate(new Coordinate(TsumoListCanvas.X_SIZE - 1, TsumoListCanvas.Y_SIZE - 1), 1);
		const w = endCoord.x + TsumoListCellShape.CELLSIZE;
		const h = endCoord.y + TsumoListCellShape.CELLSIZE;
		$("#" + TsumoListCanvas.CANVAS_ID).attr("width", 1 + Math.ceil(w));
		$("#" + TsumoListCanvas.CANVAS_ID).attr("height", 1 + Math.ceil(h));

		// number
		for (let y = 0; y < TsumoListCanvas.Y_SIZE; y++) {
			for (let x = 0; x < TsumoListCanvas.X_SIZE; x++) {
				const coord = new Coordinate(x, y);
				const num = TsumoListCanvas.getIndex(coord) + 1;
				const numShape = new Text(String(num), "bold 12px BIZ UDPGothic", "#888888");
				const canvasCoord = TsumoListCanvas.getCanvasCoordinate(coord, TsumoListCanvas.TYPE_CHILD);
				numShape.x = canvasCoord.x + (TsumoListCellShape.CELLSIZE / 2);
				numShape.y = canvasCoord.y - (TsumoListCellShape.CELLSIZE / 2);
				numShape.textAlign = "center";
				this._stage.addChild(numShape);
			}
		}

		// cellshape
		this._cellShapeArray = [];
		for (let y = 0; y < TsumoListCanvas.Y_SIZE; y++) {
			for (let x = 0; x < TsumoListCanvas.X_SIZE; x++) {
				const indexArray: TsumoListCellShape[] = [];
				for (const t of TsumoListCanvas.TYPES) {
					const cellShape = new TsumoListCellShape(new Coordinate(x, y), t);
					this._stage.addChild(cellShape);
					indexArray.push(cellShape);
				}
				this._cellShapeArray.push(indexArray);
			}
		}

		// puyoshape
		this._puyoShapeArray = [];
		for (let y = 0; y < TsumoListCanvas.Y_SIZE; y++) {
			for (let x = 0; x < TsumoListCanvas.X_SIZE; x++) {
				const indexArray: TsumoListPuyoShape[] = [];
				for (const t of TsumoListCanvas.TYPES) {
					const puyoShape = new TsumoListPuyoShape(new Coordinate(x, y), t);
					this._stage.addChild(puyoShape);
					indexArray.push(puyoShape);
				}
				this._puyoShapeArray.push(indexArray);
			}
		}

		// colorArray
		this._colorArray = [];
		for (let y = 0; y < TsumoListCanvas.Y_SIZE; y++) {
			for (let x = 0; x < TsumoListCanvas.X_SIZE; x++) {
				const indexArray: string[] = [];
				for (const t of TsumoListCanvas.TYPES) {
					indexArray.push(BasePuyo.NONE);
				}
				this._colorArray.push(indexArray);
			}
		}

		this._stage.update();
	}

	/**
	 * マウスイベントを設定します。
	 * @param {Nazotoki} nazotoki 
	 */
	public setMouseEvent(nazotoki: Nazotoki): void {
		for (const indexArray of this._cellShapeArray) {
			for (const cellShape of indexArray) {
				cellShape.addEventListener("mousedown", () => {
					if (!this._isEditable) return;
					const index = cellShape.index;
					const type = cellShape.type;
					nazotoki.changeTsumoListPuyo(index, type);
					this._stage.update();
				});

				cellShape.addEventListener("mouseover", () => {
					if (!this._isEditable) return;
					cellShape.mouseover();
					this._stage.update();
				});

				cellShape.addEventListener("mouseout", () => {
					cellShape.mouseout();
					this._stage.update();
				});
			}
		}
	}

	/**
	 * index、typeで指定したツモリストのぷよを変更します。
	 * @param {number} index 番号
	 * @param {number} type "0"：子ぷよ、"1"：軸ぷよ
	 * @param {string} color 色
	 */
	public changeColor(index: number, type: number, color: string): void {
		this._colorArray[index][type] = color;
		this._puyoShapeArray[index][type].setGraphics(color);
	}

	/**
	 * ツモリストを表す文字列を取得します。
	 * @returns {string} ツモリスト（文字列）
	 */
	public getTsumoListString(): string {
		let str = "";
		for (let i = 0; i < this._colorArray.length; i++) {
			// 軸ぷよが先、子ぷよが後
			str += this._colorArray[i][TsumoListCanvas.TYPE_AXIS] + this._colorArray[i][TsumoListCanvas.TYPE_CHILD];
		}
		return str;
	}

	/**
	 * 入力されているツモリストが問題ないかチェックします。
	 * @returns {boolean} true：OK / false：NG
	 */
	public check(): boolean {
		let noneFlg = false;

		for (let i = 0; i < this._colorArray.length; i++) {
			const axisColor = this._colorArray[i][TsumoListCanvas.TYPE_AXIS];
			const childColor = this._colorArray[i][TsumoListCanvas.TYPE_CHILD];

			// 1. 1ツモ目がnone, noneの場合はエラー
			if (i == 0 && axisColor == BasePuyo.NONE && childColor == BasePuyo.NONE) {
				return false;
			}

			// 2. どちらか一方がnoneの場合はエラー
			if (axisColor != BasePuyo.NONE && childColor == BasePuyo.NONE || axisColor == BasePuyo.NONE && childColor != BasePuyo.NONE) {
				return false;
			}

			// 3. none, noneのツモ以降に色ぷよが出てきたらエラー
			if (axisColor == BasePuyo.NONE && childColor == BasePuyo.NONE) {
				noneFlg = true;
				continue;
			}

			if (noneFlg && (axisColor != BasePuyo.NONE || childColor != BasePuyo.NONE)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * ツモリストを表す文字列から画面のツモリストを設定します。
	 * @param {string} tsumoListStr ツモリスト（文字列）
	 */
	public setTsumoList(tsumoListStr: string): void {
		for (let i = 0; i < tsumoListStr.length; i += 2) {
			const index = i / 2;
			const axisColor = tsumoListStr.charAt(i);
			const childColor = tsumoListStr.charAt(i + 1);

			this.changeColor(index, TsumoListCanvas.TYPE_AXIS, axisColor);
			this.changeColor(index, TsumoListCanvas.TYPE_CHILD, childColor);
		}
		this._stage.update();
	}

	/**
	 * クリアします。
	 */
	public clear(): void {
		for (let i = 0; i < TsumoListCanvas.I_SIZE; i++) {
			for (const t of TsumoListCanvas.TYPES) {
				this.changeColor(i, t, BasePuyo.NONE);
			}
		}
		this._stage.update();
	}

	// accessor
	set isEditable(isEditable: boolean) {
		this._isEditable = isEditable;
	}

	// static method
	/**
	 * ツモリストの座標・ツモのタイプからcanvas上の座標を取得
	 * @param {Coordinate} coord ツモリストの座標
	 * @param {number} type 0：子ぷよ、1：軸ぷよ
	 * @returns {Coordinate} canvas上の座標
	 */
	public static getCanvasCoordinate(coord: Coordinate, type: number): Coordinate {
		const x = (TsumoListCellShape.CELLSIZE + TsumoListCanvas.CELL_PADDING_X) * coord.x;
		const y = TsumoListCellShape.CELLSIZE * (type + 1) + TsumoListCellShape.CELLSIZE * 3 * coord.y + TsumoListCanvas.CELL_ADJUST_Y;
		return new Coordinate(x, y);
	}

	/**
	 * ツモリストの座標からツモ順を取得
	 * @param {Coordinate} coord ツモリストの座標
	 * @returns {number} ツモ順
	 */
	public static getIndex(coord: Coordinate): number {
		return coord.x + coord.y * TsumoListCanvas.X_SIZE;
	}
}