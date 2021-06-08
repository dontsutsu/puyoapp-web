import { BaseCanvas } from "./base_canvas";
import { Field } from "../game/field";
import { FieldCellShape } from "./shape/cell_shape/field_cell_shape";
import { FieldPuyoShape } from "./shape/puyo_shape/field_puyo_shape";
import { FieldGuidePuyoShape } from "./shape/puyo_shape/field_guid_puyo_shape";
import { EditableMode } from "../mode/editable_mode";
import { BasePuyo } from "../game/puyo/base_puyo";
import { Tsumo } from "../game/tsumo";
import { TimelineList } from "./timeline/timeline_list";
import { Util } from "../util/util";
import { Constant } from "../util/constant";
import { Coordinate } from "../util/coordinate";
import { BaseMode } from "../mode/base_mode";

import { Container, Shadow, Shape, Text } from "@createjs/easeljs";
import { Tween, Timeline } from "@createjs/tweenjs";
import $ from "jquery";

export class FieldCanvas extends BaseCanvas {
	// constant
	private static readonly DROP_VEL = 50;
	private static readonly ERASE_VEL = 500;
	private static readonly STEP_ERASE_TIME = 300;
	// constant（FRAME用）
	public static readonly F_O_PAD = FieldCellShape.CELLSIZE / 6;	// 外側FRAMEのPAD
	public static readonly F_I_PAD = FieldCanvas.F_O_PAD * 3;		// 内側FRAMEのPAD
	private static readonly F_SKEW_DEG = 5;							// FRAMEの傾き
	private static readonly F_BASE_X = FieldCellShape.CELLSIZE * Field.X_SIZE + (FieldCanvas.F_O_PAD + FieldCanvas.F_I_PAD) * 2;
	private static readonly F_BASE_Y = FieldCellShape.CELLSIZE * Field.Y_SIZE + (FieldCanvas.F_O_PAD + FieldCanvas.F_I_PAD) * 2;

