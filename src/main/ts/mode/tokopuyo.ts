import { BaseMode } from "./base_mode";
import $ from "jquery";

$(() => {
	new Tokopuyo();
});

export class Tokopuyo extends BaseMode {
	constructor() {
		super();
		this._puyopuyo.initTokopuyo();

		// event
		$("html").on("keydown", (e) => {
			switch(e.key) {
				case "ArrowRight" : // Key[→]
					if (this._timelineList.isAnimation) return;

					this._timelineList = this._puyopuyo.moveTsumo(1);
					this._timelineList.play();
				break;

				case "ArrowLeft" : // Key[←]
					if (this._timelineList.isAnimation) return;

					this._timelineList = this._puyopuyo.moveTsumo(-1);
					this._timelineList.play();
				break;

				case "ArrowDown" : // Key[↓]
					if (this._timelineList.isAnimation) return;

					const dropTlList = this._puyopuyo.dropTsumoToField();
					const advanceTsumoTlList = this._puyopuyo.advanceTsumo();

					this._timelineList = dropTlList.add(advanceTsumoTlList);
					this._timelineList.play();
				break;

				case "z" : // Key[z]
					if (this._timelineList.isAnimation) return;

					this._timelineList = this._puyopuyo.rotateTsumo(false);
					this._timelineList.play();
				break;

				case "x" : // Key[x]
					if (this._timelineList.isAnimation) return;

					this._timelineList = this._puyopuyo.rotateTsumo(true);
					this._timelineList.play();
				break;
			}
		});
	}
}