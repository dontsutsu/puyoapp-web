import { TsumoListCellShape } from "../shape/tsumo_list_cell_shape";
import { TsumoListPuyoShape } from "../shape/tsumo_list_puyo_shape";
import { EditableMode } from "../../../mode/editable_mode";

import { Stage, Text } from "@createjs/easeljs";

/**
 * TsumoListクラス
 */
export class TsumoList {
	// クラス定数
	public static readonly X_SIZE = 5;
	public static readonly Y_SIZE = 2;

	private static readonly CANVAS_ID = "tsumoList";

	// インスタンス変数
	private _stage: Stage;
	private _tsumoListArray: TsumoListPuyoShape[][];

	/**
	 * コンストラクタ
	 */
	constructor() {
		this._tsumoListArray = [];

		// stage
		this._stage = new Stage(TsumoList.CANVAS_ID);
		this._stage.enableMouseOver();

		// number
		for (let y = 0; y < TsumoList.Y_SIZE; y++) {
			for (let x = 0; x < TsumoList.X_SIZE; x++) {
				const index = x + y * TsumoList.X_SIZE + 1;
				const numShape = new Text(String(index), "bold 14px BIZ UDPGothic", "#888888");
				const xy = TsumoListCellShape.getXandY(x, y, 0);
				numShape.x = xy.x + (TsumoListCellShape.CELLSIZE / 2);
				numShape.y = xy.y - (TsumoListCellShape.CELLSIZE / 2);
				numShape.textAlign = "center";
				this._stage.addChild(numShape);
			}
		}

		// cellshape
		for (let y = 0; y < TsumoList.Y_SIZE; y++) {
			for (let x = 0; x < TsumoList.X_SIZE; x++) {
				for (let t = 0; t < 2; t++) {	// child: t=0, axis: t=1
					const cellShape = new TsumoListCellShape(x, y, t);
					this._stage.addChild(cellShape);
				}
			}
		}

		// puyoShape
		for (let y = 0; y < TsumoList.Y_SIZE; y++) {
			for (let x = 0; x < TsumoList.X_SIZE; x++) {
				const tsumo = [];
				// 子
				const cPuyoShape = new TsumoListPuyoShape(x, y, "0", 0);
				this._stage.addChild(cPuyoShape);
				tsumo.push(cPuyoShape);

				// 親
				const aPuyoShape = new TsumoListPuyoShape(x, y, "0", 1);
				this._stage.addChild(aPuyoShape);
				tsumo.push(aPuyoShape);

				this._tsumoListArray.push(tsumo);
			}
		}

		this._stage.update();
	}

	/**
	 *
	 * @param mode
	 */
	public setEventTsumoListCellShape(mode: EditableMode): void {
		for (let child of this._stage.children) {
			if (child instanceof TsumoListCellShape) {
				let cellShape = child as TsumoListCellShape;

				cellShape.addEventListener("mousedown", () => {
					const selectColor = mode.getSelectColor();
					if (selectColor == "9") {
						return;
					}
					const x = cellShape.posx;
					const y = cellShape.posy;
					const index = x + TsumoList.X_SIZE * y;
					const type = cellShape.type;

					const puyoShape = this._tsumoListArray[index][type];

					puyoShape.color = selectColor;
					puyoShape.changeColor(selectColor);

					this._stage.update();
				});

				cellShape.addEventListener("mouseover", (e) => {
					cellShape.mouseover();
					this._stage.update();
				});

				cellShape.addEventListener("mouseout", (e) => {
					cellShape.mouseout();
					this._stage.update();
				});
			}
		}
	}

	/**
	 * ツモリストの文字列を取得します。
	 * @return 1手目軸ぷよ色、2手目子ぷよ色、2手目軸ぷよ色、・・・
	 */
	public toString(): string {
		let str = "";
		for (let i = 0; i < TsumoList.X_SIZE * TsumoList.Y_SIZE; i++) {
			// 軸ぷよが先、子ぷよが後
			str = str + this._tsumoListArray[i][1].color + this._tsumoListArray[i][0].color;
		}
		return str;
	}

	/**
	 * ツモリストが想定通りの入力となっているかをチェックします。
	 * ① 1ツモ目は必ず入力されていること
	 * ② 各ツモはペアで入力されていること（どちらかのみの入力はエラー）
	 * ③ 間に未入力のツモを挟まないこと（例：1,2ツモ目入力、3ツモ目未入力、4ツモ目入力はエラー）
	 * @return true：チェックOK / false：チェックNG
	 */
	public check(): boolean {
		let nullFlg = false;

		for (let i = 0; i < TsumoList.X_SIZE * TsumoList.Y_SIZE; i++) {
			const aCol = this._tsumoListArray[i][1].color;
			const cCol = this._tsumoListArray[i][0].color;

			// 1. 1ツモ目がnull, nullの場合はエラー
			if (i == 0 && aCol == "0" && cCol == "0") {
				return false;
			}

			// 2. どちらか一方がnullの場合はエラー
			if (aCol != "0" && cCol == "0" || aCol == "0" && cCol != "0") {
				return false;
			}

			// 3. null, nullのツモ以降に色ぷよが出てきたらエラー
			if (aCol == "0" && cCol == "0") {
				nullFlg = true;
				continue;
			}

			if (nullFlg && (aCol != "0" || cCol != "0")) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 指定したインデックスのツモを取得します。
	 * @param index ツモリストインデックス
	 * @return aColor：軸ぷよ色、cColor：子ぷよ色
	 */
	public getColor(index: number): { aColor: string, cColor: string } {
		const aColor = this._tsumoListArray[index][1].color;
		const cColor = this._tsumoListArray[index][0].color;
		return { aColor, cColor };
	}

	/**
	 * ツモリストの入力をクリアします。
	 */
	public clear(): void {
		for (let index = 0; index < TsumoList.Y_SIZE * TsumoList.X_SIZE; index++) {
			for (let type = 0; type < 2; type++) {
				const puyoShape = this._tsumoListArray[index][type];
				puyoShape.color = "0";
				puyoShape.changeColor("0");
				this._stage.update();
			}
		}
	}
}
