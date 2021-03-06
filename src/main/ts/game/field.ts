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

	// CLASS FIELD
	private _fieldArray: FieldPuyo[][];
	private _canvas: FieldCanvas;

	/**
	 * コンストラクタ
	 */
	constructor(canvas: FieldCanvas) {
		this._canvas = canvas;

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
	 * 
	 * @param tsumo 
	 */
	public dropTsumoToField(tsumo: Tsumo): void {
		if (tsumo.tsumoPosition == EnumTsumoPosition.BOTTOM) {
			this.dropTsumoPuyo(tsumo.childPuyo.color, tsumo.childX);
			this.dropTsumoPuyo(tsumo.axisPuyo.color, tsumo.axisX);
		} else {
			this.dropTsumoPuyo(tsumo.axisPuyo.color, tsumo.axisX);
			this.dropTsumoPuyo(tsumo.childPuyo.color, tsumo.childX);
		}	
	}

	/**
	 * フィールドのぷよを落とし、連鎖処理を実行します。
	 */
	public dropFieldPuyo(): TimelineList {
		const timelineList = new TimelineList();

		let erased: boolean;
		do {
			// 落とす処理
			const dropTimeline = this.drop();
			timelineList.push(dropTimeline);

			// 消す処理
			const erase = this.erase();
			erased = erase.erased;
			timelineList.push(erase.timeline);
		} while(erased);

		return timelineList;
	}

	/**
	 * フィールドの指定座標のぷよを変更します。
	 * @param x 
	 * @param y 
	 * @param color 
	 */
	public changeFieldPuyo(x: number, y: number, color: string): void {
		this._fieldArray[y][x].color = color;
		
		// canvas
		this._canvas.changeFieldPuyo(x, y, color);
	}

	/**
	 * フィールドで浮いているぷよを落とします。
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
	 * 消去可能な連結数以上のぷよを消去します。
	 * ぷよを消去したかどうかを返します。
	 * @return true：消去した / false：消去していない
	 */
	private erase(): {erased: boolean, timeline: Timeline} {
		let erased = false;
		const timeline = new Timeline({paused: true});

		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < Field.Y_SIZE - 1; y++) {
				this._fieldArray[y][x].connect = null;
			}
		}

		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < Field.Y_SIZE - 1; y++) {
				this.check(x, y, -1, -1);
			}
		}

		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 0; y < Field.Y_SIZE - 1; y++) {
				const puyo = this._fieldArray[y][x];
				if (puyo.connect != null && puyo.connect.isErasable()) {
					// 自分消去
					erased = true;
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

		return {erased, timeline};
	}

	/**
	 * 連結数をチェックします。
	 * @param x 
	 * @param y 
	 * @param prex 
	 * @param prey 
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
	 * 
	 * @param color 
	 * @param x 
	 */
	private dropTsumoPuyo(color: string, x: number): void {
		let y2 = Field.Y_SIZE - 1;
		for (let y = Field.Y_SIZE - 1; y >= 0; y--) {
			if (y == 0) {
				y2 = y;
			} else if (this._fieldArray[y - 1][x].color != BasePuyo.NONE) {
				y2 = y;
				break;
			}
		}
		this._fieldArray[y2][x] = new FieldPuyo(color);
	}
}