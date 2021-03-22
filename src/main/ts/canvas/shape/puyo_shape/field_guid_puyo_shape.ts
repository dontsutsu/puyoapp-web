import { Field } from "../../../game/field";
import { BasePuyo } from "../../../game/puyo/base_puyo";
import { FieldCanvas } from "../../field_canvas";
import { FieldCellShape } from "../cell_shape/field_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";

export class FieldGuidePuyoShape extends BasePuyoShape {
	// CONSTANT
	private static readonly SIZE_RATIO = 0.5;
	
	/**
	 * コンストラクタ
	 */
	constructor() {
		const {x, y} = FieldGuidePuyoShape.convert(0, 0);
		super(x, y, BasePuyo.NONE, FieldCellShape.CELLSIZE * FieldGuidePuyoShape.SIZE_RATIO);
		this.alpha = this.alpha * 0.5;
	}

	/**
	 * 
	 * @param {number} ax 
	 * @param {number} ay 
	 * @param {string} color 
	 */
	public update(ax: number, ay: number, color: string): void {
		const {x, y} = FieldGuidePuyoShape.convert(ax, ay);
		this.x = x;
		this.y = y;
		this.changeColor(color);
		this.alpha = this.alpha * 0.5;
		this.visible = (ay < Field.Y_SIZE);
	}

	/**
	 * 
	 * @param {number} ax 
	 * @param {number} ay 
	 * @returns {x: number, y: number}
	 */
	private static convert(ax: number, ay: number): {x: number, y: number} {
		const x = FieldCellShape.CELLSIZE * ax + FieldCellShape.CELLSIZE * (1 - this.SIZE_RATIO) / 2;
		const y = FieldCellShape.CELLSIZE * FieldCanvas.convertY(ay) + FieldCellShape.CELLSIZE * (1 - this.SIZE_RATIO) / 2;
		return {x, y};
	}
}