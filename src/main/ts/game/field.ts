import { Timeline } from "@createjs/tweenjs";
import { FieldCanvas } from "../canvas/field_canvas";
import { NoticeCanvas } from "../canvas/notice_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { Coordinate } from "../util/coordinate";
import { EnumTsumoChildPosition } from "./enum_tsumo_child_position";
import { BasePuyo } from "./puyo/base_puyo";
import { FieldPuyo } from "./puyo/field_puyo";
import { PuyoConnect } from "./puyo/puyo_connect";
import { Tsumo } from "./tsumo";

export class Field {
	// constant
	public static readonly X_SIZE = 6;
	public static readonly Y_SIZE = 13;
	public static readonly DEAD_COORD = new Coordinate(2, 11);
	private static readonly CHAIN_BONUS = [0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512];
	private static readonly CONNECT_BONUS = [0, 2, 3, 4, 5, 6, 7, 10];
	private static readonly COLOR_BONUS = [0, 3, 6, 12, 24];

	public static readonly NULL_STRING = BasePuyo.NONE.repeat(Field.X_SIZE * Field.Y_SIZE);

	// property
	private _fieldArray: FieldPuyo[][];
	private _fieldCanvas: FieldCanvas;
	private _noticeCanvas: NoticeCanvas;
	private _totalScore: number;

	/**
	 * constructor
	 * @param {FieldCanvas} fieldCanvas
	 */
	constructor(fieldCanvas: FieldCanvas) {
		this._fieldCanvas = fieldCanvas;
		this._noticeCanvas = new NoticeCanvas();
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
		const coords = this.getDropTsumoCoordinate(tsumo);

		const axisToCoord = coords[1];
		const childToCoord = coords[0];

		if (axisToCoord.y < Field.Y_SIZE) this.setPuyo(axisToCoord, new FieldPuyo(tsumo.axisColor));
		if (childToCoord.y < Field.Y_SIZE) this.setPuyo(childToCoord, new FieldPuyo(tsumo.childColor));

		// アニメーション
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const tweenList = this._fieldCanvas.getTsumoDropTween(tsumo, axisToCoord.y, childToCoord.y);
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
			const dropScoreTween = this._fieldCanvas.getDropScoreTween(this._totalScore);
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
			if (score > 0)  { // scoreが0でない＝消したぷよがある
				const eraseScoreTween = this._fieldCanvas.getEraseScoreTween(erase, bonus);
				eraseTimeline.addTween(...eraseScoreTween);
			}
			timelineList.push(eraseTimeline);
		} while(score > 0);	// scoreが0でない＝消したぷよがあるため、ループ

