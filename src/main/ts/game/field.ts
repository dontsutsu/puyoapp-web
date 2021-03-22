import { Timeline } from "@createjs/tweenjs";
import { FieldCanvas } from "../canvas/field_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { EnumTsumoPosition } from "./enum_tsumo_position";
import { BasePuyo } from "./puyo/base_puyo";
import { FieldPuyo } from "./puyo/field_puyo";
import { PuyoConnect } from "./puyo/puyo_connect";
import { Tsumo } from "./tsumo";

export class Field {
	// CONSTANT
	public static readonly X_SIZE = 6;
	public static readonly Y_SIZE = 13;
	public static readonly DEAD_X = 2;
	public static readonly DEAD_Y = 11;
	private static readonly CHAIN_BONUS = [0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512];
	private static readonly CONNECT_BONUS = [0, 2, 3, 4, 5, 6, 7, 10];
	private static readonly COLOR_BONUS = [0, 3, 6, 12, 24];

	// CLASS FIELD
	private _fieldArray: FieldPuyo[][];
	private _canvas: FieldCanvas;
	private _totalScore: number;

	/**
	 * コンストラクタ
	 * @param {FieldCanvas} canvas
	 */
	constructor(canvas: FieldCanvas) {
		this._canvas = canvas;
		this._totalScore = 0;

		this._fieldArray = [];
		for (let y = 0; y < Field.Y_SIZE; y++) {
			const yarray = [];
			for (let x = 0; x < Field.X_SIZE; x++) {
				yarray.push(new FieldPuyo());
			}
			this._fieldArray.push(yarray);
		}
	}

	/**
	 * ツモをフィールドに落とします。
	 * @param {Tsumo} tsumo ツモ
	 * @returns {TimelineList} 
	 */
	public dropTsumoToField(tsumo: Tsumo): TimelineList {
		const {axisToY, childToY} = this.getDropTsumoToY(tsumo);
		if (axisToY < Field.Y_SIZE) this._fieldArray[axisToY][tsumo.axisX].color = tsumo.axisColor;
		if (childToY < Field.Y_SIZE) this._fieldArray[childToY][tsumo.childX].color = tsumo.childColor;

		// アニメーション
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const tweenList = this._canvas.getTsumoDropTween(tsumo, axisToY, childToY);
		timeline.addTween(...tweenList);
		timelineList.push(timeline);
		return timelineList;
	}

	/**
	 * フィールドのぷよを落とし、連鎖処理を実行します。
	 * @returns {TimelineList}
	 */
	public dropFieldPuyo(): TimelineList {
		const timelineList = new TimelineList();

		let chain = 0;
		let score = 0;
		do {
			chain++;

			// 落とす処理
			const dropTimeline = this.drop();
			const dropScoreTween = this._canvas.getDropScoreTween(this._totalScore);
			dropTimeline.addTween(...dropScoreTween);
			timelineList.push(dropTimeline);

			// 消す処理 
			// １．連結数チェック
			this.connectCheck();

			// ２．得点計算
			const {erase, bonus} = this.calcScore(chain);
			score = erase * bonus * 10;
			this._totalScore += score;

			// ３．消去
			const eraseTimeline = this.erase();
			if (score > 0)  {
				const eraseScoreTween = this._canvas.getEraseScoreTween(erase, bonus);
				eraseTimeline.addTween(...eraseScoreTween);
			}
			timelineList.push(eraseTimeline);
		} while(score > 0);	// scoreが0でない＝消したぷよがあるため、ループ

		return timelineList;
	}

	/**
	 * フィールドの指定座標のぷよを変更します。
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} color 
	 */
	public changeFieldPuyo(x: number, y: number, color: string): void {
		this._fieldArray[y][x].color = color;
		
		// canvas
		this._canvas.changeFieldPuyo(x, y, color);
	}

