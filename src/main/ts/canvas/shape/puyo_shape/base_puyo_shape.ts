import { Shape } from "@createjs/easeljs";
import { BasePuyo } from "../../../game/puyo/base_puyo";

/**
 * ぷよ用 createjs.Shape 基底クラス
 */
export class BasePuyoShape extends Shape {
	public static readonly PUYO_DICT = [
		  { color: BasePuyo.GREEN , bgColor: "#68EE26", alpha: 1, borderColor: "#236F1A" }
		, { color: BasePuyo.RED   , bgColor: "#F34A49", alpha: 1, borderColor: "#852D20" }
		, { color: BasePuyo.BLUE  , bgColor: "#0C8EF9", alpha: 1, borderColor: "#254AB2" }
		, { color: BasePuyo.YELLOW, bgColor: "#FDBA2E", alpha: 1, borderColor: "#A44D0F" }
		, { color: BasePuyo.PURPLE, bgColor: "#B458EB", alpha: 1, borderColor: "#692797" }
		, { color: BasePuyo.OJAMA , bgColor: "#BBBBBB", alpha: 1, borderColor: "#69686E" }
		, { color: BasePuyo.NONE  , bgColor: "#FFFFFF", alpha: 0, borderColor: "#FFFFFF" }
	];

	private _color: string;
	private _cellsize: number;

	/**
	 * @param color 色
	 * @param cellsize セルサイズ
	 */
	constructor(color: string, cellsize: number) {
		super();
		this._cellsize = cellsize;
		this._color = color;
		this.setGraphics(color, cellsize);
	}

	/**
	 * 描画します。
	 * @param color 色
	 * @param cellsize セルサイズ
	 */
	private setGraphics(color: string, cellsize: number): void {
		const dict = BasePuyoShape.PUYO_DICT.find(dict => dict.color === color);
		if (dict === undefined) throw Error("illegal argument");

		this.graphics
			.s(dict.borderColor)
			.ss(cellsize / 20)
			.f(dict.bgColor)
			.dc(cellsize / 2 + 0.5, cellsize / 2 + 0.5, (cellsize - 2) / 2);
		this.alpha = dict.alpha;
	}

	/**
	 * ぷよの色を変更します。
	 * @param color 色
	 */
	public changeColor(color: string): void{
		const cellsize = this._cellsize;
		this.graphics
			.c();
		this.setGraphics(color, cellsize);
	}

	// ACCESSOR
	get color(): string {
		return this._color;
	}

	set color(color: string) {
		this._color = color;
	}

	get cellsize(): number {
		return this._cellsize;
	}
}