import { BoxCellShape } from "../shape/box_cell_shape";
import { BoxPuyoShape } from "../shape/box_puyo_shape";

import { Stage, Shape, Text } from "@createjs/easeljs";

/**
 * Boxクラス
 */
export class Box {
	// クラス定数
	public static readonly KEY_ORDER = ["1", "2", "3", "4", "5", "9", "0"];

	private static readonly CANVAS_ID = "box";
	private static readonly KESU_PADDING = 2;

	// インスタンス変数
	private _stage: Stage;
	private _selectShape: Shape;
	private _selectColor!: string;	// constructorでsetSelectShapeを呼んでいるので初期化チェックしない

	/**
	 * コンストラクタ
	 */
	constructor() {
		// size
		const boxX = 5;
		const boxY = 2;

		// stage
		this._stage = new Stage(Box.CANVAS_ID);

		// CellShape
		for (let y = 0; y < boxY; y++) {
			for (let x = 0; x < boxX; x++) {
				const i = x + boxX * y;
				const cellShape = new BoxCellShape(x, y, i);
				this._stage.addChild(cellShape);
				cellShape.addEventListener("mousedown", () => {
					const x = cellShape.posx;
					const y = cellShape.posy;
			
					if ((x + y * 5) > Box.KEY_ORDER.length - 1) {
						return;
					}
			
					this.setSelectShape(x, y);
					this._stage.update();
				});
			}
		}

		// PuyoShape
		for (let y = 0; y < boxY; y++) {
			for (let x = 0; x < boxX; x++) {
				const i = x + boxX * y;

				if (i < Box.KEY_ORDER.length) {
					const color = Box.KEY_ORDER[i];

					const puyoShape = new BoxPuyoShape(x, y, color);
					this._stage.addChild(puyoShape);

					// 「けす」の文字
					if (color == "0") {
						const keShape = new Text("け", "bold 16px BIZ UDPGothic", "#4242FF");
						keShape.x = BoxCellShape.CELLSIZE * x + Box.KESU_PADDING;
						keShape.y = BoxCellShape.CELLSIZE * y + Box.KESU_PADDING;
						keShape.textAlign = "start";
						keShape.textBaseline = "top";

						const suShape = new Text("す", "bold 16px BIZ UDPGothic", "#4242FF");
						suShape.x = BoxCellShape.CELLSIZE * (x + 1) - Box.KESU_PADDING;
						suShape.y = BoxCellShape.CELLSIZE * (y + 1) - Box.KESU_PADDING;
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

		this._selectColor = Box.KEY_ORDER[i];
	}

	////////////////////////////////
	// setter / getter
	////////////////////////////////

	get selectColor(): string {
		return this._selectColor;
	}
}
