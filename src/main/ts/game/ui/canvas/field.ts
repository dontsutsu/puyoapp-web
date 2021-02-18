import { Game } from "../../game";
import { Tsumo } from "./tsumo";
import { PuyoTimelineList } from "../timeline/puyo_timeline_list";
import { FieldPuyoShape, Connect } from "../shape/puyo_shape";
import { FieldCellShape } from "../shape/cell_shape";

import { Stage, Container, Ticker, Shape } from "@createjs/easeljs";
import { Timeline, Tween } from "@createjs/tweenjs";

/**
 * Fieldクラス
 */
export class Field {
	// クラス定数
	public static readonly X_SIZE = 6;
	public static readonly Y_SIZE = 13;

	private static readonly CANVAS_ID = "field";

	// インスタンス変数
	private _game: Game;
	private _fieldArray: FieldPuyoShape[][];
	private _stage: Stage;
	private _container: Container;

	/**
	 * コンストラクタ
	 * @param game ゲーム
	 */
	constructor(game: Game, isClickable: boolean) {
		this._game = game;
		this._fieldArray = [];

		// stage
		this._stage = new Stage(Field.CANVAS_ID);
		this._stage.enableMouseOver();
		Ticker.addEventListener("tick", this._stage);

		// 傾けた分の計算
		const deg = 5;
		const cos = Math.cos(deg * (Math.PI / 180));
		const sin = Math.sin(deg * (Math.PI / 180));
		const yy = 250 * sin;

		// frame
		const frame1 = new Shape();
		frame1.graphics
			.f("#E0E0E0")
			.rr(0.5, 0.5, 250 / cos, 495 + 250 * sin, 12.5);
		frame1.y = yy;
		frame1.skewY = deg * (-1);
		const frame2 = new Shape();
		frame2.graphics
			.f("#EE808D")
			.rr(5.5, 5.5, 240 / cos, 485 + 240 * sin, 10);
		frame2.y = yy;
		frame2.skewY = deg * (-1);
		this._stage.addChild(frame1, frame2);

		// container
		this._container = new Container();
		this._container.x = 20;
		this._container.y = 20 + yy;

		// CellShape
		for (let y = 0; y < Field.Y_SIZE; y++) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				const cellShape = new FieldCellShape(x, y);
				this._container.addChild(cellShape);

				if (isClickable) {
					cellShape.addEventListener("mousedown", () => {
						const beforeField = this.toString();

						const x = cellShape.posx;
						const y = cellShape.posy;

						const puyoShape = this._fieldArray[y][x];
						const selectColor = this._game.getSelectColor();

						puyoShape.color = selectColor;
						puyoShape.changeColor(selectColor);

						const afterField = this.toString();
						
						// UNDOの履歴を残す
						if (beforeField != afterField) this._game.pushUndoStack(beforeField);
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


		// PuyoShape
		for (let y = 0; y < Field.Y_SIZE; y++) {
			let yarray = [];
			for (let x = 0; x < Field.X_SIZE; x++) {
				const puyoShape = new FieldPuyoShape(x, y, "0");
				this._container.addChild(puyoShape);
				yarray.push(puyoShape);
			}
			this._fieldArray.push(yarray);
		}

		this._stage.addChild(this._container);
	}

	/**
	 * フィールドを設定します。
	 * @param fieldStr フィールド文字列
	 */
	public setField(fieldStr: string): void {
		for (let i = 0; i < fieldStr.length; i++) {
			const color = fieldStr.charAt(i);

			const x = i % Field.X_SIZE;
			const y = Field.Y_SIZE - Math.floor(i / Field.X_SIZE) - 1;

			const puyoShape = this._fieldArray[y][x];
			puyoShape.color = color;
			puyoShape.changeColor(color);
		}
	}

	/**
	 * フィールドをクリアします。
	 */
	public clear(): void {
		for (let y = 0; y < Field.Y_SIZE; y++) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				const puyoShape = this._fieldArray[y][x];
				puyoShape.color = "0";
				puyoShape.changeColor("0");
			}
		}
	}

	/**
	 * ぷよを落とし、消去します。
	 * @param puyoTlList PuyoTimeLineのリスト
	 */
	public drop(puyoTlList: PuyoTimelineList): void {
		// 落とす
		this.dropfield(puyoTlList);
		let erased = this.erase(puyoTlList);

		while (erased) {
			this.dropfield(puyoTlList);
			erased = this.erase(puyoTlList);
		}
	}

	/**
	 * フィールドのぷよを下へ落とします。
	 * @param puyoTlList PuyoTimeLineのリスト
	 */
	private dropfield(puyoTlList: PuyoTimelineList): void {
		const timeline = new Timeline({paused:true});

		for (let y = Field.Y_SIZE - 1; y > 0; y--) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				// 対象のぷよが "なし" 以外なら処理しない
				if (this._fieldArray[y][x].color != "0") {
					continue;
				}

				// 対象のぷよが "なし" の場合、上部の "なし" 以外のぷよを探す
				let y2 = y;
				do {
					y2--;
				} while (y2 > 0 && this._fieldArray[y2][x].color == "0");

				const color = this._fieldArray[y2][x].color;

				// 落下するぷよがなかった場合、処理しない
				if (color == "0") {
					continue;
				}

				this._fieldArray[y][x] = this._fieldArray[y2][x];

				const puyoShape = new FieldPuyoShape(x, y2, "0");
				this._container.addChild(puyoShape);
				this._fieldArray[y2][x] = puyoShape;

				const tween = this._fieldArray[y][x].getDropTween(y, y2);
				timeline.addTween(tween);
			}
		}

