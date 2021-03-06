import { Stage} from "@createjs/easeljs";
import { Ticker } from "@createjs/tweenjs";

export abstract class BaseCanvas {
	// CLASS FIELD
	protected _stage: Stage;

	/**
	 * コンストラクタ
	 * @param canvasId canvasのID 
	 * @param isTick true：アニメーションあり / false：アニメーションなし
	 */
	constructor(canvasId: string, isTick: boolean) {
		this._stage = new Stage(canvasId);
		if (isTick) Ticker.addEventListener("tick", this._stage);
	}

}