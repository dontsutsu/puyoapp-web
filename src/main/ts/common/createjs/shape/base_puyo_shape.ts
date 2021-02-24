import { Shape } from "@createjs/easeljs";

/**
 * ぷよ用 createjs.Shape 基底クラス
 */
export class BasePuyoShape extends Shape {
	public static readonly PUYO_DICT: { [key: string]: [string, number, string] } = {
		"1" : ["#68EE26", 1, "#236F1A"],
		"2" : ["#F34A49", 1, "#852D20"],
		"3" : ["#0C8EF9", 1, "#254AB2"],
		"4" : ["#FDBA2E", 1, "#A44D0F"],
		"5" : ["#B458EB", 1, "#692797"],
		"9" : ["#DDDDDD", 1, "#69686E"],
		"0" : ["#FFFFFF", 0, "#FFFFFF"]
	};

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
		this.graphics
			.s(BasePuyoShape.PUYO_DICT[color][2])
			.ss(cellsize / 20)
			.f(BasePuyoShape.PUYO_DICT[color][0])
			.dc(cellsize / 2 + 0.5, cellsize / 2 + 0.5, (cellsize - 2) / 2);
		this.alpha = BasePuyoShape.PUYO_DICT[color][1];
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

	////////////////////////////////
	// setter / getter
	////////////////////////////////

	get color(): string {
		return this._color;
	}

	set color(color: string) {
		this._color = color;
	}
}
