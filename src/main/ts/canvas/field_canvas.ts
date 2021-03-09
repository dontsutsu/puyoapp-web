import { Container, Shape } from "@createjs/easeljs";
import { Tween } from "@createjs/tweenjs";
import { BaseCanvas } from "./base_canvas";
import { Field } from "../game/field";
import { FieldCellShape } from "./shape/cell_shape/field_cell_shape";
import { Util } from "../util/util";
import { FieldPuyoShape } from "./shape/puyo_shape/field_puyo_shape";
import { EditableMode } from "../mode/editable_mode";
import { BasePuyo } from "../game/puyo/base_puyo";
import { Tsumo } from "../game/tsumo";

export class FieldCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly FRAME_SKEW_DEG = 5;
	private static readonly DROP_VEL = 50;
	private static readonly ERASE_VEL = 500;
	private static readonly STEP_ERASE_TIME = 300;

	// CLASS FIELD
	private _container: Container;
	private _cellShapeArray: FieldCellShape[][];
	private _puyoShapeArray: FieldPuyoShape[][];

	/**
	 * コンストラクタ
	 */
	constructor() {
		super("field", true);
		this._stage.enableMouseOver();
		
		// frame
		const frame = this.createFrameContainer();
		this._stage.addChild(frame);

		// container
		this._container = new Container();
		this._stage.addChild(this._container);
		this._container.x = 20;
		this._container.y = 20 + 250 * Util.sin(FieldCanvas.FRAME_SKEW_DEG);

		// CellShape
		this._cellShapeArray = [];
		for (let y = 0; y < Field.Y_SIZE; y++) {
			const yarray = [];
			for (let x = 0; x < Field.X_SIZE; x++) {
				const cellShape = new FieldCellShape(x, y);
				yarray.push(cellShape);
				this._container.addChild(cellShape);
			}
			this._cellShapeArray.push(yarray);
		}

		// PuyoShape
		this._puyoShapeArray = [];
		for (let y = 0; y < Field.Y_SIZE; y++) {
			const yarray = [];
			for (let x = 0; x < Field.X_SIZE; x++) {
				const puyoShape = new FieldPuyoShape(x, y);
				yarray.push(puyoShape);
				this._container.addChild(puyoShape);
			}
			this._puyoShapeArray.push(yarray);
		}
	}

	/**
	 * 
	 * @param eMode 
	 */
	public setMouseEvent(eMode: EditableMode): void {
		for (const yarray of this._cellShapeArray) {
			for (const cellShape of yarray) {
				cellShape.addEventListener("mousedown", () => {
					const x = cellShape.ax;
					const y = cellShape.ay;
					eMode.changeFieldPuyo(x, y);
				});

				cellShape.addEventListener("mouseover", () => {
					cellShape.mouseover();
				});

				cellShape.addEventListener("mouseout", () => {
					cellShape.mouseout();
				})
			}
		}
	}

	/**
	 * 
	 * @param x 
	 * @param y 
	 * @param color 
	 */
	public changeFieldPuyo(x: number, y: number, color: string): void {
		this._puyoShapeArray[y][x].changeColor(color);
	}

	/**
	 * 
	 * @param x 
	 * @param fromY 
	 * @param toY 
	 */
	public getDropTween(x: number, fromY: number, toY: number): Tween {
		const val = Util.getAnimateMode();

		const dropPuyo = this._puyoShapeArray[fromY][x];
		const removePuyo = this._puyoShapeArray[toY][x];
		const newPuyo = new FieldPuyoShape(x, fromY);

		this._puyoShapeArray[toY][x] = dropPuyo;
		this._puyoShapeArray[fromY][x] = newPuyo;

		const tween = Tween.get(dropPuyo)
			.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(fromY)})
			.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(toY)}, FieldCanvas.DROP_VEL * (fromY - toY) * val)
			.call(() => {
				// remove
				this._container.removeChild(removePuyo);
				// add
				this._container.addChild(newPuyo);
			});
		return tween;
	}

	/**
	 * 
	 * @param x 
	 * @param y 
	 */
	public getErasetween(x: number, y: number, eraseColor: string): Tween {
		const val = Util.getAnimateMode();

		const erasePuyo = this._puyoShapeArray[y][x];

		let tween = Tween.get(erasePuyo);
		if (val == 1) {
			tween = tween.to({alpha: 0}, FieldCanvas.ERASE_VEL)
				.call(() => { erasePuyo.changeColor(BasePuyo.NONE); });
		} else {
			tween = tween.wait(FieldCanvas.STEP_ERASE_TIME)
				.call(() => { erasePuyo.setStepEraseGraphics(eraseColor); })
				.wait(FieldCanvas.STEP_ERASE_TIME)
				.call(() => { erasePuyo.changeColor(BasePuyo.NONE); });
		}
		return tween;
	}

	/**
	 * 
	 * @param tsumo 
	 * @param axisToY 
	 * @param childToY 
	 * @returns 
	 */
	public getTsumoDropTween(tsumo: Tsumo, axisToY: number, childToY: number): Tween[] {
		const val = Util.getAnimateMode();

		// ツモの座標位置 15,16,17 になるように
		const axisFromY = Field.Y_SIZE + 2 + tsumo.axisY;
		const childFromY = Field.Y_SIZE + 2 + tsumo.childY;

		// axis
		const axisRemovePuyo = this._puyoShapeArray[axisToY][tsumo.axisX];
		const axisNewPuyo = new FieldPuyoShape(tsumo.axisX, axisFromY, tsumo.axisColor);
		this._container.addChild(axisNewPuyo);

		this._puyoShapeArray[axisToY][tsumo.axisX] = axisNewPuyo;
		
		const axisTween = Tween.get(axisNewPuyo)
			.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(axisFromY)})
			.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(axisToY)}, FieldCanvas.DROP_VEL * (axisFromY - axisToY) * val)
			.call(() => { this._container.removeChild(axisRemovePuyo); });

		// child
		const childRemovePuyo = this._puyoShapeArray[childToY][tsumo.childX];
		const childNewPuyo = new FieldPuyoShape(tsumo.childX, childFromY, tsumo.childColor);
		this._container.addChild(childNewPuyo);

		this._puyoShapeArray[childToY][tsumo.childX] = childNewPuyo;
		
		const childTween = Tween.get(childNewPuyo)
			.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(childFromY)})
			.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(childToY)}, FieldCanvas.DROP_VEL * (childFromY - childToY) * val)
			.call(() => { this._container.removeChild(childRemovePuyo); });

		return [axisTween, childTween];
	}

	/**
	 * 
	 */
	private createFrameContainer(): Container {
		// 傾けた分の計算
		const deg = FieldCanvas.FRAME_SKEW_DEG;
		const sin = Util.sin(deg);
		const cos = Util.cos(deg);
		const y = 250 * sin;

		// frame
		const outsideFrame = new Shape();
		outsideFrame.graphics
			.f("#E0E0E0")
			.rr(0.5, 0.5, 250 / cos, 495 + 250 * sin, 12.5);
		outsideFrame.skewY = deg * (-1);

		const insideFrame = new Shape();
		insideFrame.graphics
			.f("#EE808D")
			.rr(5.5, 5.5, 240 / cos, 485 + 240 * sin, 10);
		insideFrame.skewY = deg * (-1);

		const frameContainer = new Container();
		frameContainer.addChild(outsideFrame, insideFrame);
		frameContainer.y = y;
		
		return frameContainer;
	}

	/**
	 * ロジック上のy方向とcanvas上のy方向が異なるため、yの値を変換します。
	 * @param y 
	 */
	public static convertY(y: number): number {
		return Field.Y_SIZE - 1 - y;
	}
}