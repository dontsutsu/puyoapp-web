import { BaseMode } from "./base_mode";
import $ from "jquery";

$(() => {
	new Tokopuyo();
});

export class Tokopuyo extends BaseMode {
	// CLASS FIELD
	private _undoStack: {field: string, score: number}[];

	/**
	 * コンストラクタ
	 */
	constructor() {
		super();
		this._puyopuyo.initTokopuyo();
		this._undoStack = [];

		// event
		$("html").on("keydown", (e) => {
			switch(e.key) {
				case "ArrowRight" : // Key[→]
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					this._timelineList = this._puyopuyo.moveTsumo(1);
					this._timelineList.play();
				break;

				case "ArrowLeft" : // Key[←]
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					this._timelineList = this._puyopuyo.moveTsumo(-1);
					this._timelineList.play();
				break;

				case "ArrowDown" : // Key[↓]
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					// 落とせるかチェック
					if (!this._puyopuyo.isDroppableTsumo()) return;

					// UNDO用
					const field = this._puyopuyo.getFieldString();
					const score = this._puyopuyo.getScore();
					this._undoStack.push({field, score});

					const dropTlList = this._puyopuyo.dropTsumoToField();
					const advanceTsumoTlList = this._puyopuyo.advanceTsumo();

					this._timelineList = dropTlList.add(advanceTsumoTlList);
					this._timelineList.play();
				break;

				case "ArrowUp" : // Key[↑]
					const undo = this._undoStack.pop();

					if (undo == undefined) return;

					this._puyopuyo.setField(undo.field);
					this._puyopuyo.setScore(undo.score);
					this._puyopuyo.backTsumo();
				break;

				case "z" : // Key[z]
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					this._timelineList = this._puyopuyo.rotateTsumo(false);
					this._timelineList.play();
				break;

				case "x" : // Key[x]
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					this._timelineList = this._puyopuyo.rotateTsumo(true);
					this._timelineList.play();
				break;
			}
		});
	}
}