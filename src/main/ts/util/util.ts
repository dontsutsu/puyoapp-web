import $ from "jquery";

export class Util {
	/**
	 * 角度（度数法）から正弦を取得します。
	 * @param degree 角度（度数法） 
	 */
	public static sin(degree: number): number {
		return Math.sin(degree * (Math.PI / 180));
	}

	/**
	 * 角度（度数法）から余弦を取得します。
	 * @param degree 角度（度数法） 
	 */
	public static cos(degree: number): number {
		return Math.cos(degree * (Math.PI / 180));
	}

	/**
	 * @return 1：アニメーション、0：ステップ
	 */
	 public static getAnimateMode(): number {
		return $("input:radio[name='animation']:checked").val() as number;
	}
}