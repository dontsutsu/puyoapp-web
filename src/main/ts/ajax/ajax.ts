import $ from "jquery";

/**
 * Ajax
 */
export class Ajax {
	/**
	 * サーバへなぞぷよの解答を問い合わせます。
	 * @param fieldStr フィールド文字列
	 * @param tsumoListStr ツモリスト文字列
	 * @param nazoType なぞぷよのお題
	 * @param nazoRequire お題の条件
	 */
	static searchCorrect(fieldStr: string, tsumoListStr: string, nazoType: string, nazoRequire: string): JQuery.jqXHR<any> {
		const data = {
			field: fieldStr,
			tsumoList: tsumoListStr,
			nazoType: nazoType,
			nazoRequire: nazoRequire
		};

		return $.ajax({
			type: "POST",
			url: "/search",
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: "json"
		});
	}
}
