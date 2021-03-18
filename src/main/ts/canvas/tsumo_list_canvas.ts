import { Text } from "@createjs/easeljs";
import { BasePuyo } from "../game/puyo/base_puyo";
import { Nazotoki } from "../mode/nazotoki";
import { BaseCanvas } from "./base_canvas";
import { TsumoListCellShape } from "./shape/cell_shape/tsumo_list_cell_shape";
import { TsumoListPuyoShape } from "./shape/puyo_shape/tsumo_list_puyo_shape";

export class TsumoListCanvas extends BaseCanvas {
	// CONSTANT
	public static readonly X_SIZE = 5;
	public static readonly Y_SIZE = 2;

	// CLASS FIELD
	private _cellShapeArray: TsumoListCellShape[][];
	private _puyoShapeArray: TsumoListPuyoShape[][];
	private _colorArray: string[][];

	/**
	 * コンストラクタ
	 */
	constructor() {
		super("tsumoList", false);
		this._stage.enableMouseOver();

		// number
		for (let y = 0; y < TsumoListCanvas.Y_SIZE; y++) {
			for (let x = 0; x < TsumoListCanvas.X_SIZE; x++) {
				const num = x + y * TsumoListCanvas.X_SIZE + 1;
				const numShape = new Text(String(num), "bold 14px BIZ UDPGothic", "#888888");
				const xy = TsumoListCellShape.getXandY(x, y, 0);
				numShape.x = xy.x + (TsumoListCellShape.CELLSIZE / 2);
				numShape.y = xy.y - (TsumoListCellShape.CELLSIZE / 2);
				numShape.textAlign = "center";
				this._stage.addChild(numShape);
			}
		}

		// cellshape
		this._cellShapeArray = [];
		for (let y = 0; y < TsumoListCanvas.Y_SIZE; y++) {
			for (let x = 0; x < TsumoListCanvas.X_SIZE; x++) {
				const indexArray: TsumoListCellShape[] = [];
				for (let t = 0; t < 2; t++) {	// child: t=0, axis: t=1
					const cellShape = new TsumoListCellShape(x, y, t);
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
				for (let t = 0; t < 2; t++) {	// child: t=0, axis: t=1
					const puyoShape = new TsumoListPuyoShape(x, y, t);
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
				for (let t = 0; t < 2; t++) {	// child: t=0, axis: t=1
					indexArray.push(BasePuyo.NONE);
				}
				this._colorArray.push(indexArray);
			}
		}

		this._stage.update();
	}

	/**
	 * 
	 * @param {Nazotoki} nazotoki 
	 */
	public setMouseEvent(nazotoki: Nazotoki): void {
		for (const indexArray of this._cellShapeArray) {
			for (const cellShape of indexArray) {
				cellShape.addEventListener("mousedown", () => {
					const index = cellShape.index;
					const type = cellShape.type;
					nazotoki.changeTsumoListPuyo(index, type);
					this._stage.update();
				});

				cellShape.addEventListener("mouseover", () => {
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
	 * 
	 * @param {number} index 
	 * @param {number} type 
	 * @param {string} color 
	 */
	public changeColor(index: number, type: number, color: string): void {
		this._colorArray[index][type] = color;
		this._puyoShapeArray[index][type].changeColor(color);
	}

	/**
	 * @returns {string}
	 */
	public getTsumoListString(): string {
		let str = "";
		for (let i = 0; i < this._colorArray.length; i++) {
			// 軸ぷよが先、子ぷよが後
			str += this._colorArray[i][1] + this._colorArray[i][0];
		}
		return str;
	}

	/**
	 * @returns {boolean}
	 */
	public check(): boolean {
		let noneFlg = false;

		for (let i = 0; i < this._colorArray.length; i++) {
			const axisColor = this._colorArray[i][1];
			const childColor = this._colorArray[i][0];

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
	 * 
	 * @param {string} tsumoListStr 
	 */
	public setTsumoList(tsumoListStr: string): void {
		for (let i = 0; i < tsumoListStr.length; i += 2) {
			const index = i / 2;
			const axisColor = tsumoListStr.charAt(i);
			const childColor = tsumoListStr.charAt(i + 1);

			this.changeColor(index, 1, axisColor);
			this.changeColor(index, 0, childColor);
		}
		this._stage.update();
	}
}