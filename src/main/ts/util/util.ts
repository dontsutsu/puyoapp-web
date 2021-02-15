import $ from "jquery";

export class Util {
  /**
   * ローディング画面を表示します
   * @param msg メッセージ
   */
  static dispLoading(msg: string): void {
    $("#loadMsg").text(msg);
    $("#load").fadeIn(300);
  }

  /**
   * ローディング画面を非表示にします
   */
  static removeLoading(): void {
    $("#load").fadeOut(300);
  }

  /**
   * @param msg
   * @param level "0":info, "1":warning, "2":error
   */
  static dispMsg(msg: string, level: string): void {
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
