import { Game } from "../../game";

import $ from "jquery";
import { Timeline } from "@createjs/tweenjs";

/**
 * ぷよ用 createjs.Shape
 */
export class PuyoTimelineList {

	private _tlList: Timeline[];

	/**
	 * コンストラクタ
	 */
	constructor() {
		this._tlList = [];
	}

	/**
	 * @param timeline createjs.Timeline
	 */
	public push(timeline: Timeline): number {
		return this._tlList.push(timeline);
	}

	/**
	 * アニメーションを開始します。
	 * アニメーション中は操作の制御を行うため、gameクラスのフラグを変更します。
	 * @param game
	 */
	public play(game: Game): void {
		// アニメーションが設定されていない場合、何もしない
		if (this._tlList.length == 0) {
			return;
		}

		// アニメーションフラグtrue
		game.isAnimation = true;

		// timeScaleの設定、5が等速
		const speed = Number($("#speed").val());
		let timeScale: number;
		if (speed >= 5) {
			timeScale = (speed - 3) / 2;
		} else {
			timeScale = 2 / (7 - speed);
		}

		for (let i = 0; i < this._tlList.length; i++) {
			this._tlList[i].timeScale = timeScale;

			if (i < this._tlList.length - 1) {
				this._tlList[i].addEventListener("complete", () => {
					this._tlList[i + 1].gotoAndPlay(0);
				});
			} else {
				this._tlList[i].addEventListener("complete", () => {
					// アニメーションフラグfalse
					game.isAnimation = false;
					// console.log("ANIMATION END");
				});
			}
		}
		this._tlList[0].gotoAndPlay(0);
	}
}
