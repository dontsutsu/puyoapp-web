import { Shape } from "@createjs/easeljs";
import { BasePuyo } from "../../../game/puyo/base_puyo";

/**
 * ぷよ用 createjs.Shape 基底クラス
 */
export class BasePuyoShape extends Shape {
	// CONSTANT
	private static readonly PUYO_DICT = [
		  { color: BasePuyo.GREEN , bgColor: "#68EE26", alpha: 1, borderColor: "#236F1A" }
		, { color: BasePuyo.RED   , bgColor: "#F34A49", alpha: 1, borderColor: "#852D20" }
		, { color: BasePuyo.BLUE  , bgColor: "#0C8EF9", alpha: 1, borderColor: "#254AB2" }
		, { color: BasePuyo.YELLOW, bgColor: "#FDBA2E", alpha: 1, borderColor: "#A44D0F" }
		, { color: BasePuyo.PURPLE, bgColor: "#B458EB", alpha: 1, borderColor: "#692797" }
		, { color: BasePuyo.OJAMA , bgColor: "#BBBBBB", alpha: 1, borderColor: "#69686E" }
		, { color: BasePuyo.NONE  , bgColor: "#FFFFFF", alpha: 0, borderColor: "#FFFFFF" }
	];
	protected static readonly THICKNESS_RATIO = 0.1;

	// CLASS FIELD
	private _color: string;
	private _radius: number;

	/**
	 * コンストラクタ
	 * @param {number} x createjs.Shape.x に設定する値
	 * @param {number} y createjs.Shape.y に設定する値
	 * @param {string} color 色
	 * @param {number} radius 半径
	 */
	constructor(x: number, y:number, color: string, radius: number) {
		super();
		this.x = x;
		this.y = y;
		this._color = color;
		this._radius = radius;
		this.setGraphics(color);
	}

	/**
	 * 指定の色でぷよを描画します。
	 * @param {string} color 色
	 */
	public setGraphics(color: string): void {
		const dict = BasePuyoShape.getDictionary(color);
		const r = this._radius;
		const t = r * BasePuyoShape.THICKNESS_RATIO;

		this.graphics
			.c()
			.s(dict.borderColor)
			.ss(t)
			.f(dict.bgColor)
			.dc(r + 0.5, r + 0.5, r - t);
		this.alpha = dict.alpha;
	}

	/**
	 * ステップ実行時の、消去されたぷよを描画します。
	 * @param {string} eraseColor 消去された色
	 */
	public setStepEraseGraphics(eraseColor: string): void {
		const dict = BasePuyoShape.getDictionary(eraseColor);
		const r = this.radius;
		const t = r * BasePuyoShape.THICKNESS_RATIO;
		
		this.graphics
			.c()
			.s(dict.bgColor)	// borderに本来のbgColor使用
			.ss(t)
			.f("#FFFFFF")
			.dc(r + 0.5, r + 0.5, r - t);
		this.alpha = 1;
	}

	/**
	 * 
	 * @param {string} color
	 * @returns {{ color: string, bgColor: string, alpha: number, borderColor: string }}
	 */
	public static getDictionary(color: string): { color: string, bgColor: string, alpha: number, borderColor: string } {
		const dict = BasePuyoShape.PUYO_DICT.find(dict => dict.color == color);
		if (dict == undefined) throw Error("illegal argument");
		return dict;
	}

	// ACCESSOR
	get color(): string {
		return this._color;
	}

	set color(color: string) {
		this._color = color;
	}

	get radius(): number {
		return this._radius;
	}
}