		puyoTlList.push(timeline);
	}

	/**
	 * フィールドのぷよを消去します
	 * @param puyoTlList PuyoTimeLineのリスト
	 * @return true：消去した / false：消去していない
	 */
	private erase(puyoTlList: PuyoTimelineList): boolean {
		let erased = false;

		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 1; y < Field.Y_SIZE; y++) {
				this._fieldArray[y][x].connect = null;
			}
		}

		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 1; y < Field.Y_SIZE; y++) {
				this.check(x, y, -1, -1);
			}
		}

		const timeline = new Timeline({paused:true});

		for (let x = 0; x < Field.X_SIZE; x++) {
			for (let y = 1; y < Field.Y_SIZE; y++) {
				const puyoShape = this._fieldArray[y][x];
				if (puyoShape.connect != null && puyoShape.connect.isErasable()) {
					// 自分消去
					erased = true;
					const tween = puyoShape.getEraseTween();
					timeline.addTween(tween);

					// おじゃま消去
					// down
					if ((y + 1 <= Field.Y_SIZE - 1) && this._fieldArray[y + 1][x].color == "9") {
						const tween = this._fieldArray[y + 1][x].getEraseTween();
						timeline.addTween(tween);
					}

					// up
					if ((y - 1 > 0) && this._fieldArray[y - 1][x].color == "9") {
						const tween = this._fieldArray[y - 1][x].getEraseTween();
						timeline.addTween(tween);
					}

					// right
					if ((x + 1 < Field.X_SIZE) && this._fieldArray[y][x + 1].color == "9") {
						const tween = this._fieldArray[y][x + 1].getEraseTween();
						timeline.addTween(tween);
					}

					// left
					if ((x - 1 >= 0) && this._fieldArray[y][x - 1].color == "9") {
						const tween = this._fieldArray[y][x - 1].getEraseTween();
						timeline.addTween(tween);
					}
				}
			}
		}

		puyoTlList.push(timeline);
		return erased;
	}

	/**
	 * ぷよの連結数をチェックします。
	 * この関数を再帰的に呼び出して行います。
	 * @param x チェックを行うセルのx座標
	 * @param y チェックを行うセルのy座標
	 * @param prex 1つ前にチェックを行ったセルのx座標
	 * @param prey 1つ前にチェックを行ったセルのy座標
	 */
	private check(x: number, y: number, prex: number, prey: number): void {

		const current = this._fieldArray[y][x];
		let connect;
		const c = current.color;

		if (current.connect != null) {
			return;
		}

		if (c == "0" || c == "9") {
			return;
		}

		let pre;

		if (prex == -1 && prey == -1) {
			connect = new Connect();
		} else {
			pre = this._fieldArray[prey][prex];

			if (current.color != pre.color) {
				return;
			}

			connect = pre.connect as Connect;	// nullではない前提なのでConnectでcast
			connect.increment();
		}

		current.connect = connect;

		// down
		if (y + 1 < Field.Y_SIZE) {
			this.check(x, y + 1, x, y);
		}

		// up
		if (y - 1 >= 1) {
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
	 * フィールド情報を文字列で取得します。
	 * @return フィールド文字列 [1段目1列目、1段目2列目、・・・、1段目6列目、2段目1列目、・・・、13段目6列目]
	 */
	public toString(): string {
		let str = "";
		for (let y = Field.Y_SIZE - 1; y >= 0; y--) {
			for (let x = 0; x < Field.X_SIZE; x++) {
				str = str + this._fieldArray[y][x].color;
			}
		}
		return str;
	}

	/**
	 * フィールドの高さを取得します。
	 * @return 各列の高さを格納した配列
	 */
	public getHeights(): number[] {
		let heights = [];

		for (let x = 0; x < Field.X_SIZE; x++) {
			let height = 0;
			for (let y = Field.Y_SIZE - 1; y >= 0; y--) {
				if (this._fieldArray[y][x].color == "0") {
					break;
				} else {
					height++;
				}
			}
			heights.push(height);
		}
		return heights;
	}

	/**
	 * 指定のツモをフィールドに落とします。
	 * @param tsumo ツモ
	 * @param puyoTlList
	 */
	public dropTsumo(tsumo: Tsumo, puyoTlList: PuyoTimelineList) {
		let pFieldPuyoShape = new FieldPuyoShape(tsumo.aPuyoShape.tsumo_x, -5 + tsumo.aPuyoShape.tsumo_y, tsumo.aPuyoShape.color);
		let cFieldPuyoShape = new FieldPuyoShape(tsumo.cPuyoShape.tsumo_x, -5 + tsumo.cPuyoShape.tsumo_y, tsumo.cPuyoShape.color);
		this._container.addChild(pFieldPuyoShape, cFieldPuyoShape);

		let timeline = new Timeline({paused:true});
		if (tsumo.aPuyoShape.tsumo_y > tsumo.cPuyoShape.tsumo_y) {
			let tween1 = this.setPuyoAndGetTween(pFieldPuyoShape);
			let tween2 = this.setPuyoAndGetTween(cFieldPuyoShape);
			timeline.addTween(tween1);
			timeline.addTween(tween2);
		} else {
			let tween1 = this.setPuyoAndGetTween(cFieldPuyoShape);
			let tween2 = this.setPuyoAndGetTween(pFieldPuyoShape);
			timeline.addTween(tween1);
			timeline.addTween(tween2);
		}

		puyoTlList.push(timeline);
		this.drop(puyoTlList);
	}

	/**
	 * @param fieldPuyoShape
	 */
	private setPuyoAndGetTween(fieldPuyoShape: FieldPuyoShape): Tween {
		const x = fieldPuyoShape.posx;
		let y2 = 0;
		for (let y = 0; y < Field.Y_SIZE; y++) {
			if (y == Field.Y_SIZE - 1) {
				y2 = y;
			} else if (this._fieldArray[y + 1][x].color != "0") {
				y2 = y;
				break;
			}
		}
		this._fieldArray[y2][x] = fieldPuyoShape;
		const tween = fieldPuyoShape.getDropTween(y2, fieldPuyoShape.posy);
		return tween;
	}

}
