import { Stage } from "@createjs/easeljs";
import { Ticker } from "@createjs/tweenjs";

export abstract class BaseCanvas {
	// property
	protected _stage: Stage;

	/**
	 * constructor
	 * @param {string} canvasId canvasのID 
	 * @param {boolean} isTick true：アニメーションあり / false：アニメーションなし
	 */
	constructor(canvasId: string, isTick: boolean) {
		this._stage = new Stage(canvasId);
		if (isTick) Ticker.addEventListener("tick", this._stage);
	}

}