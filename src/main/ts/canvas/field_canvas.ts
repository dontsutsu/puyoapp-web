import { Container, Shadow, Shape, Text } from "@createjs/easeljs";
import { Tween } from "@createjs/tweenjs";
import { BaseCanvas } from "./base_canvas";
import { Field } from "../game/field";
import { FieldCellShape } from "./shape/cell_shape/field_cell_shape";
import { Util } from "../util/util";
import { FieldPuyoShape } from "./shape/puyo_shape/field_puyo_shape";
import { EditableMode } from "../mode/editable_mode";
import { BasePuyo } from "../game/puyo/base_puyo";
import { Tsumo } from "../game/tsumo";
import { FieldGuidePuyoShape } from "./shape/puyo_shape/field_guid_puyo_shape";

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
	private _score: Text;
	private _scoreOutline: Text;
	private _axisGuide: FieldGuidePuyoShape;
	private _childGuide: FieldGuidePuyoShape;

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

		// score
		const scoreStr = "0".padStart(9, "0");
		this._score = new Text(scoreStr, "bold 24px BIZ UDPGothic");
		this._score.textAlign = "end";
		this._score.textBaseline = "top";
		this._score.x = FieldCellShape.CELLSIZE * Field.X_SIZE + 0.5;
		this._score.y = FieldCellShape.CELLSIZE * Field.Y_SIZE + 4.5;	// 4は余白
		// outline clone
		this._scoreOutline = this._score.clone();
		// color, outline
		this._score.color = "#FFFFFF";
		this._scoreOutline.color = "#707070";
		this._scoreOutline.shadow = new Shadow(this._scoreOutline.color, 1, 1, 0);
		this._scoreOutline.outline = 3;
		// add outlineを先に
		this._container.addChild(this._scoreOutline, this._score);

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

		// 致死座標の×印
		const crossShape = this.createCrossShape();
		this._container.addChild(crossShape);

		// guide
		this._axisGuide = new FieldGuidePuyoShape();
		this._childGuide = new FieldGuidePuyoShape();
		this._container.addChild(this._axisGuide, this._childGuide);

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
	 * @param {EditableMode} eMode 
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
				});
			}
		}
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} color 
	 */
	public changeFieldPuyo(x: number, y: number, color: string): void {
		this._puyoShapeArray[y][x].setGraphics(color);
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} fromY 
	 * @param {number} toY 
	 * @returns {Tween}
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
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} eraseColor
	 * @returns {Tween}
	 */
	public getErasetween(x: number, y: number, eraseColor: string): Tween {
		const val = Util.getAnimateMode();

		const erasePuyo = this._puyoShapeArray[y][x];

		let tween = Tween.get(erasePuyo);
		if (val == 1) {
			tween = tween.to({alpha: 0}, FieldCanvas.ERASE_VEL)
				.call(() => { erasePuyo.setGraphics(BasePuyo.NONE); });
		} else {
			tween = tween.wait(FieldCanvas.STEP_ERASE_TIME)
				.call(() => { erasePuyo.setStepEraseGraphics(eraseColor); })
				.wait(FieldCanvas.STEP_ERASE_TIME)
				.call(() => { erasePuyo.setGraphics(BasePuyo.NONE); });
		}
		return tween;
	}

	/**
	 * 
	 * @param {Tsumo} tsumo 
	 * @param {number} axisToY 
	 * @param {number} childToY 
	 * @returns {Tween[]}
	 */
	public getTsumoDropTween(tsumo: Tsumo, axisToY: number, childToY: number): Tween[] {
		const val = Util.getAnimateMode();

		// ツモの座標位置 15,16,17 になるように
		const axisFromY = Field.Y_SIZE + 2 + tsumo.axisY;
		const childFromY = Field.Y_SIZE + 2 + tsumo.childY;

		const tweens: Tween[] = [];

		// axis
		if (axisToY < Field.Y_SIZE) {
			const axisRemovePuyo = this._puyoShapeArray[axisToY][tsumo.axisX];
			const axisNewPuyo = new FieldPuyoShape(tsumo.axisX, axisFromY, tsumo.axisColor);
			this._container.addChild(axisNewPuyo);

			this._puyoShapeArray[axisToY][tsumo.axisX] = axisNewPuyo;
			
			const axisTween = Tween.get(axisNewPuyo)
				.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(axisFromY)})
				.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(axisToY)}, FieldCanvas.DROP_VEL * (axisFromY - axisToY) * val)
				.call(() => { this._container.removeChild(axisRemovePuyo); });
			
			tweens.push(axisTween);
		}

		// child
		if (childToY < Field.Y_SIZE) {
			const childRemovePuyo = this._puyoShapeArray[childToY][tsumo.childX];
			const childNewPuyo = new FieldPuyoShape(tsumo.childX, childFromY, tsumo.childColor);
			this._container.addChild(childNewPuyo);

			this._puyoShapeArray[childToY][tsumo.childX] = childNewPuyo;
			
			const childTween = Tween.get(childNewPuyo)
				.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(childFromY)})
				.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(childToY)}, FieldCanvas.DROP_VEL * (childFromY - childToY) * val)
				.call(() => { this._container.removeChild(childRemovePuyo); });
			tweens.push(childTween);
		}

		return tweens;
	}

	/**
	 * 
	 * @param {number} erase 消去数
	 * @param {number} bonus ボーナス倍率
	 * @returns {Tween[]}
	 */
	public getEraseScoreTween(erase: number, bonus: number): Tween[] {
		const scoreStr = (erase * 10) + " × " + bonus;
		return this.getScoreStringTween(scoreStr);
	}

	/**
	 * 
	 * @param {number} score 
	 * @returns {Tween[]}
	 */
	public getDropScoreTween(score: number): Tween[] {
		return this.getScoreStringTween(FieldCanvas.formatScore(score));
	}

	/**
	 * 
	 * @param {number} score スコア
	 */
	public setScore(score: number): void {
		this.setScoreString(FieldCanvas.formatScore(score));
	}

	/**
	 * 
	 * @param tsumo 
	 * @param axisToY 
	 * @param childToY 
	 */
	public setGuide(tsumo: Tsumo, axisToY: number, childToY: number): void {
		this._axisGuide.update(tsumo.axisX, axisToY, tsumo.axisColor);
		this._childGuide.update(tsumo.childX, childToY, tsumo.childColor);
	}

	/**
	 * 
	 */
	public hideGuide(): void {
		this._axisGuide.visible = false;
		this._childGuide.visible = false;
	}

	/**
	 * スコアに表示するTweenを取得します。
	 * @param {string} dispStr 表示する文字列
	 * @returns {Tween[]}
	 */
	private getScoreStringTween(dispStr: string): Tween[] {
		const tweens: Tween[] = [];
		const scoreTween = Tween.get(this._score)
			.call(() => { this._score.text = dispStr; });
		const scoreOutlineTween = Tween.get(this._scoreOutline)
			.call(() => { this._scoreOutline.text = dispStr });
		tweens.push(scoreTween, scoreOutlineTween);
		return tweens;
	}

	/**
	 * スコアの文字列を設定します。
	 * @param {string} dispStr 表示する文字列
	 */
	private setScoreString(dispStr: string): void {
		this._score.text = dispStr;
		this._scoreOutline.text = dispStr;
	}

	/**
	 * @returns {Container}
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
	 * 致死座標×印のShapeを作成します。
	 * @returns {Shape} ×印のcreatejs.Shape
	 */
	private createCrossShape(): Shape {
		const crossShape = new Shape();
		// TODO ループとかで上手くかけそうなら変更したい、思いつかないのでゴリ押し
		const thickness = FieldCellShape.CELLSIZE / 20;
		const uni = (FieldCellShape.CELLSIZE - thickness * 2) / 4;
		crossShape.graphics
			.s("#872819")
			.ss(thickness)
			.f("#EC4141")
			.mt(uni * 0, uni * 1)
			.lt(uni * 1, uni * 0)
			.lt(uni * 2, uni * 1)
			.lt(uni * 3, uni * 0)			
			.lt(uni * 4, uni * 1)
			.lt(uni * 3, uni * 2)
			.lt(uni * 4, uni * 3)
			.lt(uni * 3, uni * 4)
			.lt(uni * 2, uni * 3)
			.lt(uni * 1, uni * 4)
			.lt(uni * 0, uni * 3)
			.lt(uni * 1, uni * 2)
			.lt(uni * 0, uni * 1);
		crossShape.x = FieldCellShape.CELLSIZE * Field.DEAD_X + thickness + 0.5;
		crossShape.y = FieldCellShape.CELLSIZE * FieldCanvas.convertY(Field.DEAD_Y) + thickness + 0.5;
		return crossShape;
	}

	/**
	 * ロジック上のy方向とcanvas上のy方向が異なるため、yの値を変換します。
	 * @param {number} y 
	 * @returns {number}
	 */
	public static convertY(y: number): number {
		return Field.Y_SIZE - 1 - y;
	}
	
	/**
	 * scoreを指定フォーマットの文字列に変換します。
	 * @param {number} score スコア
	 * @returns {string} 0埋め9桁の文字列
	 */
	public static formatScore(score: number): string {
		return (score + "").padStart(9, "0");
	}
}