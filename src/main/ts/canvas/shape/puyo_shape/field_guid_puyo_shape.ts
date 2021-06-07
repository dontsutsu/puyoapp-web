import { Field } from "../../../game/field";
import { BasePuyo } from "../../../game/puyo/base_puyo";
import { Coordinate } from "../../../util/coordinate";
import { FieldCanvas } from "../../field_canvas";
import { FieldCellShape } from "../cell_shape/field_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";

export class FieldGuidePuyoShape extends BasePuyoShape {
	// constant
	public static readonly SIZE_RATIO = 0.5;
	private static readonly RADIUS = FieldCellShape.CELLSIZE / 2 * FieldGuidePuyoShape.SIZE_RATIO;
	
	/**
	 * constructor
	 */
	constructor() {
		const canvasCoord = FieldCanvas.getCanvasCoordinate(new Coordinate(0, 0));
		canvasCoord.add(FieldCellShape.CELLSIZE * (1 - FieldGuidePuyoShape.SIZE_RATIO) / 2);	// 足す
		super(canvasCoord, BasePuyo.NONE, FieldGuidePuyoShape.RADIUS);
		this.alpha = this.alpha * 0.5;
	}

	// method
	/**
	 * 色と座標を更新
	 * @param {Coordinate} coord 座標
	 * @param {string} color 色
	 */
	public update(coord: Coordinate, color: string): void {
		const canvasCoord = FieldCanvas.getCanvasCoordinate(coord);
		canvasCoord.add(FieldCellShape.CELLSIZE * (1 - FieldGuidePuyoShape.SIZE_RATIO) / 2);	// 足す
		this.x = canvasCoord.x;
		this.y = canvasCoord.y;
		this.setGraphics(color);
		this.alpha = this.alpha * 0.5;
		this.visible = (coord.y < Field.Y_SIZE);
	}

}