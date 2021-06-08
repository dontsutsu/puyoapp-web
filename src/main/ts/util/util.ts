/**
 * Utilityクラス
 */
export class Util {
	/**
	 * 角度（度数法）から正弦を取得します。
	 * @param {number} degree 角度（度数法）
	 * @returns {number} 正弦
	 */
	public static sin(degree: number): number {
		return Math.sin(degree * (Math.PI / 180));
	}

	/**
	 * 角度（度数法）から余弦を取得します。
	 * @param {number} degree 角度（度数法） 
	 * @returns {number} 余弦
	 */
	public static cos(degree: number): number {
		return Math.cos(degree * (Math.PI / 180));
	}

	/**
	 * 配列をシャッフルします。
	 * @param {T[]} array 配列
	 * @returns {T[]} 引数の配列をシャッフルした配列
	 */
	public static shuffle<T>(array: T[]): T[] {
		for (let i = array.length - 1; i >= 0; i--) {
			const j = Math.random() * (i + 1) | 0;
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	/**
	 * 0 ～ size-1 の範囲の整数をランダムに取得
	 * @param {number} size 
	 * @returns {number}
	 */
	public static getRandomNumber(size: number): number {
		return Math.random() * size | 0;
	}
}