	// property
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
	 * constructor
	 * @param {string} canvasId canvasのID 
	 * @param {boolean} [isModel] model（2p）のフィールドかどうか
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
				const cellShape = new FieldCellShape(new Coordinate(x, y));
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
				const puyoShape = new FieldPuyoShape(new Coordinate(x, y));
				yarray.push(puyoShape);
				this._container.addChild(puyoShape);
			}
			this._puyoShapeArray.push(yarray);
		}
	}

	// method
	/**
	 * 
	 * @param {EditableMode} eMode 
	 */
	public setMouseEvent(eMode: EditableMode): void {
		for (const yarray of this._cellShapeArray) {
			for (const cellShape of yarray) {
				cellShape.addEventListener("mousedown", () => {
					// TODO 右クリックの場合はぷよを消すように変更したい
					// e.nativeEvent.whichに情報持っている
					// which=1の場合左、which=3の場合右
					// nativeEventの取得の仕方が分からないので一旦保留
					if (!this._isEditable) return;
					eMode.changeFieldPuyo(cellShape.coord);
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
	 * @param {Coordinate} coord
	 * @param {string} color 
	 */
	public changeFieldPuyo(coord: Coordinate, color: string): void {
		this.getPuyo(coord).setGraphics(color);
	}

	/**
	 * 落下のTweenを取得
	 * @param {Coordinate} fromCoord 落ちる前の座標 
	 * @param {Coordinate} toCoord 落ちた先の座標
	 * @returns {Tween} 
	 */
	public getDropTween(fromCoord: Coordinate, toCoord: Coordinate): Tween {
		const val = BaseMode.getAnimateMode();

		const dropPuyo = this.getPuyo(fromCoord);
		const removePuyo = this.getPuyo(toCoord);
		const newPuyo = new FieldPuyoShape(fromCoord);

		this.setPuyo(toCoord, dropPuyo);
		this.setPuyo(fromCoord, newPuyo);

		const tween = Tween.get(dropPuyo)
			.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(fromCoord.y)})
			.to({y: FieldCellShape.CELLSIZE * FieldCanvas.convertY(toCoord.y)}, FieldCanvas.DROP_VEL * (fromCoord.y - toCoord.y) * val)
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
	 * @param {Coordinate} coord 座標
	 * @param {string} eraseColor 消す色
	 * @returns {Tween}
	 */
	public getErasetween(coord: Coordinate, eraseColor: string): Tween {
		const val = BaseMode.getAnimateMode();

		const erasePuyo = this.getPuyo(coord);

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
	 * ツモ落下のTweenを取得
	 * @param {Tsumo} tsumo ツモ
	 * @param {Coordinate} axisToCoord 落下前の軸ぷよの座標
	 * @param {Coordinate} childToCoord 落下前の子ぷよの座標
	 * @returns {Tween[]}
	 */
	public getTsumoDropTween(tsumo: Tsumo, axisToCoord: Coordinate, childToCoord: Coordinate): Tween[] {
		const val = BaseMode.getAnimateMode();

		// ツモの座標位置 15,16,17 になるように
		const axisFromCoord = new Coordinate(tsumo.axisX, Field.Y_SIZE + 2 + tsumo.axisY);
		const childFromCoord = new Coordinate(tsumo.childX, Field.Y_SIZE + 2 + tsumo.childY);

		const tweens: Tween[] = [];

		// axis
		if (axisToCoord.y < Field.Y_SIZE) {
			const axisRemovePuyo = this.getPuyo(axisToCoord);
			const axisNewPuyo = new FieldPuyoShape(axisFromCoord, tsumo.axisColor);
			this._container.addChild(axisNewPuyo);

			this.setPuyo(axisToCoord, axisNewPuyo);
			
			//
			const axisFromCanvasCoord = FieldCanvas.getCanvasCoordinate(axisFromCoord);
			const axisToCanvasCoord = FieldCanvas.getCanvasCoordinate(axisToCoord);
			const axisTween = Tween.get(axisNewPuyo)
				.to({y: axisFromCanvasCoord.y})
				.to({y: axisToCanvasCoord.y}, FieldCanvas.DROP_VEL * (axisFromCoord.y - axisToCoord.y) * val)
				.call(() => { this._container.removeChild(axisRemovePuyo); });
			
			tweens.push(axisTween);
		}

		// child
		if (childToCoord.y < Field.Y_SIZE) {
			const childRemovePuyo = this.getPuyo(childToCoord);
			const childNewPuyo = new FieldPuyoShape(childFromCoord, tsumo.childColor);
			this._container.addChild(childNewPuyo);

			this.setPuyo(childToCoord, childNewPuyo);
			
			const childFromCanvasCoord = FieldCanvas.getCanvasCoordinate(childFromCoord);
			const childToCanvasCoord = FieldCanvas.getCanvasCoordinate(childToCoord);
			const childTween = Tween.get(childNewPuyo)
				.to({y: childFromCanvasCoord.y})
				.to({y: childToCanvasCoord.y}, FieldCanvas.DROP_VEL * (childFromCoord.y - childToCoord.y) * val)
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
	 * @param {Coordinate} axisToCoord 
	 * @param {Coordinate} childToCoord 
	 */
	public setGuide(tsumo: Tsumo, axisToCoord: Coordinate, childToCoord: Coordinate): void {
		this._axisGuide.update(axisToCoord, tsumo.axisColor);
		this._childGuide.update(childToCoord, tsumo.childColor);
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
		const iFrameColor = this._isModel ? Constant.TWO_PLAYER_FRAME_COLOR : Constant.ONE_PLAYER_FRAME_COLOR;
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
		const canvasCoord = FieldCanvas.getCanvasCoordinate(Field.DEAD_COORD).add(thickness + 0.5);
		crossShape.x = canvasCoord.x;
		crossShape.y = canvasCoord.y;
		return crossShape;
	}

	/**
	 * 座標からFieldPuyoShapeを取得
	 * @param {Coordinate} coord 座標
	 * @returns {FieldPuyoShape} 
	 */
	private getPuyo(coord: Coordinate): FieldPuyoShape {
		return this._puyoShapeArray[coord.y][coord.x];
	}

	/**
	 * 座標に新しくFieldPuyoShapeをセット
	 * ※座標に存在する古いFiledPuyoShapeが不要になる場合は予めcontainerからremoveしておくこと
	 * @param {Coordinate} coord 座標
	 * @param {FieldPuyoShape} fieldPuyoShape 
	 */
	private setPuyo(coord: Coordinate, fieldPuyoShape: FieldPuyoShape): void {
		this._puyoShapeArray[coord.y][coord.x] = fieldPuyoShape;
	}

	// static method
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
	private static formatScore(score: number): string {
		return (score + "").padStart(9, "0");
	}

	/**
	 * 停止のTimelineListを生成して返す。
	 * stepアニメーション時用
	 * @returns {TimelineList}
	 */
	public static createStopTlList(): TimelineList {
		const stopTlList = new TimelineList();
		const stopTl = new Timeline({paused: true});
		const stopTwn = Tween.get(new Shape()).wait(FieldCanvas.STEP_ERASE_TIME);
		stopTl.addTween(stopTwn);
		stopTlList.push(stopTl);
		return stopTlList;
	}

	/**
	 * フィールドの座標からcanvas上の座標を取得
	 * @param {Coordinate} coord フィールドの座標
	 * @returns {Coordinate} canvas上の座標
	 */
	public static getCanvasCoordinate(coord: Coordinate) {
		return coord.clone()
			.calculateY(FieldCanvas.convertY)
			.times(FieldCellShape.CELLSIZE);
	}
	
	// accessor
	set isEditable(isEditable: boolean) {
		this._isEditable = isEditable;
	}
}