import { Container, Shadow, Shape, Text } from "@createjs/easeljs";
import { Tween, Timeline } from "@createjs/tweenjs";
import { BaseCanvas } from "./base_canvas";
import { Field } from "../game/field";
import { FieldCellShape } from "./shape/cell_shape/field_cell_shape";
import { Util } from "../util/util";
import { FieldPuyoShape } from "./shape/puyo_shape/field_puyo_shape";
import { EditableMode } from "../mode/editable_mode";
import { BasePuyo } from "../game/puyo/base_puyo";
import { Tsumo } from "../game/tsumo";
import { FieldGuidePuyoShape } from "./shape/puyo_shape/field_guid_puyo_shape";
import $ from "jquery";
import { TimelineList } from "./timeline/timeline_list";

export class FieldCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly DROP_VEL = 50;
	private static readonly ERASE_VEL = 500;
	private static readonly STEP_ERASE_TIME = 300;
	// CONSTANT（FRAME用）
	public static readonly F_O_PAD = FieldCellShape.CELLSIZE / 6;	// 外側FRAMEのPAD
	public static readonly F_I_PAD = FieldCanvas.F_O_PAD * 3;		// 内側FRAMEのPAD
	private static readonly F_SKEW_DEG = 5;							// FRAMEの傾き
	private static readonly F_BASE_X = FieldCellShape.CELLSIZE * Field.X_SIZE + (FieldCanvas.F_O_PAD + FieldCanvas.F_I_PAD) * 2;
	private static readonly F_BASE_Y = FieldCellShape.CELLSIZE * Field.Y_SIZE + (FieldCanvas.F_O_PAD + FieldCanvas.F_I_PAD) * 2;

	// CLASS FIELD
	private _container: Container;
	private _cellShapeArray: FieldCellShape[][];
	private _puyoShapeArray: FieldPuyoShape[][];
	private _score: Text;
	private _scoreOutline: Text;
	private _axisGuide: FieldGuidePuyoShape;
	private _childGuide: FieldGuidePuyoShape;
	private _isModel: boolean;
	private _isEditable: boolean;

	/**
	 * コンストラクタ
	 * @param {string} canvasId canvasのID 
	 * @param {boolean} isModel
	 */
	constructor(canvasId: string, isModel: boolean = false) {
		super(canvasId, true);
		this._stage.enableMouseOver();
		this._isModel = isModel;
		this._isEditable = true;

		const w = FieldCanvas.F_BASE_X;
		const h = FieldCanvas.F_BASE_Y + FieldCanvas.F_BASE_X * Util.sin(FieldCanvas.F_SKEW_DEG) * 2;
		$("#" + canvasId).attr("width", 1 + Math.ceil(w));
		$("#" + canvasId).attr("height", 1 + Math.ceil(h));

		// frame
		const frame = this.createFrameContainer();
		this._stage.addChild(frame);

		// container
		this._container = new Container();
		this._stage.addChild(this._container);
		this._container.x = FieldCanvas.F_O_PAD + FieldCanvas.F_I_PAD;
		this._container.y = FieldCanvas.F_O_PAD + FieldCanvas.F_I_PAD + FieldCanvas.F_BASE_X * Util.sin(FieldCanvas.F_SKEW_DEG);

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
		// モデル（2p）の場合はguideをcontainerに乗せず、表示されないようにしておく
		if (!this._isModel) this._container.addChild(this._axisGuide, this._childGuide);

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
					if (!this._isEditable) return;
					const x = cellShape.ax;
					const y = cellShape.ay;
					eMode.changeFieldPuyo(x, y);
				});

				cellShape.addEventListener("mouseover", () => {
					if (!this._isEditable) return;
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
	 * スコアに表示するTweenを取得します。
	 * @param {number} score スコア
	 * @returns {Tween[]}
	 */
	public getDropScoreTween(score: number): Tween[] {
		return this.getScoreStringTween(FieldCanvas.formatScore(score));
	}

	/**
	 * スコアをセットします。
	 * @param {number} score スコア
	 */
	public setScore(score: number): void {
		this.setScoreString(FieldCanvas.formatScore(score));
	}

	/**
	 * ガイドをセットします。
	 * @param {Tsumo} tsumo 
	 * @param {number} axisToY 
	 * @param {number} childToY 
	 */
	public setGuide(tsumo: Tsumo, axisToY: number, childToY: number): void {
		this._axisGuide.update(tsumo.axisX, axisToY, tsumo.axisColor);
		this._childGuide.update(tsumo.childX, childToY, tsumo.childColor);
	}

	/**
	 * ガイドを非表示にします。
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
	 * フレームを生成します。
	 * @returns {Container}
	 */
	private createFrameContainer(): Container {
		const oFrameColor = "#E0E0E0";
		const iFrameColor = this._isModel ? "#F57777" : "#40B0FF";
		const skew = FieldCanvas.F_SKEW_DEG * (this._isModel ? 1 : -1);

		// 傾けた分の計算
		const sin = Util.sin(FieldCanvas.F_SKEW_DEG);
		const cos = Util.cos(FieldCanvas.F_SKEW_DEG);
		const y = this._isModel ? 0 : FieldCanvas.F_BASE_X * sin;
		
		// 角丸のサイズ
		const oRad = FieldCellShape.CELLSIZE / 3;
		const iRad = oRad / 5 * 4;

		// frame
		const oFrame = new Shape();
		oFrame.graphics
			.f(oFrameColor)
			.rr(0.5, 0.5, FieldCanvas.F_BASE_X / cos, FieldCanvas.F_BASE_Y + FieldCanvas.F_BASE_X * sin, oRad);
		oFrame.skewY = skew;

		const iFrame = new Shape();
		iFrame.graphics
			.f(iFrameColor)
			.rr(FieldCanvas.F_O_PAD + 0.5, FieldCanvas.F_O_PAD + 0.5, (FieldCanvas.F_BASE_X - FieldCanvas.F_O_PAD * 2) / cos, (FieldCanvas.F_BASE_Y - FieldCanvas.F_O_PAD * 2) + (FieldCanvas.F_BASE_X - FieldCanvas.F_O_PAD * 2) * sin, iRad);
		iFrame.skewY = skew;

		const container = new Container();
		container.addChild(oFrame, iFrame);
		container.y = y;

		return container;
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
	 * @param {number} y ロジック上のy座標
	 * @returns {number} canvas上のy座標
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

	public static createStopTlList(): TimelineList {
		const stopTlList = new TimelineList();
		const stopTl = new Timeline({paused: true});
		const stopTwn = Tween.get(new Shape()).wait(FieldCanvas.STEP_ERASE_TIME);
		stopTl.addTween(stopTwn);
		stopTlList.push(stopTl);
		return stopTlList;
	}

	// accessor
	set isEditable(isEditable: boolean) {
		this._isEditable = isEditable;
	}
}