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
	 * 
	 * @param workList 
	 */
	public static shuffle([...array]) {
		for (let i = array.length - 1; i >= 0; i--) {
			const j = Math.random() * (i + 1) | 0;
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	/**
	 * @return 1：アニメーション、0：ステップ
	 */
	 public static getAnimateMode(): number {
		return $("input:radio[name='animation']:checked").val() as number;
	}

	/**
	 * ローディング画面を表示します。
	 * @param msg メッセージ
	 */
	 public static dispLoading(msg: string): void {
		$("#loadMsg").text(msg);
		$("#load").fadeIn(300);
	}

	/**
	 * ローディング画面を非表示にします。
	 */
	public static removeLoading(): void {
		$("#load").fadeOut(300);
	}

	/**
	 * ダイアログを表示します。
	 * @param msg メッセージ
	 * @param level エラーレベル "0":info、"1":warning、"2":error （デフォルトは"1"）
	 */
	public static dispMsg(msg: string, level: string): void {
		const dispTime = 3000;

		if (msg == undefined) {
			msg = "";
		}

		let color;
		switch (level) {
			case "0" :
			color = "#5D627B";
			break;
		case "1" :
			color = "#F39800";
			break;
		case "2" :
			color = "#DD0000";
			break;
		default:
			level = "1";
			color = "#F39800";
		}

		// メッセージを設定
		const $span = $("<span></span>").text(msg);
		const $upperMsg = $("<div></div>", {
			"class": "upperMsg"
		}).append($span);
		$("body").append($upperMsg);

		// メッセージボックスのスタイルを変更
		const negaMargin = ($upperMsg.width() as number) / 2 * (-1);
		$upperMsg.css("margin", "0 0 0 " + negaMargin + "px");
		$upperMsg.css("border-color", color);
		$upperMsg.css("color", color);

		$upperMsg.animate({
			top: "+=110px"
		}, 500, "swing", () => {
			$upperMsg.delay(dispTime).animate({
				top: "-=110px"
			}, 500, "swing", () => {
				$upperMsg.remove();
			});
		});
	}

}