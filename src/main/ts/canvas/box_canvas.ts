import { Shape, Text } from "@createjs/easeljs";
import { BasePuyo } from "../game/puyo/base_puyo";
import { BaseCanvas } from "./base_canvas";
import { BoxCellShape } from "./shape/cell_shape/box_cell_shape";
import { BoxPuyoShape } from "./shape/puyo_shape/box_puyo_shape";

export class BoxCanvas extends BaseCanvas {
	// CONSTANT
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
	private static readonly X_SIZE = 5;
	private static readonly Y_SIZE = 2;

	// インスタンス変数
	private _selectShape: Shape;
	private _selectColor!: string;	// constructorでsetSelectShapeを呼んでいるので初期化チェックしない

	/**
	 * コンストラクタ
	 */
	constructor() {
		super("box", false);

		// CellShape
		for (let y = 0; y < BoxCanvas.Y_SIZE; y++) {
			for (let x = 0; x < BoxCanvas.X_SIZE; x++) {
				const index = x + BoxCanvas.X_SIZE * y;
				const cellShape = new BoxCellShape(x, y, index);
				this._stage.addChild(cellShape);
				cellShape.addEventListener("mousedown", () => {
					const x = cellShape.ax;
					const y = cellShape.ay;

					if ((x + y * 5) > BoxCanvas.KEY_ORDER.length - 1) {
						return;
					}

					this.setSelectShape(x, y);
					this._stage.update();
				});
			}
		}

		// PuyoShape
		for (let y = 0; y < BoxCanvas.Y_SIZE; y++) {
			for (let x = 0; x < BoxCanvas.X_SIZE; x++) {
				const i = x + BoxCanvas.X_SIZE * y;

				if (i < BoxCanvas.KEY_ORDER.length) {
					const color = BoxCanvas.KEY_ORDER[i];

					const puyoShape = new BoxPuyoShape(x, y, color);
					this._stage.addChild(puyoShape);

					// 「けす」の文字
					if (color === BasePuyo.NONE) {
						const keShape = new Text("け", "bold 16px BIZ UDPGothic", "#4242FF");
						keShape.x = BoxCellShape.CELLSIZE * x + BoxCanvas.KESU_PADDING;
						keShape.y = BoxCellShape.CELLSIZE * y + BoxCanvas.KESU_PADDING;
						keShape.textAlign = "start";
						keShape.textBaseline = "top";

						const suShape = new Text("す", "bold 16px BIZ UDPGothic", "#4242FF");
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
		this.setSelectShape(0, 0);

		this._stage.update();
	}

	/**
	 * 指定の座標のぷよを選択中に設定します。
	 * 選択中のぷよは赤枠で囲みます。
	 * @param x x座標
	 * @param y y座標
	 */
	private setSelectShape(x: number, y: number): void {
		const i = x + y * 5;
		const w = 2;
		const w2 = w / 2;
		const color = "#FF0000";

		this._selectShape.graphics
			.c()
			.s(color)
			.ss(w)
			.dr(x * BoxCellShape.CELLSIZE + w2 + 0.5, y * BoxCellShape.CELLSIZE + w2 + 0.5, BoxCellShape.CELLSIZE - w, BoxCellShape.CELLSIZE - w);

		this._selectColor = BoxCanvas.KEY_ORDER[i];
	}

	// ACCESSOR
	get selectColor(): string {
		return this._selectColor;
	}
}