		return timelineList;
	}

	/**
	 * フィールドの指定座標のぷよを変更します。
	 * @param {Coordinate} coord 座標
	 * @param {string} color 色
	 */
	public changeFieldPuyo(coord: Coordinate, color: string): void {
		this.setPuyo(coord, new FieldPuyo(color));
		
		// canvas
		this._fieldCanvas.changeFieldPuyo(coord, color);
	}

	/**
	 * フィールドをリセットします。
	 */
	public reset(): void {
		for (let y = 0; y < Field.Y_SIZE; y++) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				const coord = new Coordinate(x, y);
				this.changeFieldPuyo(coord, BasePuyo.NONE);
			}
		}
		this.setScore(0);
	}

	/**
	 * フィールドの文字列を取得します。
	 * @returns {string} フィールド文字列
	 */
	public toString(): string {
		let str = "";
		for (let y = 0; y < Field.Y_SIZE; y++) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				const coord = new Coordinate(x, y);
				str += this.getPuyo(coord).color;
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
			const coord = new Coordinate(x, y);
			this.changeFieldPuyo(coord, color);
		}
	}

	/**
	 * 各列の高さ（0～13）を格納した配列を取得します。
	 * @returns {number[]} 高さ（0～13）の配列
	 */
	public getHeights(): number[] {
		const heights: number[] = [];
		for (let x = 0; x < Field.X_SIZE; x++) {
			const y = this.getDropCoordinate(x).y;
			heights.push(y);
		}
		return heights;
	}

	/**
	 * 死んでいるかどうかを判定します。
	 * @returns {boolean} true：死んでいる / false：死んでいない
	 */
	public isDead(): boolean {
		return this.getPuyo(Field.DEAD_COORD).color != BasePuyo.NONE;
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
		this._fieldCanvas.setScore(score);
	}

	/**
	 * ガイドを非表示にします。
	 */
	public hideGuide(): void {
		this._fieldCanvas.hideGuide();
	}

	/**
	 * ガイドをセットします。
	 * @param {Tsumo} tsumo 
	 */
	public setGuide(tsumo: Tsumo): void {
		const coords = this.getDropTsumoCoordinate(tsumo);
		const axisToCoord = coords[1];
		const childToCoord = coords[0];
		this._fieldCanvas.setGuide(tsumo, axisToCoord, childToCoord);
	}

	/**
	 * フィールドで浮いているぷよを落とします。
	 * @returns {Timeline} 
	 */
	private drop(): Timeline {
		const timeline = new Timeline({paused: true});

		for (let y = 0; y < Field.Y_SIZE - 1; y++) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				const toCoord = new Coordinate(x, y);
				// 対象のぷよが "なし" 以外なら処理しない
				if (this.getPuyo(toCoord).color != BasePuyo.NONE) {
					continue;
				}

				const fromCoord = toCoord.clone();		// 落ちた先のy座標
				// 対象のぷよが "なし" の場合、上部の "なし" 以外のぷよを探す
				let dropPuyo: FieldPuyo;
				do {
					fromCoord.addY(1);
					dropPuyo = this.getPuyo(fromCoord);
				} while (fromCoord.y < Field.Y_SIZE - 1 && dropPuyo.color == BasePuyo.NONE);

				// 落下するぷよがなかった場合、処理しない
				if (dropPuyo.color == BasePuyo.NONE) {
					continue;
				}

				// 落ちる先の配列にぷよを格納
				this.setPuyo(toCoord, dropPuyo);
				
				// 落ちたあとの配列に空白を格納
				this.setPuyo(fromCoord, new FieldPuyo());

				// アニメーション
				const tween = this._fieldCanvas.getDropTween(x, fromCoord.y, toCoord.y);
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
				const coord = new Coordinate(x, y);
				this.getPuyo(coord).connect = null;
			}
		}

		// 連結数チェック
		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < Field.Y_SIZE - 1; y++) {
				const coord = new Coordinate(x, y);
				const preCoord = new Coordinate(-1, -1);
				this.check(coord, preCoord);
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
				const coord = new Coordinate(x, y);
				const puyo = this.getPuyo(coord);
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
				const coord = new Coordinate(x, y);
				const puyo = this.getPuyo(coord);
				if (puyo.connect != null && puyo.connect.isErasable()) {
					// 自分消去
					const eraseColor = puyo.color;
					puyo.color = BasePuyo.NONE;

					// アニメーション
					const tween = this._fieldCanvas.getErasetween(new Coordinate(x, y), eraseColor);
					timeline.addTween(tween);

					// おじゃま消去
					// up（13段目y=12のおじゃまぷよは消去しない）
					const uCoord = coord.clone().addY(1);
					if ((uCoord.y < Field.Y_SIZE - 1) && this.getPuyo(uCoord).color == BasePuyo.OJAMA) {
						this.setPuyo(uCoord, new FieldPuyo(BasePuyo.NONE));

						// アニメーション
						const tween = this._fieldCanvas.getErasetween(uCoord, BasePuyo.OJAMA);
						timeline.addTween(tween);
					}

					// down
					const dCoord = coord.clone().addY(-1);
					if ((dCoord.y >= 0) && this.getPuyo(dCoord).color == BasePuyo.OJAMA) {
						this.setPuyo(dCoord, new FieldPuyo(BasePuyo.NONE));

						// アニメーション
						const tween = this._fieldCanvas.getErasetween(dCoord, BasePuyo.OJAMA);
						timeline.addTween(tween);
					}

					// right
					const rCoord = coord.clone().addX(1);
					if ((rCoord.x < Field.X_SIZE) && this.getPuyo(rCoord).color == BasePuyo.OJAMA) {
						this.setPuyo(rCoord, new FieldPuyo(BasePuyo.NONE));

						// アニメーション
						const tween = this._fieldCanvas.getErasetween(rCoord, BasePuyo.OJAMA);
						timeline.addTween(tween);
					}

					// left
					const lCoord = coord.clone().addX(-1);
					if ((lCoord.x >= 0) && this.getPuyo(lCoord).color == BasePuyo.OJAMA) {
						this.setPuyo(lCoord, new FieldPuyo(BasePuyo.NONE));

						// アニメーション
						const tween = this._fieldCanvas.getErasetween(new Coordinate(x - 1, y), BasePuyo.OJAMA);
						timeline.addTween(tween);
					}
				}
			}
		}

		return timeline;
	}

	/**
	 * 連結数をチェックします。
	 * @param {Coordinate} coord チェックする座標
	 * @param {Coordinate} preCoord 1つ前にチェックした座標
	 */
	private check(coord: Coordinate, preCoord: Coordinate): void {
		const checkPuyo = this.getPuyo(coord);
		let connect;

		// connectがNULLでないとき、既にチェック済みなのでチェック不要
		if (checkPuyo.connect != null) {
			return;
		}

		// 色ぷよでないときはチェック不要
		if (checkPuyo.color == BasePuyo.NONE || checkPuyo.color == BasePuyo.OJAMA) {
			return;
		}

		if (preCoord.x == -1 && preCoord.y == -1) {
			connect = new PuyoConnect();
		} else {
			const prePuyo = this.getPuyo(preCoord);

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
		const uCoord = coord.clone().addY(1);
		if (uCoord.y < Field.Y_SIZE - 1) {
			this.check(uCoord, coord);
		}

		// down
		const dCoord = coord.clone().addY(-1);
		if (dCoord.y >= 0) {
			this.check(dCoord, coord);
		}

		// right
		const rCoord = coord.clone().addX(1);
		if (rCoord.x < Field.X_SIZE) {
			this.check(rCoord, coord);
		}

		// left
		const lCoord = coord.clone().addX(-1);
		if (lCoord.x >= 0) {
			this.check(lCoord, coord);
		}
	}

	/**
	 * 指定のツモを落としたときの座標を取得します。
	 * @param {Tsumo} tsumo 
	 * @returns {Coordinate[]} [0]：子ぷよの座標、[1]：軸ぷよの座標
	 */
	private getDropTsumoCoordinate(tsumo: Tsumo): Coordinate[] {
		let axisCoord: Coordinate;
		let childCoord: Coordinate;

		if (tsumo.tsumoChildPosition == EnumTsumoChildPosition.BOTTOM) {
			childCoord = this.getDropCoordinate(tsumo.childX);
			axisCoord = childCoord.clone().addY(1);
		} else if (tsumo.tsumoChildPosition == EnumTsumoChildPosition.TOP) {
			axisCoord = this.getDropCoordinate(tsumo.axisX);
			childCoord = axisCoord.clone().addY(1);
		} else {
			axisCoord = this.getDropCoordinate(tsumo.axisX);
			childCoord = this.getDropCoordinate(tsumo.childX);
		}

		return [childCoord, axisCoord];
	}

	/**
	 * 指定のx座標に落とせるy座標を取得します。
	 * @param {number} x x座標
	 * @returns {Coordinate} 座標
	 */
	private getDropCoordinate(x: number): Coordinate {
		const coord = new Coordinate(x, Field.Y_SIZE);
		for (; coord.y > 0; coord.addY(-1)) {
			const dCoord = coord.clone().addY(-1);
			if (this.getPuyo(dCoord).color != BasePuyo.NONE) break;
		}

		return coord;
	}

	private getPuyo(coord: Coordinate): FieldPuyo {
		return this._fieldArray[coord.y][coord.x];
	}

	private setPuyo(coord: Coordinate, fieldPuyo: FieldPuyo): void {
		this._fieldArray[coord.y][coord.x] = fieldPuyo;
	}
}