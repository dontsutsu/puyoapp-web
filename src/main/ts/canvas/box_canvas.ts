import { BaseCanvas } from "./base_canvas";
import { BoxPuyoShape } from "./shape/puyo_shape/box_puyo_shape";
import { BasePuyo } from "../game/puyo/base_puyo";
import { BoxCellShape } from "./shape/cell_shape/box_cell_shape";
import { Coordinate } from "../util/coordinate";

import { Shape, Text } from "@createjs/easeljs";
import $ from "jquery";

export class BoxCanvas extends BaseCanvas {
	// constant
	public static readonly KEY_ORDER = [
		BasePuyo.GREEN
		, BasePuyo.RED
		, BasePuyo.BLUE
		, BasePuyo.YELLOW
		, BasePuyo.PURPLE
		, BasePuyo.OJAMA
		, BasePuyo.NONE
	];
	private static readonly KESU_PADDING = 2;
	private static readonly KESU_FONT = "bold 15px BIZ UDPGothic";
	private static readonly KESU_COLOR = "#4242FF";
	private static readonly X_SIZE = 5;
	private static readonly Y_SIZE = 2;
	private static readonly CANVAS_ID = "box";

	// property
	private _selectShape: Shape;
	private _selectColor!: string;	// constructorでsetSelectShapeを呼んでいるので初期化チェックしない

	/**
	 * constructor
	 */
	constructor() {
		super(BoxCanvas.CANVAS_ID, false);
		const endCoord = BoxCanvas.getScreenCoordinate(new Coordinate(BoxCanvas.X_SIZE - 1, BoxCanvas.Y_SIZE - 1));
		const w = endCoord.x + BoxCellShape.CELLSIZE;
		const h = endCoord.y + BoxCellShape.CELLSIZE;
		$("#" + BoxCanvas.CANVAS_ID).attr("width", 1 + Math.ceil(w));
		$("#" + BoxCanvas.CANVAS_ID).attr("height", 1 + Math.ceil(h));

		// CellShape
		for (let y = 0; y < BoxCanvas.Y_SIZE; y++) {
			for (let x = 0; x < BoxCanvas.X_SIZE; x++) {
				const coord = new Coordinate(x, y);
				const cellShape = new BoxCellShape(coord);
				this._stage.addChild(cellShape);
				cellShape.addEventListener("mousedown", () => {
					const index = BoxCanvas.getIndex(coord);
					if (index > BoxCanvas.KEY_ORDER.length - 1) {
						return;
					}

					this.setSelectShape(coord);
					this._stage.update();
				});
			}
		}

		// PuyoShape
		for (let y = 0; y < BoxCanvas.Y_SIZE; y++) {
			for (let x = 0; x < BoxCanvas.X_SIZE; x++) {
				const coord = new Coordinate(x, y);
				const i = BoxCanvas.getIndex(coord);

				if (i < BoxCanvas.KEY_ORDER.length) {
					const color = BoxCanvas.KEY_ORDER[i];

					const puyoShape = new BoxPuyoShape(coord, color);
					this._stage.addChild(puyoShape);

					// 「けす」の文字
					if (color == BasePuyo.NONE) {
						const keShape = new Text("け", BoxCanvas.KESU_FONT, BoxCanvas.KESU_COLOR);
						keShape.x = BoxCellShape.CELLSIZE * x + BoxCanvas.KESU_PADDING;
						keShape.y = BoxCellShape.CELLSIZE * y + BoxCanvas.KESU_PADDING;
						keShape.textAlign = "start";
						keShape.textBaseline = "top";

						const suShape = new Text("す", BoxCanvas.KESU_FONT, BoxCanvas.KESU_COLOR);
						suShape.x = BoxCellShape.CELLSIZE * (x + 1) - BoxCanvas.KESU_PADDING;
						suShape.y = BoxCellShape.CELLSIZE * (y + 1) - BoxCanvas.KESU_PADDING;
						suShape.textAlign = "end";
						suShape.textBaseline = "bottom";

						this._stage.addChild(keShape, suShape);
					}
				}
			}
		}

		// 選択色初期値
		this._selectShape = new Shape();
		this._stage.addChild(this._selectShape);
		this.setSelectShape(new Coordinate(0, 0));

		this._stage.update();
	}

	/**
	 * 指定の座標のぷよを選択中に設定します。
	 * 選択中のぷよは赤枠で囲みます。
	 * @param {number} x x座標
	 * @param {number} y y座標
	 */
	private setSelectShape(coord: Coordinate): void {
		const i = BoxCanvas.getIndex(coord);
		const w = 2;
		const w2 = w / 2;
		const color = "#FF0000";

		this._selectShape.graphics
			.c()
			.s(color)
			.ss(w)
			.dr(coord.x * BoxCellShape.CELLSIZE + w2 + 0.5, coord.y * BoxCellShape.CELLSIZE + w2 + 0.5, BoxCellShape.CELLSIZE - w, BoxCellShape.CELLSIZE - w);

		this._selectColor = BoxCanvas.KEY_ORDER[i];
	}

	// accessor
	get selectColor(): string {
		return this._selectColor;
	}

	// static method
	/**
	 * boxの座標から画面上の座標を取得
	 * @param {Coordinate} coord boxの座標
	 * @returns {Coordinate} 画面上の座標
	 */
	public static getScreenCoordinate(coord: Coordinate): Coordinate {
		return new Coordinate(BoxCellShape.CELLSIZE * coord.x, BoxCellShape.CELLSIZE * coord.y);
	}

	/**
	 * boxの座標からindexを取得
	 * @param {Coordinate} coord boxの座標
	 * @returns {number} index
	 */
	public static getIndex(coord: Coordinate): number {
		return coord.x + BoxCanvas.X_SIZE * coord.y;
	}
}