	/**
	 * フィールドをリセットします。
	 */
	public reset(): void {
		for (let y = 0; y < Field.Y_SIZE; y++) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				this.changeFieldPuyo(x, y, BasePuyo.NONE);
			}
		}
	}

	/**
	 * フィールドの文字列を取得します。
	 * @returns {string} フィールド文字列
	 */
	public toString(): string {
		let str = "";
		for (let y = 0; y < Field.Y_SIZE; y++) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				str += this._fieldArray[y][x].color;
			}
		}
		return str;
	}

	/**
	 * フィールド文字列から、フィールドを設定します。
	 * @param {string} fieldStr フィールド文字列
	 */
	public setField(fieldStr: string): void {
		for (let i = 0; i < fieldStr.length; i++) {
			const color = fieldStr.charAt(i);
			const x = i % Field.X_SIZE;
			const y = i / Field.X_SIZE | 0;
			this.changeFieldPuyo(x, y, color);
		}
	}

	/**
	 * 各列の高さ（0～13）を格納した配列を取得します。
	 * @returns {number[]} 高さ（0～13）の配列
	 */
	public getHeights(): number[] {
		const heights = [];
		for (let x = 0; x < Field.X_SIZE; x++) {
			const y = this.getDropPuyoToY(x);
			heights.push(y);
		}
		return heights;
	}

	/**
	 * 死んでいるかどうかを判定します。
	 * @returns {boolean} true：死んでいる / false：死んでいない
	 */
	public isDead(): boolean {
		return this._fieldArray[Field.DEAD_Y][Field.DEAD_X].color != BasePuyo.NONE;
	}

	/**
	 * スコアを取得します。
	 * @returns {number} スコア
	 */
	public getScore(): number {
		return this._totalScore;
	}

	/**
	 * スコアを設定します。
	 * @param {number} score スコア
	 */
	public setScore(score: number): void {
		this._totalScore = score;
		this._canvas.setScore(score);
	}

	public setGuideNoAnimation(tsumo: Tsumo): void {
		const {axisToY, childToY} = this.getDropTsumoToY(tsumo);
		this._canvas.setGuide(tsumo, axisToY, childToY);
	}

	/**
	 * @returns {TimelineList}
	 */
	public hideGuide(): TimelineList {
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const hideGuideTween = this._canvas.getHideGuideTween();
		timeline.addTween(...hideGuideTween);
		timelineList.push(timeline);
		return timelineList;
	}

	/**
	 * 
	 * @param {Tsumo} tsumo 
	 * @returns {TimelineList}
	 */
	public setGuide(tsumo: Tsumo): TimelineList {
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});

		const {axisToY, childToY} = this.getDropTsumoToY(tsumo);
		const setGuideTween = this._canvas.getSetGuideTween(tsumo, axisToY, childToY);

		timeline.addTween(...setGuideTween);
		timelineList.push(timeline);
		return timelineList;
	}

	/**
	 * フィールドで浮いているぷよを落とします。
	 * @returns {Timeline} 
	 */
	private drop(): Timeline {
		const timeline = new Timeline({paused: true});

		for (let y = 0; y < Field.Y_SIZE - 1; y++) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				// 対象のぷよが "なし" 以外なら処理しない
				if (this._fieldArray[y][x].color != BasePuyo.NONE) {
					continue;
				}

				const toY = y;	// 落ちる前のy座標
				let fromY = y;		// 落ちた先のy座標
				// 対象のぷよが "なし" の場合、上部の "なし" 以外のぷよを探す
				let dropPuyo: FieldPuyo;
				do {
					fromY++;
					dropPuyo = this._fieldArray[fromY][x];
				} while (fromY < Field.Y_SIZE - 1 && dropPuyo.color == BasePuyo.NONE);

				// 落下するぷよがなかった場合、処理しない
				if (dropPuyo.color == BasePuyo.NONE) {
					continue;
				}

				// 落ちる先の配列にぷよを格納
				this._fieldArray[toY][x] = dropPuyo;
				
				// 落ちたあとの配列に空白を格納
				this._fieldArray[fromY][x] = new FieldPuyo();

				// アニメーション
				const tween = this._canvas.getDropTween(x, fromY, toY);
				timeline.addTween(tween);
			}
		}
		return timeline;
	}

	/**
	 * 連結数のチェック処理
	 */
	private connectCheck(): void {
		// 連結数をリセット
		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < Field.Y_SIZE - 1; y++) {
				this._fieldArray[y][x].connect = null;
			}
		}

		// 連結数チェック
		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < Field.Y_SIZE - 1; y++) {
				this.check(x, y, -1, -1);
			}
		}
	}

	/**
	 * 得点を計算し、返します。
	 * 得点表示用に、消去数とボーナス倍率を返します。
	 * @param {number} chain 連鎖数
	 * @returns {erase: number, bonus: number} erase：消去数、bonus：ボーナス倍率
	 */
	private calcScore(chain: number): {erase: number, bonus: number} {
		// 得点計算に必要な変数設定
		const connectArray: PuyoConnect[] = [];	// 連結数の配列
		const colorArray: string[] = [];		// 消去した色の配列

		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < Field.Y_SIZE - 1; y++) {
				const puyo = this._fieldArray[y][x];
				if (puyo.connect != null && puyo.connect.isErasable()) {
					// 得点計算の処理
					if (!connectArray.includes(puyo.connect)) connectArray.push(puyo.connect);
					if (!colorArray.includes(puyo.color)) colorArray.push(puyo.color);
				}
			}
		}

		// 連結数の配列が空の場合（＝消去できるものがなかった場合）、得点は0
		if (connectArray.length == 0) return {erase: 0, bonus: 1};

		// 消去数
		const erase = connectArray.reduce((sum, connect) => { return sum + connect.size; }, 0);

		// 連結ボーナス
		let connectBonus = 0;
		for (const connect of connectArray) {
			const index = (connect.size > 11 ? 11 : connect.size) - 4;
			connectBonus += Field.CONNECT_BONUS[index];
		}
		
		// 色数ボーナス
		const colorBonus = Field.COLOR_BONUS[colorArray.length - 1];

		// 連鎖ボーナス
		const chainBonus = Field.CHAIN_BONUS[chain - 1];
		
		// ボーナス合計
		let bonus = connectBonus + colorBonus + chainBonus;
		if (bonus == 0) bonus = 1;

		return {erase, bonus};
	}

	/**
	 * 消去可能な連結数以上のぷよを消去します。
	 * @returns {Timeline} 
	 */
	private erase(): Timeline {
		const timeline = new Timeline({paused: true});
		
		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < Field.Y_SIZE - 1; y++) {
				const puyo = this._fieldArray[y][x];
				if (puyo.connect != null && puyo.connect.isErasable()) {
					// 自分消去
					const eraseColor = puyo.color;
					puyo.color = BasePuyo.NONE;

					// アニメーション
					const tween = this._canvas.getErasetween(x, y, eraseColor);
					timeline.addTween(tween);

					// おじゃま消去
					// up（13段目y=12のおじゃまぷよは消去しない）
					if ((y + 1 < Field.Y_SIZE - 1) && this._fieldArray[y + 1][x].color == BasePuyo.OJAMA) {
						const ojamaPuyoShape = this._fieldArray[y + 1][x];
						ojamaPuyoShape.color = BasePuyo.NONE;

						// アニメーション
						const tween = this._canvas.getErasetween(x, y + 1, BasePuyo.OJAMA);
						timeline.addTween(tween);
					}

					// down
					if ((y - 1 >= 0) && this._fieldArray[y - 1][x].color == BasePuyo.OJAMA) {
						const ojamaPuyoShape = this._fieldArray[y - 1][x];
						ojamaPuyoShape.color = BasePuyo.NONE;

						// アニメーション
						const tween = this._canvas.getErasetween(x, y - 1, BasePuyo.OJAMA);
						timeline.addTween(tween);
					}

					// right
					if ((x + 1 < Field.X_SIZE) && this._fieldArray[y][x + 1].color == BasePuyo.OJAMA) {
						const ojamaPuyoShape = this._fieldArray[y][x + 1];
						ojamaPuyoShape.color = BasePuyo.NONE;

						// アニメーション
						const tween = this._canvas.getErasetween(x + 1, y, BasePuyo.OJAMA);
						timeline.addTween(tween);
					}

					// left
					if ((x - 1 >= 0) && this._fieldArray[y][x - 1].color == BasePuyo.OJAMA) {
						const ojamaPuyoShape = this._fieldArray[y][x - 1];
						ojamaPuyoShape.color = BasePuyo.NONE;

						// アニメーション
						const tween = this._canvas.getErasetween(x - 1, y, BasePuyo.OJAMA);
						timeline.addTween(tween);
					}
				}
			}
		}

		return timeline;
	}

	/**
	 * 連結数をチェックします。
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} prex 
	 * @param {number} prey 
	 */
	private check(x: number, y: number, prex: number, prey: number): void {

		const checkPuyo = this._fieldArray[y][x];
		let connect;

		// connectがNULLでないとき、既にチェック済みなのでチェック不要
		if (checkPuyo.connect != null) {
			return;
		}

		// 色ぷよでないときはチェック不要
		if (checkPuyo.color == BasePuyo.NONE || checkPuyo.color == BasePuyo.OJAMA) {
			return;
		}

		if (prex == -1 && prey == -1) {
			connect = new PuyoConnect();
		} else {
			const prePuyo = this._fieldArray[prey][prex];

			// 色が異なる場合、再帰チェックしない
			if (checkPuyo.color != prePuyo.color) {
				return;
			}

			connect = prePuyo.connect as PuyoConnect;	// nullではない前提なのでPuyoConnectでcast
			connect.increment();
		}

		checkPuyo.connect = connect;

		// 以下、四方向に再帰チェック

		// up（13段目y=12のぷよは連結数チェックしない）
		if (y + 1 < Field.Y_SIZE - 1) {
			this.check(x, y + 1, x, y);
		}

		// down
		if (y - 1 >= 0) {
			this.check(x, y - 1, x, y);
		}

		// right
		if (x + 1 < Field.X_SIZE) {
			this.check(x + 1, y, x, y);
		}

		// left
		if (x - 1 >= 0) {
			this.check(x - 1, y, x, y);
		}
	}

	/**
	 * 指定のツモを落としたときのy座標を取得します。
	 * @param {Tsumo} tsumo 
	 * @returns {axisToY: number, childToY: number} axisToY：軸ぷよの落下先y座標、childToY：子ぷよの落下先y座標
	 */
	private getDropTsumoToY(tsumo: Tsumo): {axisToY: number, childToY: number} {
		let axisToY: number;
		let childToY: number;

		if (tsumo.tsumoPosition == EnumTsumoPosition.BOTTOM) {
			childToY = this.getDropPuyoToY(tsumo.childX);
			axisToY = childToY + 1;
		} else if (tsumo.tsumoPosition == EnumTsumoPosition.TOP) {
			axisToY = this.getDropPuyoToY(tsumo.axisX);
			childToY = axisToY + 1;
		} else {
			axisToY = this.getDropPuyoToY(tsumo.axisX);
			childToY = this.getDropPuyoToY(tsumo.childX);
		}

		return {axisToY, childToY};
	}

	/**
	 * 指定のx座標に落とせるy座標を取得します。
	 * @param {number} x x座標
	 * @returns {number} y座標
	 */
	private getDropPuyoToY(x: number): number {
		let y2 = Field.Y_SIZE;
		for (let y = y2; y >= 0; y--) {
			if (y == 0) {
				y2 = y;
			} else if (this._fieldArray[y - 1][x].color != BasePuyo.NONE) {
				y2 = y;
				break;
			}
		}
		return y2;
	}
}