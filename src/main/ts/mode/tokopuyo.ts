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
				// Key[→]
				case "ArrowRight" : {
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					this._timelineList = this._puyopuyo.moveTsumo(1);
					const before = () => { this._puyopuyo.hideGuide(); };
					const after = () => { this._puyopuyo.setGuide(); };
					this._timelineList.play(before, after);
					break;
				}

				// Key[←]
				case "ArrowLeft" : {
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					this._timelineList = this._puyopuyo.moveTsumo(-1);
					const before = () => { this._puyopuyo.hideGuide(); };
					const after = () => { this._puyopuyo.setGuide(); };
					this._timelineList.play(before, after);
					break;
				}

				// Key[↓]
				case "ArrowDown" : {
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					// 落とせるかチェック
					if (!this._puyopuyo.isDroppableTsumo()) return;

					// UNDO用
					const field = this._puyopuyo.getFieldString();
					const score = this._puyopuyo.getScore();
					this._undoStack.push({field, score});

					const drop = this._puyopuyo.dropTsumoToField();
					const advTsumo = this._puyopuyo.advanceTsumo();
					this._timelineList = drop.add(advTsumo);
					const before = () => { this._puyopuyo.hideGuide(); };
					const after = () => { this._puyopuyo.setGuide(); };
					this._timelineList.play(before, after);
					break;
				}

				// Key[↑]
				case "ArrowUp" : {
					const undo = this._undoStack.pop();

					if (undo == undefined) return;

					this._puyopuyo.setField(undo.field);
					this._puyopuyo.setScore(undo.score);
					this._puyopuyo.backTsumo();
					this._puyopuyo.setGuide();
					break;
				}

				// Key[z]
				case "z" : { 
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					this._timelineList = this._puyopuyo.rotateTsumo(false);
					const before = () => { this._puyopuyo.hideGuide(); };
					const after = () => { this._puyopuyo.setGuide(); };
					this._timelineList.play(before, after);
					break;
				}

				// Key[x]
				case "x" : {
					if (this._timelineList.isAnimation) return;

					// 死んでるかチェック
					if (this._puyopuyo.isDead()) return;

					this._timelineList = this._puyopuyo.rotateTsumo(true);
					const before = () => { this._puyopuyo.hideGuide(); };
					const after = () => { this._puyopuyo.setGuide(); };
					this._timelineList.play(before, after);
					break;
				}
			}
		});
	}
}